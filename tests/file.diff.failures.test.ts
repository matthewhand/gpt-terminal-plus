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

describe('/file/diff failures', () => {
  const app = makeApp();
  const token = 'test-token';
  process.env.API_TOKEN = token;

  it('returns 400 on invalid diff text', async () => {
    const res = await request(app)
      .post('/file/diff')
      .set('Authorization', `Bearer ${token}`)
      .send({ diff: 'this is not a valid diff', dryRun: true });
    expect(res.status).toBe(400);
    expect(String(res.body?.message || '')).toMatch(/validation/i);
    // Handler returns 'details' containing validation error details
    expect(res.body?.errors || res.body?.stderr || res.body?.details).toBeDefined();
  });

  it('captures patch failed rejects in response', async () => {
    const badDiff = `diff --git a/NO_SUCH_FILE.txt b/NO_SUCH_FILE.txt\nindex 0000000..1111111 100644\n--- a/NO_SUCH_FILE.txt\n+++ b/NO_SUCH_FILE.txt\n@@ -1,1 +1,1 @@\n-hello\n+world\n`;
    const res = await request(app)
      .post('/file/diff')
      .set('Authorization', `Bearer ${token}`)
      .send({ diff: badDiff, dryRun: true });
    expect(res.status).toBe(400);
    // Accept any of errors/stderr/details depending on git version/handler
    expect(res.body?.errors || res.body?.stderr || res.body?.details).toBeDefined();
  });
});



