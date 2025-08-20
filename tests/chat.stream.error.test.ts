import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes/index';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chatStream to throw an error
jest.mock('../src/llm', () => {
  const original = jest.requireActual('../src/llm');
  return {
    ...original,
    chatStream: async function* () {
      throw new Error('mock stream failure');
    }
  };
});

describe('Chat Routes Streaming Error', () => {
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

  it('should send an error event and [DONE] on failure', async () => {
    const res = await request(app)
      .post('/chat/completions')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'text/event-stream')
      .send({
        stream: true,
        messages: [ { role: 'user', content: 'Trigger error' } ]
      });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/event-stream/);
    expect(res.text).toContain('event: error');
    expect(res.text).toContain('[DONE]');
  });
});

