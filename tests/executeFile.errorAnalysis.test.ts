import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

jest.mock('../src/llm', () => ({
  chat: async () => ({ model: 'gpt-oss:20b', provider: 'ollama', choices: [ { index: 0, message: { role: 'assistant', content: 'Mock file analysis' } } ] })
}));

describe('execute-file error analysis', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    process.env.AUTO_ANALYZE_ERRORS = 'true';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  it('attaches aiAnalysis when execute-file fails', async () => {
    const res = await request(app)
      .post('/command/execute-file')
      .set('Authorization', `Bearer ${token}`)
      .send({ filename: '/path/does/not/exist' });

    expect(res.status).toBe(200);
    expect(res.body.result.error).toBe(true);
    expect(res.body.aiAnalysis).toBeDefined();
  });
});

