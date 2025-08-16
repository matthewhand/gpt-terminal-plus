import express from 'express';
import request from 'supertest';
import { checkAuthToken } from '../src/middlewares/checkAuthToken';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('middleware/checkAuthToken', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    token = getOrGenerateApiToken();
    app = express();
    app.get('/ok', checkAuthToken, (_req, res) => res.json({ ok: true }));
  });

  it('401 without token', async () => {
    const res = await request(app).get('/ok');
    expect(res.status).toBe(401);
  });

  it('403 with wrong token', async () => {
    const res = await request(app).get('/ok').set('Authorization', 'Bearer nope');
    expect(res.status).toBe(403);
  });

  it('200 with correct token', async () => {
    const res = await request(app).get('/ok').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

