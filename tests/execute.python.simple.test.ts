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

describe('execute-code (python) smoke', () => {
  const app = makeApp();
  const token = getOrGenerateApiToken();

  it('runs simple print via /command/execute-code', async () => {
    const res = await request(app)
      .post('/command/execute-code')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ language: 'python', code: 'print("hey")' });

    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(0);
    expect(res.body?.result?.stdout).toContain('hey');
  });
});
