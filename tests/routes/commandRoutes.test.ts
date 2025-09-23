import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('Command Routes', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  describe('POST /command/execute-llm', () => {
    it('should handle dry run', async () => {
      const response = await request(app)
        .post('/command/execute-llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ instructions: 'test command', dryRun: true });

      expect(response.status).toBe(200);
      expect(response.body.plan).toBeDefined();
      expect(response.body.results).toEqual([]);
    });

    it('should handle streaming response', async () => {
      const response = await request(app)
        .post('/command/execute-llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ instructions: 'test command', stream: true });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/event-stream');
      expect(response.text).toContain('event: plan');
      expect(response.text).toContain('event: step');
      expect(response.text).toContain('event: done');
    });

    it('should handle interpreter engine', async () => {
      const response = await request(app)
        .post('/command/execute-llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ instructions: 'test', engine: 'llm:interpreter' });

      expect(response.status).toBe(200);
      expect(response.body.runtime).toBe('llm:interpreter');
      expect(response.body.result.stdout).toBe('Hello from interpreter');
    });

    it('should handle SSM commands', async () => {
      const response = await request(app)
        .post('/command/execute-llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ instructions: 'echo ssm hello' });

      expect(response.status).toBe(200);
      expect(response.body.results[0].stdout).toBe('ssm hello');
    });

    it('should handle remote instructions', async () => {
      const response = await request(app)
        .post('/command/execute-llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ instructions: 'remote command' });

      expect(response.status).toBe(200);
      expect(response.body.results[0].note).toBe('remote');
    });

    it('should handle failure cases', async () => {
      const response = await request(app)
        .post('/command/execute-llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ instructions: 'fail command' });

      expect(response.status).toBe(200);
      expect(response.body.results[0].error).toBe(true);
      expect(response.body.aiAnalysis).toBeDefined();
    });
  });

  describe('POST /command/diff', () => {
    it('should return 400 for missing filePath', async () => {
      const response = await request(app)
        .post('/command/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('filePath is required');
    });

    it('should return 404 for non-existent file', async () => {
      const response = await request(app)
        .post('/command/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/nonexistent/file.txt' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('File not found');
    });

    it('should return diff for existing file', async () => {
      const response = await request(app)
        .post('/command/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt' });

      expect(response.status).toBe(200);
      expect(response.body.diff).toContain('---');
      expect(response.body.diff).toContain('+++');
    });
  });

  describe('POST /command/patch', () => {
    it('should return 400 for missing parameters', async () => {
      const response = await request(app)
        .post('/command/patch')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('filePath and patch are required');
    });

    it('should return 404 for non-existent file', async () => {
      const response = await request(app)
        .post('/command/patch')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/nonexistent/file.txt', patch: 'diff content' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('File not found');
    });

    it('should handle invalid patch', async () => {
      const response = await request(app)
        .post('/command/patch')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt', patch: 'invalid patch content' });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBe('Invalid patch format');
    });

    it('should apply valid patch', async () => {
      const response = await request(app)
        .post('/command/patch')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt', patch: 'valid patch' });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });
  });

  describe('POST /command/execute-session', () => {
    it('should handle session retrieval', async () => {
      const response = await request(app)
        .post('/command/execute-session')
        .set('Authorization', `Bearer ${token}`)
        .send({ sessionId: 'test-session' });

      expect(response.status).toBe(200);
      expect(response.body.sessionId).toBe('test-session');
      expect(response.body.completed).toBe(true);
    });

    it('should handle long-running commands', async () => {
      const response = await request(app)
        .post('/command/execute-session')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'sleep 10' });

      expect(response.status).toBe(200);
      expect(response.body.sessionId).toMatch(/^session_/);
      expect(response.body.message).toContain('still running');
    });

    it('should handle quick completion', async () => {
      const response = await request(app)
        .post('/command/execute-session')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo hello' });

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
      expect(response.body.output).toBe('Command completed quickly');
    });
  });

  describe('authentication', () => {
    it('should require authentication for command routes', async () => {
      const response = await request(app)
        .post('/command/execute-llm')
        .send({ instructions: 'test' });

      expect(response.status).toBe(401);
    });
  });
});