import request from 'supertest';
import express from 'express';
import { createLogMode } from '../../src/middleware/logMode';

describe('logMode middleware', () => {
  let app: express.Application;
  let logs: any[] = [];

  beforeEach(() => {
    app = express();
    logs = [];
    const mockLogger = (...args: any[]) => {
      logs.push(JSON.parse(args[0]));
    };
    const logMode = createLogMode(mockLogger as any);
    app.use(logMode);
    app.get('/command/executeShell', (req, res) => res.send('ok'));
    app.get('/file/read', (req, res) => res.send('ok'));
    app.get('/health', (req, res) => res.send('ok'));
    app.post('/command/executeLlm', (req, res) => res.send('ok'));
    app.get('/command', (req, res) => res.send('ok'));
  });

  it('logs command mode', async () => {
    await request(app).get('/command/executeShell');
    expect(logs.some(l => l.type === 'command' && l.mode === 'executeShell')).toBe(true);
  });

  it('logs file mode', async () => {
    await request(app).get('/file/read');
    expect(logs.some(l => l.type === 'file' && l.mode === 'read')).toBe(true);
  });

  it('does not log for unrelated paths', async () => {
    await request(app).get('/health');
    expect(logs.length).toBe(0);
  });

  it('logs for non-GET methods and ignores query strings', async () => {
    await request(app).post('/command/executeLlm?foo=bar');
    expect(logs.some(l => l.type === 'command' && l.mode === 'executeLlm')).toBe(true);
    expect(logs.length).toBe(1);
  });

  it('does not log when path lacks domain segment trailing slash', async () => {
    await request(app).get('/command');
    expect(logs.length).toBe(0);
  });
});
