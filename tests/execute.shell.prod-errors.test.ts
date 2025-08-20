import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';

function makeProdApp() {
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

describe('execute-shell errors (prod route)', () => {
  const token = 'test-token';
  const originalShellAllowed = process.env.SHELL_ALLOWED;
  
  beforeAll(() => {
    process.env.API_TOKEN = token;
  });
  
  afterAll(() => {
    process.env.SHELL_ALLOWED = originalShellAllowed;
  });

  it('returns error for nonexistent binary in literal mode', async () => {
    const app = makeProdApp();
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: 'nonexistent-binary-xyz', args: ['--help'] });
    expect(res.status).toBe(200); // route handles errors gracefully
    expect(res.body?.result?.error).toBe(true);
    expect(res.body?.result?.exitCode).toBeGreaterThanOrEqual(1);
    expect(String(res.body?.result?.stderr || '')).toBeTruthy();
  });

  it('rejects disallowed shell', async () => {
    process.env.SHELL_ALLOWED = ''; // explicitly empty
    const app = makeProdApp();
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ shell: 'bash', command: 'echo ok' });
    expect(res.status).toBe(403);
    expect(res.body?.error).toMatch(/not allowed/i);
  });
});

