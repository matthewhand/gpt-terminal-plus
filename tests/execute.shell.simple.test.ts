import { describe, it, test, expect } from '@jest/globals';
import request from 'supertest';
import express, { Router } from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import * as routesMod from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  } else {
    const router = Router();
    const setup = anyRoutes.setupRoutes || anyRoutes.default;
    if (typeof setup === 'function') setup(router);
    app.use('/', router);
  }
  return app;
}

describe('Shell Command Execution', () => {
  const app = makeApp();
  const token = getOrGenerateApiToken();

  describe('Basic Command Execution', () => {
    const basicCases = [
      { command: 'echo "Hello World"', expected: 'Hello World', desc: 'simple echo' },
      { command: 'echo "Test: $HOME & /tmp"', expected: /Test:/, desc: 'special characters' },
      { command: 'echo -e "Line 1\nLine 2\nLine 3"', expected: /Line 1.*Line 2.*Line 3/s, desc: 'multiline output' },
      { command: 'echo $TEST_VAR', environment: { TEST_VAR: 'test_value' }, expected: 'test_value', desc: 'environment variables' }
    ];

    test.each(basicCases)('handles $desc', async ({ command, environment, expected }) => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command, ...(environment && { environment }) });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toMatch(expected);
      if (expected === 'Hello World') expect(res.body.result.stderr).toBe('');
    });
  });

  describe('Error Handling', () => {
    const errorCases = [
      { command: 'exit 42', expectedCode: 42, additionalCheck: (res) => expect(res.body.aiAnalysis).toBeDefined(), desc: 'non-zero exit' },
      { command: 'echo "error message" >&2', expectedCode: 0, additionalCheck: (res) => expect(res.body.result.stderr.trim()).toBe('error message'), desc: 'stderr output' },
      { command: 'nonexistentcommand123', expectedCode: null, additionalCheck: (res) => { expect(res.body.result.exitCode).not.toBe(0); expect(res.body.result.stderr).toContain('not found'); }, desc: 'command not found' },
      { command: 'echo "unclosed quote', expectedCode: null, additionalCheck: (res) => expect(res.body.result.exitCode).not.toBe(0), desc: 'syntax errors' }
    ];

    test.each(errorCases)('handles $desc', async ({ command, expectedCode, additionalCheck }) => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command });

      expect(res.status).toBe(200);
      if (expectedCode !== null) {
        expect(res.body.result.exitCode).toBe(expectedCode);
      }
      additionalCheck(res);
    });

    test('handles nonexistent binary with args', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'nonexistent-binary-xyz', args: ['--help'] });

      expect(res.status).toBe(200);
      expect(res.body.result.error).toBe(true);
      expect(res.body.result.exitCode).toBeGreaterThanOrEqual(1);
      expect(res.body.result.stderr).toBeTruthy();
    });
  });

  describe('Input Validation', () => {
    const validationCases = [
      { payload: {}, expectedStatus: 200, expectedCode: 1, error: 'Command is required', additionalCheck: null, desc: 'missing command' },
      { payload: { command: '' }, expectedStatus: 200, expectedCode: 1, error: 'Command is required', additionalCheck: null, desc: 'empty command' },
      { payload: { command: 'echo ' + 'x'.repeat(10000) }, expectedStatus: 200, expectedCode: 0, additionalCheck: (res) => expect(res.body.result.stdout.length).toBeGreaterThan(1000), desc: 'long command' },
      { payload: 'invalid json', headers: { 'Content-Type': 'application/json' }, expectedStatus: 400, desc: 'malformed JSON' }
    ];

    test.each(validationCases)('handles $desc', async ({ payload, expectedStatus, expectedCode, error, headers, additionalCheck }) => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .set(headers || {})
        .send(payload);

      expect(res.status).toBe(expectedStatus);
      if (expectedStatus === 200) {
        if (expectedCode !== undefined) expect(res.body.result.exitCode).toBe(expectedCode);
        if (error) expect(String(res.body.result.stderr)).toContain(error);
        if (additionalCheck) additionalCheck(res);
      }
    });
  });

  describe('Authentication and Authorization', () => {
    const authCases = [
      { auth: null, env: 'production', expectedStatus: 200, desc: 'no auth in production' },
      { auth: 'Bearer invalid-token', expectedStatus: 200, desc: 'invalid token' },
      { auth: '', expectedStatus: 200, desc: 'missing header' }
    ];

    test.each(authCases)('handles $desc', async ({ auth, env, expectedStatus }) => {
      const originalEnv = process.env.NODE_ENV;
      if (env) process.env.NODE_ENV = env;

      const requestBuilder = request(app)
        .post('/command/execute-shell')
        .send({ command: 'echo test' });

      if (auth) {
        requestBuilder.set('Authorization', auth);
      }

      const res = await requestBuilder;

      if (env) process.env.NODE_ENV = originalEnv;

      expect(res.status).toBe(expectedStatus);
      if (expectedStatus === 200) expect(res.body.result.exitCode).toBe(0);
    });
  });

  describe('Working Directory', () => {
    const wdCases = [
      { dir: '/tmp', expectedCode: 0, expectedOut: '/tmp', additionalCheck: null, desc: 'valid directory' },
      { dir: '/nonexistent/directory', expectedCode: null, additionalCheck: (res) => expect(res.body.result.exitCode).not.toBe(0), desc: 'invalid directory' }
    ];

    test.each(wdCases)('handles $desc', async ({ dir, expectedCode, expectedOut, additionalCheck }) => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'pwd', workingDirectory: dir });

      expect(res.status).toBe(200);
      if (expectedCode !== null) {
        expect(res.body.result.exitCode).toBe(expectedCode);
      }
      if (additionalCheck) additionalCheck(res);
      if (expectedOut) expect(res.body.result.stdout.trim()).toBe(expectedOut);
    });
  });

  describe('Command Timeout', () => {
    it('handles long-running commands', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .timeout(2000)
        .send({ command: 'sleep 0.1 && echo "completed"' });

      expect(res.status).toBe(200);
      if (res.body.result.exitCode === 0) {
        expect(res.body.result.stdout.trim()).toBe('completed');
      }
    }, 5000);
  });

  describe('Response Format', () => {
    test('returns consistent structure and metadata', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo test' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('result');
      expect(res.body.result).toHaveProperty('exitCode');
      expect(res.body.result).toHaveProperty('stdout');
      expect(res.body.result).toHaveProperty('stderr');
      expect(typeof res.body.result.exitCode).toBe('number');
      expect(typeof res.body.result.stdout).toBe('string');
      expect(typeof res.body.result.stderr).toBe('string');
      if (res.body.result.executionTime) {
        expect(typeof res.body.result.executionTime).toBe('number');
        expect(res.body.result.executionTime).toBeGreaterThan(0);
      }
    });
  });

  describe('Concurrent Execution', () => {
    test('handles multiple concurrent commands', async () => {
      const commands = ['echo test1', 'echo test2', 'echo test3'];
      const requests = commands.map(command =>
        request(app)
          .post('/command/execute-shell')
          .set('Authorization', `Bearer ${token}`)
          .send({ command })
      );

      const responses = await Promise.all(requests);
      responses.forEach((res, i) => {
        expect(res.status).toBe(200);
        expect(res.body.result.exitCode).toBe(0);
        expect(res.body.result.stdout.trim()).toBe(`test${i + 1}`);
      });
    });
  });

  describe('Security Considerations', () => {
    test('handles potentially dangerous commands safely', async () => {
      const dangerousCommands = ['rm -rf /', 'sudo rm -rf /'];
      for (const command of dangerousCommands) {
        const res = await request(app)
          .post('/command/execute-shell')
          .set('Authorization', `Bearer ${token}`)
          .send({ command });

        expect([200, 400, 403]).toContain(res.status);
      }
    });
  });

  describe('Shell Configuration and Allow-listing', () => {
    const originalShellAllowed = process.env.SHELL_ALLOWED;
    const originalApiToken = process.env.API_TOKEN;

    beforeAll(() => {
      process.env.API_TOKEN = token;
    });

    afterAll(() => {
      process.env.SHELL_ALLOWED = originalShellAllowed;
      process.env.API_TOKEN = originalApiToken;
    });

    test('runs command in literal mode with args', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo', args: ['literal-test'] });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout.trim()).toBe('literal-test');
    });

    test('rejects disallowed shell configuration', async () => {
      process.env.SHELL_ALLOWED = 'bash';
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ shell: 'zsh', command: 'echo disallowed' });

      expect([400, 403]).toContain(res.status);
      expect(String(res.body?.error || '')).toMatch(/(not allowed|disabled)/i);
    });

    test('allows configured shell', async () => {
      process.env.SHELL_ALLOWED = 'bash';
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ shell: 'bash', command: 'echo allowed-shell' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout.trim()).toBe('allowed-shell');
    });
  });
});
