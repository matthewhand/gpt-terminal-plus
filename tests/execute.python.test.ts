import request from 'supertest';
import express, { Router } from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import * as routesMod from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

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

describe('execute-shell (python) smoke', () => {
  const app = makeApp();
  const token = 'test-token';
  process.env.API_TOKEN = token;

  it('runs simple print via /command/execute-shell', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ shell: 'python', command: 'print("hey")' });

    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(0);
    expect(res.body?.result?.stdout).toContain('hey');
  });
});
