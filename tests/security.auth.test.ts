import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

jest.mock('../src/llm', () => ({
  chat: jest.fn().mockResolvedValue({ choices: [{ message: { role: 'assistant', content: 'mocked response' } }] }),
  chatStream: jest.fn(),
}));

function makeTestApp() {
  const app = express();
  setupMiddlewares(app);
  setupApiRouter(app);
  return app;
}

function makeProdApp() {
  jest.resetModules();
  const prevEnv = process.env.NODE_ENV;
  const prevDisable = process.env.DISABLE_PRIVATE_NETWORK_ACCESS;
  process.env.NODE_ENV = 'development';
  process.env.DISABLE_PRIVATE_NETWORK_ACCESS = 'true';
  const routesMod = require('../src/routes');
  const app = express();
  setupMiddlewares(app);
  routesMod.setupApiRouter(app);
  process.env.NODE_ENV = prevEnv;
  process.env.DISABLE_PRIVATE_NETWORK_ACCESS = prevDisable;
  return app;
}

describe('auth on command and chat routes', () => {
  let app: express.Express;
  let token: string;

  beforeEach(() => {
    const { _resetGlobalStateForTests } = require('../src/utils/GlobalStateHelper');
    const { __clearSessionsForTests } = require('../src/session/ShellSessionDriver');
    _resetGlobalStateForTests();
    __clearSessionsForTests();
    process.env.NODE_ENV = 'test';
    token = getOrGenerateApiToken();
    app = makeTestApp();
  });

  describe('/command/execute-shell', () => {
    it('returns 401 without a token', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .send({ command: 'echo hi' });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });
    });

    it('returns 403 with a wrong token', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', 'Bearer not-the-token')
        .send({ command: 'echo hi' });
      expect(res.status).toBe(403);
      expect(res.body).toEqual({ error: 'Forbidden' });
    });

    it('returns 200 with the correct token', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo hi' });
      expect(res.status).toBe(200);
      expect(res.body?.result?.stdout?.trim()).toBe('hi');
    });

    it('returns 401 without a token on the prod mount too', async () => {
      const prodApp = makeProdApp();
      const res = await request(prodApp)
        .post('/command/execute-shell')
        .send({ command: 'echo hi' });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('/chat/completions', () => {
    beforeEach(() => {
      // mock provider call so an authed request can succeed
      // @ts-ignore
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ model: 'llama3.1', message: { role: 'assistant', content: 'mocked' } })
      });
    });

    it('returns 401 without a token', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .send({ messages: [{ role: 'user', content: 'hi' }] });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });
    });

    it('returns 200 with the correct token', async () => {
      const res = await request(app)
        .post('/chat/completions')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'user', content: 'hi' }] });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('choices');
    });
  });

  describe('public endpoints stay public', () => {
    it('GET /health requires no token', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
    });
  });
});

describe('security headers (helmet-equivalent)', () => {
  it('sets X-Content-Type-Options, X-Frame-Options and Referrer-Policy', async () => {
    const app = makeTestApp();
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['referrer-policy']).toBe('no-referrer');
  });
});
