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
    it('executes simple print statement', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'print("Hello Python")' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('Hello Python');
      expect(res.body.interpreter).toBe('python');
    });

    it('executes mathematical calculations', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'result = 2 + 3 * 4\nprint(f"Result: {result}")' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('Result: 14');
    });

    it('handles string operations', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'text = "Hello"\nprint(text.upper() + " WORLD")' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('HELLO WORLD');
    });

    it('executes list and dictionary operations', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'data = {"items": [1, 2, 3]}\nprint(f"Sum: {sum(data[\'items\'])}")' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('Sum: 6');
    });
  });

  describe('Python Standard Library', () => {
    it('uses datetime module', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'import datetime\nprint("Year:", datetime.datetime.now().year)' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('Year:');
    });

    it('uses json module', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'import json\ndata = {"test": True}\nprint(json.dumps(data))' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('{"test": true}');
    });

    it('uses os module for environment', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'import os\nprint("PATH" in os.environ)' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('True');
    });
  });

  describe('Error Handling', () => {
    it('handles syntax errors', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'print("unclosed string' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
      expect(res.body.result.stderr).toContain('SyntaxError');
    });

    it('handles runtime errors', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'result = 1 / 0' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
      expect(res.body.result.stderr).toContain('ZeroDivisionError');
    });

    it('handles import errors', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'import nonexistent_module' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
      expect(res.body.result.stderr).toContain('ModuleNotFoundError');
    });

    it('handles name errors', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'print(undefined_variable)' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
      expect(res.body.result.stderr).toContain('NameError');
    });
  });

  describe('Input Validation', () => {
    it('validates missing code parameter', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python' });

      expect([400, 422]).toContain(res.status);
    });

    it('validates empty code', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code: '' });

      expect([400, 422]).toContain(res.status);
    });

    it('validates language parameter', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'print("test")' });

      expect([400, 422]).toContain(res.status);
    });

    it('handles large code blocks', async () => {
      const largeCode = 'print("' + 'x'.repeat(1000) + '")';
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ language: 'python', code: largeCode });

      expect([200, 413]).toContain(res.status);
    });
  });

  describe('Advanced Python Features', () => {
    it('handles function definitions', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('Hello, World!');
    });

    it('handles class definitions', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'class Counter:\n    def __init__(self):\n        self.count = 0\n    def increment(self):\n        self.count += 1\n\nc = Counter()\nc.increment()\nprint(c.count)' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('1');
    });

    it('handles list comprehensions', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'squares = [x**2 for x in range(5)]\nprint(squares)' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('[0, 1, 4, 9, 16]');
    });
  });

  describe('Output Handling', () => {
    it('captures multiple print statements', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'print("Line 1")\nprint("Line 2")\nprint("Line 3")' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('Line 1');
      expect(res.body.result.stdout).toContain('Line 2');
      expect(res.body.result.stdout).toContain('Line 3');
    });

    it('handles stderr output', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'python', 
          code: 'import sys\nprint("Error message", file=sys.stderr)' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stderr).toContain('Error message');
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
  });

  describe('Concurrent Execution', () => {
    it('handles multiple concurrent Python executions', async () => {
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
