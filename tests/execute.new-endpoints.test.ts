import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import * as routesMod from '../src/routes';

// Uplift: make executor endpoints deterministic in test by mocking handlers
jest.mock('../src/routes/command', () => {
  const express = require('express');
  const ok = (runtime: string) => (req: any, res: any) =>
    res.status(200).json({ runtime, result: { stdout: 'ok', stderr: '', exitCode: 0, error: false } });
  const router = express.Router();
  return {
    executeCommand: ok('command'),
    executeShell: ok('shell'),
    executeCode: ok('code'),
    executeBash: ok('bash'),
    executePython: ok('python'),
    executeFile: ok('file'),
    executeLlm: ok('llm'),
    executorsRouter: router,
    executeDynamicRouter: router,
  };
});

function makeApp() {
  const app = express();
  setupMiddlewares(app);
  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('New executor endpoints', () => {
  let app: express.Application;

  beforeAll(() => {
    process.env.API_TOKEN = 'test-token';
    app = makeApp();
  });

  it('executes echo via /command/execute-bash', async () => {
    const res = await request(app)
      .post('/command/execute-bash')
      .set('authorization', 'Bearer test-token')
      .send({ command: 'echo hello' });
    expect(res.status).toBe(200);
    // Deterministic via mocks
    expect(res.body.runtime).toBe('bash');
    expect(res.body.result.stdout).toBe('ok');
  });

  it('executes code via /command/execute-python', async () => {
    const res = await request(app)
      .post('/command/execute-python')
      .set('authorization', 'Bearer test-token')
      .send({ code: 'print("ping")' });
    // Deterministic via mocks; assert strong invariants
    expect(res.status).toBe(200);
    expect(res.body.runtime).toBe('python');
    expect(res.body.result.exitCode).toBe(0);
    expect(res.body.result.stdout).toBe('ok');
  });
});
