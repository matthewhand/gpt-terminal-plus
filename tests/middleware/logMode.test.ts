import request from 'supertest';
import express from 'express';
import { logMode } from '../../src/middleware/logMode';

describe('logMode middleware', () => {
  let app: express.Application;
  let logs: string[] = [];

  beforeEach(() => {
    app = express();
    logs = [];
    const origLog = console.log;
    console.log = (msg?: any, ...optionalParams: any[]) => {
      logs.push(msg);
      origLog(msg, ...optionalParams);
    };
    app.use(logMode);
    app.get('/command/executeShell', (req, res) => res.send('ok'));
    app.get('/file/read', (req, res) => res.send('ok'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs command mode', async () => {
    await request(app).get('/command/executeShell');
    expect(logs.some(l => l.includes('mode=executeShell'))).toBe(true);
  });

  it('logs file mode', async () => {
    await request(app).get('/file/read');
    expect(logs.some(l => l.includes('mode=file:read'))).toBe(true);
  });
});
