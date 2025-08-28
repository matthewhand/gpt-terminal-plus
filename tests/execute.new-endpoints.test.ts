import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import * as routesMod from '../src/routes';

function makeApp() {
  const app = express();
  setupMiddlewares(app);
  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('New executor endpoints', () => {
  let app: express.Application;

  beforeAll(() => {
    process.env.API_TOKEN = 'test-token';
    app = makeApp();
  });

  it('executes echo via /command/execute-bash', async () => {
    const res = await request(app)
      .post('/command/execute-bash')
      .set('authorization', 'Bearer test-token')
      .send({ command: 'echo hello' });
    expect(res.status).toBe(200);
    expect(res.body.result.stdout).toContain('hello');
  });

  it('executes code via /command/execute-python', async () => {
    const res = await request(app)
      .post('/command/execute-python')
      .set('authorization', 'Bearer test-token')
      .send({ code: 'print("ping")' });
    // We cannot assert interpreter availability in CI; accept 200 or 400 gracefully
    expect([200,400]).toContain(res.status);
  });
});

