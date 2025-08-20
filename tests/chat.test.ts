import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes/index';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('Chat Routes', () => {
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

  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ model: 'llama3.1', message: { role: 'assistant', content: 'hello from mock' } })
    });
  });

  it('should return a chat completion response', async () => {
    const res = await request(app)
      .post('/chat/completions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        messages: [
          { role: 'user', content: 'Say hello' }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('choices');
    expect(Array.isArray(res.body.choices)).toBe(true);
    expect(res.body.choices[0].message.content).toContain('hello');
    expect(res.body).toHaveProperty('provider');
  });

  it('should validate body and reject missing messages', async () => {
    const res = await request(app)
      .post('/chat/completions')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

