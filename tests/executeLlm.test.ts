import express from 'express';
import request from 'supertest';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chatForServer to return a simple plan
jest.mock('../src/llm', () => {
  const original = jest.requireActual('../src/llm');
  return {
    ...original,
    chatForServer: async () => ({
      model: 'gpt-oss:20b',
      provider: 'ollama',
      choices: [ { index: 0, message: { role: 'assistant', content: JSON.stringify({ commands: [ { cmd: 'echo hello', explain: 'print greeting' } ] }) } } ]
    })
  };
});

function makeProdApp() {
  jest.resetModules();
  process.env.NODE_ENV = 'development';
  const routesMod = require('../src/routes');
  const app = express();
  app.use(express.json());
  if (typeof routesMod.setupApiRouter === 'function') {
    routesMod.setupApiRouter(app);
  } else if (routesMod.default) {
    routesMod.default(app);
  }
  return app;
}

describe('execute-llm', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    // Use prod/dev router to expose /command/execute-llm
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = makeProdApp();
  });

  it('returns a plan with dryRun', async () => {
    const res = await request(app)
      .post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .send({ instructions: 'Say hello', dryRun: true });

    expect(res.status).toBe(200);
    expect(res.body.plan).toBeDefined();
    expect(res.body.plan.commands[0].cmd).toContain('echo');
    expect(res.body.results).toEqual([]);
  });
});
