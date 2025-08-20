import request from 'supertest';
import express, { Router } from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import * as routesMod from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

function makeApp() {
  const app = express();
  // middlewares does not return app; it mutates in place
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

describe('execute (shell) smoke', () => {
  const app = makeApp();
  const token = 'test-token';
  process.env.API_TOKEN = token;

  it('runs echo via /command/execute-shell', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ command: 'echo ok' });

    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(0);
    expect(res.body?.result?.stdout?.trim()).toBe('ok');
  });

  it('handles exit codes', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: 'exit 1' });

    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(1);
    expect(res.body?.aiAnalysis).toBeDefined();
  });

  it('works without auth in test mode', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .send({ command: 'echo test' });

    expect(res.status).toBe(200);
    expect(res.body?.result?.stdout?.trim()).toBe('test');
  });

  it('validates command parameter', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(1);
  });

  it('runs python command via /command/execute-shell', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ shell: 'python', command: 'print("hello from python")' });

    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(0);
    expect(res.body?.result?.stdout?.trim()).toBe('hello from python');
  });
});
