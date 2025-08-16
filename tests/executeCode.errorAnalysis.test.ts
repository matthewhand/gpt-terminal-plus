import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chat to ensure deterministic aiAnalysis
jest.mock('../src/llm', () => ({
  chat: async () => ({ model: 'gpt-oss:20b', provider: 'ollama', choices: [ { index: 0, message: { role: 'assistant', content: 'Mock code analysis' } } ] })
}));

describe('execute-code error analysis', () => {
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

  it('attaches aiAnalysis on non-zero exit for code', async () => {
    const res = await request(app)
      .post('/command/execute-code')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'exit 9', language: 'bash' });

    expect(res.status).toBe(200);
    expect(res.body.result.exitCode).not.toBe(0);
    expect(res.body.aiAnalysis).toBeDefined();
  });
});

