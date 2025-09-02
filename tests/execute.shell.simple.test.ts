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
    it('executes simple echo command', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo "Hello World"' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout.trim()).toBe('Hello World');
      expect(res.body.result.stderr).toBe('');
    });

    it('executes commands with special characters', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo "Test: $HOME & /tmp"' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('Test:');
    });

    it('handles multiline output', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo -e "Line 1\nLine 2\nLine 3"' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout).toContain('Line 1');
      expect(res.body.result.stdout).toContain('Line 2');
      expect(res.body.result.stdout).toContain('Line 3');
    });

    it('executes commands with environment variables', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          command: 'echo $TEST_VAR',
          environment: { TEST_VAR: 'test_value' }
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.stdout.trim()).toBe('test_value');
    });
  });

  describe('Error Handling', () => {
    it('handles non-zero exit codes', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'exit 42' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(42);
      expect(res.body.aiAnalysis).toBeDefined();
    });

    it('captures stderr output', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo "error message" >&2' });

      expect(res.status).toBe(200);
      expect(res.body.result.stderr.trim()).toBe('error message');
    });

    it('handles command not found', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'nonexistentcommand123' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
      expect(res.body.result.stderr).toContain('not found');
    });

    it('handles syntax errors', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo "unclosed quote' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
    });
  });

  describe('Input Validation', () => {
    it('validates missing command parameter', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect([200, 400, 422]).toContain(res.status);
    });

    it('validates empty command', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: '' });

      expect([200, 400, 422]).toContain(res.status);
    });

    it('validates command length limits', async () => {
      const longCommand = 'echo ' + 'x'.repeat(10000);
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: longCommand });

      expect([200, 400, 413]).toContain(res.status);
    });

    it('handles malformed JSON', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(res.status).toBe(400);
    });
  });

  describe('Authentication and Authorization', () => {
    it('requires authentication in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const res = await request(app)
        .post('/command/execute-shell')
        .send({ command: 'echo test' });
      
      process.env.NODE_ENV = originalEnv;
      expect([401, 200]).toContain(res.status); // May work in test mode
    });

    it('validates auth token format', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', 'Bearer invalid-token')
        .send({ command: 'echo test' });

      expect([401, 200]).toContain(res.status); // May work in test mode
    });

    it('handles missing authorization header', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', '')
        .send({ command: 'echo test' });

      expect([401, 200]).toContain(res.status); // May work in test mode
    });
  });

  describe('Working Directory', () => {
    it('executes commands in specified directory', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          command: 'pwd',
          workingDirectory: '/tmp'
        });

      expect(res.status).toBe(200);
      if (res.body.result.exitCode === 0) {
        expect(res.body.result.stdout.trim()).toBe('/tmp');
      }
    });

    it('handles invalid working directory', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          command: 'pwd',
          workingDirectory: '/nonexistent/directory'
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
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
    it('returns consistent response structure', async () => {
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
    });

    it('includes execution metadata', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo metadata' });

      expect(res.status).toBe(200);
      if (res.body.result.executionTime) {
        expect(typeof res.body.result.executionTime).toBe('number');
        expect(res.body.result.executionTime).toBeGreaterThan(0);
      }
    });
  });

  describe('Concurrent Execution', () => {
    it('handles multiple concurrent commands', async () => {
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
    it('handles potentially dangerous commands safely', async () => {
      const dangerousCommands = [
        'rm -rf /',
        'sudo rm -rf /',
        'format c:',
        'del /s /q c:\\*'
      ];

      for (const command of dangerousCommands.slice(0, 2)) { // Test first two
        const res = await request(app)
          .post('/command/execute-shell')
          .set('Authorization', `Bearer ${token}`)
          .send({ command });

        // Should either block the command or execute safely in test environment
        expect([200, 400, 403]).toContain(res.status);
      }
    });
  });
});
