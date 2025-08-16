import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes/index';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('Chat Providers and Models Endpoints', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  it('GET /chat/models returns supported and model maps', async () => {
    const res = await request(app)
      .get('/chat/models')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.supported)).toBe(true);
    expect(res.body.supported).toContain('gpt-oss:20b');
    expect(res.body.modelMaps).toBeDefined();
  });

  it('GET /chat/providers returns provider and endpoints', async () => {
    const res = await request(app)
      .get('/chat/providers')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('provider');
    expect(res.body).toHaveProperty('endpoints');
  });
});

