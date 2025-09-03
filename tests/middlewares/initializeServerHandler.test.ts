import express from 'express';
import request from 'supertest';
import { initializeServerHandler } from '../../src/middlewares/initializeServerHandler';
import { _resetGlobalStateForTests } from '../../src/utils/GlobalStateHelper';

describe('initializeServerHandler middleware', () => {
  let app: express.Express;
  const ORIGINAL_ENV = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    _resetGlobalStateForTests({ selectedServer: '' });
    app = express();
    app.use(express.json());

    // Attach the middleware under test and expose a simple endpoint
    app.use(initializeServerHandler);
    app.post('/check', async (req, res) => {
      try {
        // Use the attached handler to prove proper initialization
        const result = await (req as any).server.executeCommand('echo ok');
        res.status(200).json(result);
      } catch (e: any) {
        res.status(500).json({ error: e?.message || 'failed' });
      }
    });
  });

  afterAll(() => {
    process.env.NODE_ENV = ORIGINAL_ENV;
  });

  it('auto-attaches LocalServerHandler in test env when no server selected', async () => {
    const res = await request(app).post('/check').send({});
    expect(res.status).toBe(200);
    expect(res.body.stdout || res.body.result?.stdout).toContain('ok');
  });

  it('returns 500 when selected server is invalid', async () => {
    _resetGlobalStateForTests({ selectedServer: 'nonexistent-host' });
    const res = await request(app).post('/check').send({});
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Server not found|Failed to initialize/);
  });

  it('initializes handler when selected server is localhost', async () => {
    _resetGlobalStateForTests({ selectedServer: 'localhost' });
    const res = await request(app).post('/check').send({});
    expect(res.status).toBe(200);
    expect(res.body.stdout || res.body.result?.stdout).toContain('ok');
  });
});
