import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

jest.mock('child_process', () => {
  const actual = jest.requireActual('child_process');
  return {
    ...actual,
    spawn: () => {
      const { PassThrough } = require('stream');
      const stdout = new PassThrough();
      const stderr = new PassThrough();
      const events: Record<string, Function[]> = {};
      const child: any = {
        stdout,
        stderr,
        stdin: new PassThrough(),
        on: (evt: string, cb: Function) => { (events[evt] = events[evt] || []).push(cb); return child; },
        kill: () => { (events['close']||[]).forEach(fn => fn(0)); },
      };
      process.nextTick(() => {
        stdout.write('Hello from interpreter');
        stdout.end();
        (events['close']||[]).forEach(fn => fn(0));
      });
      return child;
    }
  };
});

describe('execute-llm (interpreter engine)', () => {
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

  it('invokes interpreter CLI and returns stdout', async () => {
    const res = await request(app)
      .post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .send({ instructions: 'Say hello', engine: 'llm:interpreter', model: 'gpt-4o' });

    expect(res.status).toBe(200);
    expect(res.body?.engine).toBe('interpreter');
    expect(res.body?.result?.exitCode).toBe(0);
    expect(String(res.body?.result?.stdout)).toContain('Hello from interpreter');
  });
});


