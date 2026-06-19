import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';

/**
 * Full shell-session lifecycle over HTTP: start -> exec (real command output) ->
 * logs -> stop -> exec refused. Regression guard for the bug where the legacy
 * `/:id?/exec` stub shadowed the real `/:id/exec` handler, so session exec never
 * actually ran the command (it returned only `{ sessionId }`).
 */
function makeApp() {
  const app = express();
  setupMiddlewares(app);
  (routesMod as any).setupApiRouter?.(app);
  return app;
}

describe('Shell session lifecycle (HTTP)', () => {
  const token = 'test-token';
  let app: express.Application;

  beforeAll(() => {
    process.env.API_TOKEN = token;
    process.env.NODE_ENV = 'test';
    app = makeApp();
  });

  beforeEach(() => {
    const { __clearSessionsForTests } = require('../../src/session/ShellSessionDriver');
    __clearSessionsForTests();
  });

  const auth = (r: request.Test) => r.set('Authorization', `Bearer ${token}`);

  it('start -> exec runs the command -> logs -> stop -> exec refused', async () => {
    // start
    const started = await auth(request(app).post('/shell/session/start')).send({ shell: 'bash' });
    expect(started.status).toBe(200);
    const id = started.body.id;
    expect(id).toMatch(/^sess-/);
    expect(started.body.status).toBe('running');

    // exec — the real handler actually runs the command and returns its stdout,
    // not just an echoed sessionId.
    const exec = await auth(request(app).post(`/shell/session/${id}/exec`)).send({ command: 'echo lifecycle_ok' });
    expect(exec.status).toBe(200);
    expect(exec.body.stdout).toContain('lifecycle_ok');
    expect(exec.body.exitCode).toBe(0);
    expect(exec.body.success).toBe(true);

    // list reflects the session with a lastActivity timestamp
    const list = await auth(request(app).get('/shell/session/list'));
    expect(list.status).toBe(200);
    const found = (list.body.sessions || []).find((s: any) => s.id === id);
    expect(found).toBeTruthy();
    expect(found.status).toBe('running');
    expect(found.lastActivity).toBeTruthy();

    // logs contain the executed command
    const logs = await auth(request(app).get(`/shell/session/${id}/logs`));
    expect(logs.status).toBe(200);
    expect(logs.body.logs).toHaveLength(1);
    expect(logs.body.logs[0].command).toBe('echo lifecycle_ok');

    // stop marks it stopped
    const stop = await auth(request(app).post(`/shell/session/${id}/stop`));
    expect(stop.status).toBe(200);
    const afterStop = await auth(request(app).get('/shell/session/list'));
    const stopped = (afterStop.body.sessions || []).find((s: any) => s.id === id);
    expect(stopped.status).toBe('stopped');

    // exec on a stopped session is refused
    const refused = await auth(request(app).post(`/shell/session/${id}/exec`)).send({ command: 'echo nope' });
    expect(refused.status).toBe(500);
    expect(refused.body.error).toMatch(/stopped/i);
  });

  it('exec requires a command', async () => {
    const started = await auth(request(app).post('/shell/session/start')).send({ shell: 'bash' });
    const id = started.body.id;
    const res = await auth(request(app).post(`/shell/session/${id}/exec`)).send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });
});
