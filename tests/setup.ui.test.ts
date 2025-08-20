import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import fs from 'fs';

describe('Setup UI', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setupApiRouter(app);
  });

  it('GET /setup returns UI', async () => {
    const res = await request(app).get('/setup').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.text).toContain('<h1>Setup UI</h1>');
  });

  it('POST /setup/local writes config', async () => {
    const res = await request(app)
      .post('/setup/local')
      .set('Authorization', `Bearer ${token}`)
      .type('form')
      .send({ hostname: 'localhost', code: 'true', postCommand: 'echo ok', 'llm.provider': 'ollama', 'llm.baseUrl': 'http://127.0.0.1:11434' });
    expect([200,302]).toContain(res.status);
    const raw = fs.readFileSync('config/test/test.json','utf8');
    expect(raw).toContain('localhost');
    expect(raw).toContain('ollama');
  });
});

