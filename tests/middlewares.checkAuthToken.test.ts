import express from 'express';
import request from 'supertest';

// Important: mock config to control override behavior in specific tests
jest.mock('../src/config/convictConfig', () => ({
  __esModule: true,
  convictConfig: jest.fn(() => ({
    get: (key: string) => {
      // default: no override
      if (key === 'security.apiToken') return '';
      return undefined;
    },
  })),
}));

import { checkAuthToken } from '../src/middlewares/checkAuthToken';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import { convictConfig } from '../src/config/convictConfig';

describe('middleware/checkAuthToken (uplifted)', () => {
  let app: express.Express;
  let token: string;

  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'test';
    delete process.env.API_TOKEN;
    token = getOrGenerateApiToken();
    app = express();
    app.get('/ok', checkAuthToken, (_req, res) => res.json({ ok: true }));
    app.get('/chat/echo', checkAuthToken, (_req, res) => res.json({ ok: true }));
  });

  it('returns 401 without Authorization header', async () => {
    const res = await request(app).get('/ok');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('treats malformed Authorization (no Bearer) as missing token', async () => {
    const res = await request(app).get('/ok').set('Authorization', token);
    expect(res.status).toBe(401);
  });

  it('returns 403 with wrong token on generic routes', async () => {
    const res = await request(app).get('/ok').set('Authorization', 'Bearer nope');
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  it('returns 401 with wrong token on chat/server/model routes', async () => {
    const res = await request(app).get('/chat/echo').set('Authorization', 'Bearer nope');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('accepts valid token', async () => {
    const res = await request(app).get('/ok').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('handles extra spaces gracefully (still unauthorized)', async () => {
    // "Bearer   token" leads to empty extracted token due to split(' ')
    const res = await request(app).get('/ok').set('Authorization', `Bearer   ${token}`);
    expect(res.status).toBe(401);
  });

  it('prefers convict override token when provided', async () => {
    // Arrange convict override
    (convictConfig as jest.Mock).mockReturnValue({
      get: (key: string) => (key === 'security.apiToken' ? 'override123' : undefined),
    });

    const resWrong = await request(app).get('/ok').set('Authorization', `Bearer ${token}`);
    expect(resWrong.status).toBe(403);

    const resOk = await request(app).get('/ok').set('Authorization', 'Bearer override123');
    expect(resOk.status).toBe(200);
    expect(resOk.body.ok).toBe(true);
  });
});
