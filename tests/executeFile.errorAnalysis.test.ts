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

describe('execute-file (removed)', () => {
  const app = makeApp();
  const token = getOrGenerateApiToken();

  it('rejects requests to removed endpoint with 404', async () => {
    const res = await request(app)
      .post('/command/execute-file')
      .set('Authorization', `Bearer ${token}`)
      .send({ filename: 'script.sh' });

    expect([404, 400]).toContain(res.status);
  });
});
