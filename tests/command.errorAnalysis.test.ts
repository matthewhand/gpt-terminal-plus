import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chat to avoid network and provide deterministic analysis
jest.mock('../src/llm', () => {
  return {
    chat: async () => ({
      model: 'gpt-oss:20b',
      provider: 'ollama',
      choices: [ { index: 0, message: { role: 'assistant', content: 'Mock analysis: likely exit due to test.' } } ]
    })
  };
});

describe('Error Analysis on Non-zero Exit', () => {
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

  it('attaches aiAnalysis when command exits non-zero', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: 'exit 2' });

    expect(res.status).toBe(200);
    expect(res.body.result.exitCode).toBeDefined();
    expect(res.body.result.exitCode).not.toBe(0);
    expect(res.body.aiAnalysis).toBeDefined();
    expect(res.body.aiAnalysis.text).toContain('Mock analysis');
  });
});

