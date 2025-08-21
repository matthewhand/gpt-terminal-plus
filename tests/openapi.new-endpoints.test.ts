import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import * as routesMod from '../src/routes';

import { registerOpenAPIRoutes } from '../src/openapi';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  } else {
    const router = express.Router();
    const setup = anyRoutes.setupRoutes || anyRoutes.default;
    if (typeof setup === 'function') setup(router);
    app.use('/', router);
  }
  registerOpenAPIRoutes(app);
  return app;
}

describe('New OpenAPI Endpoints', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  it('should include /activity/list endpoint', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/activity/list:');
    expect(spec).toContain('summary: List recent activity sessions');
  });

  it('should include /activity/session/{date}/{id} endpoint', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/activity/session/{date}/{id}:');
    expect(spec).toContain('summary: Fetch a full activity session');
  });

  it('should include /shell/session/start endpoint', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/shell/session/start:');
    expect(spec).toContain('summary: Start a new persistent shell session');
  });

  it('should include /shell/session/{id}/exec endpoint', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/shell/session/{id}/exec:');
    expect(spec).toContain('summary: Execute command inside existing session');
  });

  it('should include /shell/session/{id}/stop endpoint', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/shell/session/{id}/stop:');
    expect(spec).toContain('summary: Stop a persistent shell session');
  });

  it('should include /shell/session/list endpoint', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/shell/session/list:');
    expect(spec).toContain('summary: List active shell sessions');
  });

  it('should include /shell/session/{id}/logs endpoint', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/shell/session/{id}/logs:');
    expect(spec).toContain('summary: Fetch logs from a shell session');
  });
});