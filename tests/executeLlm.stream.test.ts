import express from 'express';
import request from 'supertest';
import { getOrGenerateApiToken } from '../src/common/apiToken';

jest.mock('../src/llm', () => {
  const original = jest.requireActual('../src/llm');
  return {
    ...original,
    chatForServer: async () => ({
      model: 'gpt-oss:20b',
      provider: 'ollama',
      choices: [ { index: 0, message: { role: 'assistant', content: JSON.stringify({ commands: [ { cmd: 'echo hi', explain: 'greet' } ] }) } } ]
    })
  };
});

function makeProdApp() {
  const app = express();
  app.use(express.json());
  const commandRoutes = require('../src/routes/commandRoutes').default;
  app.use('/command', commandRoutes);
  return app;
}

describe('execute-llm streaming', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    // Use prod/dev router to expose /command/execute-llm
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = makeProdApp();
  });

  it('streams plan and step events for local', (done) => {
    const agent = request.agent(app);
    agent.post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'text/event-stream')
      .send({ instructions: 'say hi', stream: true })
      .expect(200)
      .expect('Content-Type', /text\/event-stream/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain(': connected');
        expect(res.text).toContain('event: plan');
        expect(res.text).toContain('event: step');
        expect(res.text).toContain('event: done');
        done();
      });
  });
});
