import request from 'supertest';
import express, { Router } from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';
import { registerServersFromConfig } from '../../src/bootstrap/serverLoader';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  } else {
    const router = Router();
    const setup = anyRoutes.setupRoutes || anyRoutes.default;
    if (typeof setup === 'function') setup(router);
    app.use('/', router);
  }
  return app;
}

describe('Server Routes with Registry', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    // Load servers from config into registry
    registerServersFromConfig();
    app = makeApp();
  });

  it('should return servers from registry', async () => {
    const response = await request(app)
      .get('/server/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('servers');
    expect(Array.isArray(response.body.servers)).toBe(true);
    
    if (response.body.servers.length > 0) {
      const server = response.body.servers[0];
      expect(server).toHaveProperty('hostname');
      expect(server).toHaveProperty('protocol');
      expect(server).toHaveProperty('registeredAt');
    }
  });

  it('should include localhost server from config', async () => {
    const response = await request(app)
      .get('/server/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    const hostnames = response.body.servers.map((s: any) => s.hostname);
    expect(hostnames).toContain('localhost');
  });
});