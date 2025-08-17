import express from 'express';
import request from 'supertest';
import http from 'http';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('LLM settings test endpoint', () => {
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

  it('GET /settings includes llm block', async () => {
    const res = await request(app).get('/settings').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('llm');
  });

  it('POST /settings/llm/test returns ok false for unreachable provider', async () => {
    const res = await request(app)
      .post('/settings/llm/test')
      .set('Authorization', `Bearer ${token}`)
      .send({ provider: 'ollama', ollamaURL: 'http://127.0.0.1:1' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(false);
  });

  it('POST /settings/llm/test succeeds with mock openai server', async () => {
    const server = http.createServer((req, res) => {
      if (req.url === '/v1/models') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: [{ id: 'm1' }] }));
      } else {
        res.writeHead(404); res.end();
      }
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as any).port;
    const res = await request(app)
      .post('/settings/llm/test')
      .set('Authorization', `Bearer ${token}`)
      .send({ provider: 'openai', baseURL: `http://127.0.0.1:${port}` });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.models).toContain('m1');
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});

