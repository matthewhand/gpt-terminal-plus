import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';

function makeProdApp() {
  // Force real routes (not test harness)
  jest.resetModules();
  process.env.NODE_ENV = 'development';

  const routesMod = require('../src/routes');
  const app = express();
  setupMiddlewares(app);

  if (typeof routesMod.setupApiRouter === 'function') {
    routesMod.setupApiRouter(app);
  } else if (routesMod.default) {
    routesMod.default(app);
  }
  return app;
}

describe('execute-shell (prod route) — literal vs allowed shells', () => {
  const token = 'test-token';
  let originalApiToken;

  beforeAll(() => {
    originalApiToken = process.env.API_TOKEN;
    process.env.API_TOKEN = token;
  });

  afterAll(() => {
    process.env.API_TOKEN = originalApiToken;
  });

  it('runs echo in literal mode with args', async () => {
    const app = makeProdApp();
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: 'echo', args: ['ok'] });
    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(0);
    expect(String(res.body?.result?.stdout).trim()).toBe('ok');
  });

  it('rejects disallowed shell', async () => {
    const app = makeProdApp();
    process.env.SHELL_ALLOWED = 'bash';
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ shell: 'zsh', command: 'echo ok' });
    expect([400,403]).toContain(res.status);
    // Accept both allow-list and executor-disable styles
    expect(String(res.body?.error || '')).toMatch(/(not allowed|disabled)/i);
  });

  it('allows configured shell (bash)', async () => {
    const app = makeProdApp();
    process.env.SHELL_ALLOWED = 'bash';
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ shell: 'bash', command: 'echo bash-ok' });
    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(0);
    expect(String(res.body?.result?.stdout).trim()).toBe('bash-ok');
  });
});
