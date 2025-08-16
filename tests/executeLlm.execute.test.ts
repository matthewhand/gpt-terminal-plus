import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chatForServer to return a failing plan
jest.mock('../src/llm', () => {
  const original = jest.requireActual('../src/llm');
  return {
    ...original,
    chatForServer: async () => ({
      model: 'gpt-oss:20b',
      provider: 'ollama',
      choices: [ { index: 0, message: { role: 'assistant', content: JSON.stringify({ commands: [ { cmd: 'bash -c "exit 3"', explain: 'force failure' } ] }) } } ]
    }),
    // Short-circuit analyze to deterministic text
    chat: async () => ({ model: 'gpt-oss:20b', provider: 'ollama', choices: [ { index: 0, message: { role: 'assistant', content: 'Mock fix' } } ] })
  };
});

describe('execute-llm execution path', () => {
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

  it('executes first command, stops on failure, attaches aiAnalysis', async () => {
    const res = await request(app)
      .post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .send({ instructions: 'do something', dryRun: false });

    expect(res.status).toBe(200);
    expect(res.body.plan).toBeDefined();
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].exitCode).not.toBe(0);
    expect(res.body.results[0]).toHaveProperty('aiAnalysis');
  });
});

