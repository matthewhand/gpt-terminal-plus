import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes/index';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chatStream to yield deterministic chunks
jest.mock('../src/llm', () => {
  const original = jest.requireActual('../src/llm');
  return {
    ...original,
    chatStream: async function* () {
      yield 'Hello';
      yield ' world';
    }
  };
});

describe('Chat Routes Streaming', () => {
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

  it('should stream SSE chunks for chat', async () => {
    const res = await request(app)
      .post('/chat/completions')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'text/event-stream')
      .send({
        stream: true,
        messages: [
          { role: 'user', content: 'Say hello' }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/event-stream/);
    expect(res.text).toContain('data:');
    expect(res.text).toContain('Hello');
    expect(res.text).toContain('[DONE]');
  });
});

