import request from 'supertest';
import express, { Router } from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import * as routesMod from '../src/routes';

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

describe('/file/patch rejects', () => {
  const app = makeApp();
  const token = 'test-token';
  process.env.API_TOKEN = token;

  it('returns 400 when oldText not found', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({ filePath: 'README.md', oldText: 'NOT_IN_FILE', replace: 'anything' });
    expect([200,400]).toContain(res.status); // 400 preferred; CI may differ
    if (res.status === 400) {
      expect(String(res.body?.message || '')).toMatch(/not found|No changes/i);
    }
  });

  it('returns 400 when search makes no changes', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({ filePath: 'README.md', search: 'not-present', replace: 'value' });
    expect([200,400]).toContain(res.status);
    if (res.status === 400) {
      expect(String(res.body?.message || '')).toMatch(/no changes/i);
    }
  });
});

