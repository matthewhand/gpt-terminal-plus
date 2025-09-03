import request from 'supertest';
import express from 'express';
import { logMode } from '../../src/middleware/logMode';

describe('logMode middleware', () => {
  let app: express.Application;
  let logs: string[] = [];
  let originalConsoleLog: typeof console.log;

  beforeEach(() => {
    app = express();
    logs = [];
    originalConsoleLog = console.log;
    console.log = (msg?: any, ...optionalParams: any[]) => {
      logs.push(msg);
      originalConsoleLog(msg, ...optionalParams);
    };
    app.use(logMode);
    app.get('/command/executeShell', (req, res) => res.send('ok'));
    app.get('/file/read', (req, res) => res.send('ok'));
    app.get('/health', (req, res) => res.send('ok'));
  });

  afterEach(() => {
    // restore our manual patch to console.log
    console.log = originalConsoleLog;
  });

  it('logs command mode', async () => {
    await request(app).get('/command/executeShell');
    expect(logs.some(l => l.includes('mode=executeShell'))).toBe(true);
  });

  it('logs file mode', async () => {
    await request(app).get('/file/read');
    expect(logs.some(l => l.includes('mode=file:read'))).toBe(true);
  });

  it('does not log for unrelated paths', async () => {
    await request(app).get('/health');
    expect(logs.length).toBe(0);
  });
});
