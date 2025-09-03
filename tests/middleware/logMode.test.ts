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
    // Ensure the TODO prefix is preserved for structured logging
    expect(logs.some(l => typeof l === 'string' && l.startsWith('[TODO] Incoming request'))).toBe(true);
  });

  it('logs file mode', async () => {
    await request(app).get('/file/read');
    expect(logs.some(l => l.includes('mode=file:read'))).toBe(true);
    // Ensure the TODO prefix is preserved for structured logging
    expect(logs.some(l => typeof l === 'string' && l.startsWith('[TODO] Incoming request'))).toBe(true);
  });

  it('does not log for unrelated paths', async () => {
    await request(app).get('/health');
    expect(logs.length).toBe(0);
  });

  it('logs for non-GET methods and ignores query strings', async () => {
    // No route is mounted for POST here; we only care that middleware ran
    await request(app).post('/command/executeLlm?foo=bar');
    expect(logs.some(l => l.includes('mode=executeLlm'))).toBe(true);
    // Ensure only one log line is produced per request
    const count = logs.filter(l => typeof l === 'string' && l.startsWith('[TODO] Incoming request')).length;
    expect(count).toBe(1);
  });

  it('does not log when path lacks domain segment trailing slash', async () => {
    // '/command' should not match '/command/' prefix check
    await request(app).get('/command');
    expect(logs.length).toBe(0);
  });
});
