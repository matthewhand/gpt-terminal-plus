import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock SSH client
jest.mock('ssh2', () => {
  const events: any = require('events');
  class MockStream extends events.EventEmitter {
    stderr = new events.EventEmitter();
    close(code: number) { this.emit('close', code); }
  }
  class Client extends events.EventEmitter {
    connect() { setImmediate(() => this.emit('ready')); }
    exec(_cmd: string, cb: any) {
      const s = new MockStream();
      cb(null, s);
      setImmediate(() => { s.emit('data', Buffer.from('remote\n')); s.close(0); });
    }
    end() {}
  }
  return { Client };
});

// Mock plan generation
jest.mock('../src/llm', () => {
  const original = jest.requireActual('../src/llm');
  return {
    ...original,
    chatForServer: async () => ({
      model: 'gpt-oss:20b',
      provider: 'ollama',
      choices: [ { index: 0, message: { role: 'assistant', content: JSON.stringify({ commands: [ { cmd: 'echo remote', explain: 'greet' } ] }) } } ]
    })
  };
});

describe('execute-llm SSH streaming (mocked)', () => {
  let app: express.Express;
  let token: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setupApiRouter(app);
    // Ensure SSH host has LLM
    await request(app).post('/setup/ssh').set('Authorization', `Bearer ${token}`).type('form')
      .send({ edit: 'ssh-bash.example.com', hostname: 'ssh-bash.example.com', port: '22', username: 'chatgpt', privateKeyPath: '/home/chatgpt/.ssh/id_rsa', 'llm.provider': 'ollama', 'llm.baseUrl': 'http://mock:11434' });
    // Select server
    await request(app).post('/server/set').set('Authorization', `Bearer ${token}`).send({ server: 'ssh-bash.example.com', getSystemInfo: false });
  });

  it('streams plan and step events via SSH', async () => {
    const res = await request(app)
      .post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'text/event-stream')
      .send({ instructions: 'echo remote', stream: true });
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/event-stream/);
    expect(res.text).toContain('event: plan');
    expect(res.text).toContain('event: step');
    expect(res.text).toContain('remote');
    expect(res.text).toContain('event: done');
  });
});

