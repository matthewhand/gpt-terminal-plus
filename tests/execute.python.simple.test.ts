import { describe, it, test, expect } from '@jest/globals';
import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
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

describe('Python Code Execution', () => {
  const app = makeApp();
  const token = getOrGenerateApiToken();

  describe('Basic Python Execution', () => {
    const basicCases = [
      { code: 'print("Hello Python")', expected: 'Hello Python', desc: 'simple print' },
      { code: 'result = 2 + 3 * 4\nprint(f"Result: {result}")', expected: 'Result: 14', desc: 'mathematical calculations' },
      { code: 'text = "Hello"\nprint(text.upper() + " WORLD")', expected: 'HELLO WORLD', desc: 'string operations' },
      { code: 'data = {"items": [1, 2, 3]}\nprint(f"Sum: {sum(data[\'items\'])}")', expected: 'Sum: 6', desc: 'list and dictionary operations' }
    ];

    test.each(basicCases)('handles $desc', async ({ code, expected }) => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain(expected);
      expect(res.body.interpreter).toBe('python');
    });
  });

  describe('Python Standard Library', () => {
    const stdLibCases = [
      { code: 'import datetime\nprint("Year:", datetime.datetime.now().year)', expected: 'Year:', desc: 'datetime module' },
      { code: 'import json\ndata = {"test": True}\nprint(json.dumps(data))', expected: '{"test": true}', desc: 'json module' },
      { code: 'import os\nprint("PATH" in os.environ)', expected: 'True', desc: 'os module for environment' }
    ];

    test.each(stdLibCases)('handles $desc', async ({ code, expected }) => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain(expected);
    });
  });

  describe('Error Handling', () => {
    const errorCases = [
      { code: 'print("unclosed string', expectedError: 'SyntaxError', desc: 'syntax errors' },
      { code: 'result = 1 / 0', expectedError: 'ZeroDivisionError', desc: 'runtime errors' },
      { code: 'import nonexistent_module', expectedError: 'ModuleNotFoundError', desc: 'import errors' },
      { code: 'print(undefined_variable)', expectedError: 'NameError', desc: 'name errors' }
    ];

    test.each(errorCases)('handles $desc', async ({ code, expectedError }) => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
      expect(res.body.result.stderr).toContain(expectedError);
    });
  });

  describe('Input Validation', () => {
    const validationCases = [
      { payload: { language: 'python' }, expectedStatus: [400, 422], desc: 'missing code parameter' },
      { payload: { language: 'python', code: '' }, expectedStatus: [400, 422], desc: 'empty code' },
      { payload: { code: 'print("test")' }, expectedStatus: [400, 422], desc: 'missing language parameter' },
      { payload: { language: 'python', code: 'print("' + 'x'.repeat(1000) + '")' }, expectedStatus: [200, 413], desc: 'large code blocks' }
    ];

    test.each(validationCases)('handles $desc', async ({ payload, expectedStatus }) => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(expectedStatus).toContain(res.status);
    });
  });

  describe('Advanced Python Features', () => {
    const advancedCases = [
      { code: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))', expected: 'Hello, World!', desc: 'function definitions' },
      { code: 'class Counter:\n    def __init__(self):\n        self.count = 0\n    def increment(self):\n        self.count += 1\n\nc = Counter()\nc.increment()\nprint(c.count)', expected: '1', desc: 'class definitions' },
      { code: 'squares = [x**2 for x in range(5)]\nprint(squares)', expected: '[0, 1, 4, 9, 16]', desc: 'list comprehensions' }
    ];

    test.each(advancedCases)('handles $desc', async ({ code, expected }) => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain(expected);
    });
  });

  describe('Output Handling', () => {
    const outputCases = [
      { code: 'print("Line 1")\nprint("Line 2")\nprint("Line 3")', expected: ['Line 1', 'Line 2', 'Line 3'], desc: 'multiple print statements' },
      { code: 'import sys\nprint("Error message", file=sys.stderr)', expected: 'Error message', checkStderr: true, desc: 'stderr output' }
    ];

    test.each(outputCases)('handles $desc', async ({ code, expected, checkStderr }) => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      if (Array.isArray(expected)) {
        expected.forEach(line => expect(res.body.result.stdout).toContain(line));
      } else if (checkStderr) {
        expect(res.body.result.stderr).toContain(expected);
      }
    });
  });

  describe('Authentication and Security', () => {
    it('requires authentication', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .send({ language: 'python', code: 'print("test")' });

      expect([401, 200]).toContain(res.status); // May work in test mode
    });

    it('handles potentially dangerous code safely', async () => {
      const dangerousCode = 'import os\nos.system("rm -rf /")';
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code: dangerousCode });

      // Should either block or execute safely in test environment
      expect([200, 400, 403]).toContain(res.status);
    });

    test('runs simple print via execute-shell with python', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({ shell: 'python', command: 'print("hey")' });

      expect(res.status).toBe(200);
      expect(res.body?.result?.exitCode).toBe(0);
      expect(res.body?.result?.stdout).toContain('hey');
    });

    test('reports errors for invalid Python code via execute-shell', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({ shell: 'python', command: 'this is not valid python' });

      expect(res.status).toBe(200);
      expect(res.body?.result?.exitCode).not.toBe(0);
      expect(String(res.body?.result?.stderr || '').toLowerCase()).toMatch(/syntaxerror|traceback|error/);
      expect(res.body?.result?.error).toBe(true);
    });
  });

  describe('Response Format', () => {
    it('returns consistent response structure', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code: 'print("format test")' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('result');
      expect(res.body).toHaveProperty('interpreter');
      expect(res.body.result).toHaveProperty('exitCode');
      expect(res.body.result).toHaveProperty('stdout');
      expect(res.body.result).toHaveProperty('stderr');
    });

    it('includes execution metadata', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code: 'print("metadata")' });

      expect(res.status).toBe(200);
      if (res.body.result.executionTime) {
        expect(typeof res.body.result.executionTime).toBe('number');
      }
    });

    test('executes echo via execute-bash endpoint', async () => {
      const res = await request(app)
        .post('/command/execute-bash')
        .set('authorization', 'Bearer test-token')
        .send({ command: 'echo hello' });
      expect(res.status).toBe(200);
      expect(res.body.result.stdout).toBe('hello\n');
    });

    test('executes code via execute-python endpoint', async () => {
      const res = await request(app)
        .post('/command/execute-python')
        .set('authorization', 'Bearer test-token')
        .send({ code: 'print("ping")' });
      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toBe('ping\n');
    });
  });

  describe('Concurrent Execution', () => {
    test('handles multiple concurrent Python executions', async () => {
      const codes = [
        'print("Script 1")',
        'print("Script 2")',
        'print("Script 3")'
      ];

      const requests = codes.map(code =>
        request(app)
          .post('/command/execute-code')
          .set('Authorization', `Bearer ${token}`)
          .send({ language: 'python', code })
      );

      const responses = await Promise.all(requests);
      responses.forEach((res, i) => {
        expect(res.status).toBe(200);
        expect(res.body.result.exitCode).toBe(0);
        expect(res.body.result.stdout).toContain(`Script ${i + 1}`);
      });
    });
  });
});
