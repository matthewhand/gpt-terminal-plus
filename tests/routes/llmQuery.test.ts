import request from 'supertest';
import express, { Router } from 'express';
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

describe('LLM Query Routes', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  describe('POST /llm/query', () => {
    it('should process LLM query with tools', async () => {
      const response = await request(app)
        .post('/llm/query')
        .set('Authorization', `Bearer ${token}`)
        .send({
          prompt: 'What were the last 2 shell commands?',
          tools: ['readFile', 'listSessions']
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('prompt');
      expect(response.body.data).toHaveProperty('response');
      expect(response.body.data).toHaveProperty('toolsUsed');
      // Ensure toolsUsed echoes the requested tools and preserves order
      expect(response.body.data.toolsUsed).toEqual(['readFile', 'listSessions']);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/llm/query')
        .send({
          prompt: 'Test query',
          tools: ['listSessions']
        });

      expect(response.status).toBe(401);
    });

    it('should require prompt parameter', async () => {
      const response = await request(app)
        .post('/llm/query')
        .set('Authorization', `Bearer ${token}`)
        .send({
          tools: ['listSessions']
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Prompt is required');
    });

    it('should handle queries about recent commands', async () => {
      const response = await request(app)
        .post('/llm/query')
        .set('Authorization', `Bearer ${token}`)
        .send({
          prompt: 'Show me the last command executed',
          tools: ['listSessions', 'readFile']
        });

      expect(response.status).toBe(200);
      expect(response.body.data.response).toMatch(/session|activity|logs/i);
      // Should include the same tools back in the response data
      expect(response.body.data.toolsUsed).toEqual(['listSessions', 'readFile']);
    });

    it('should handle summarization requests', async () => {
      const response = await request(app)
        .post('/llm/query')
        .set('Authorization', `Bearer ${token}`)
        .send({
          prompt: 'Summarize recent activity',
          tools: ['listSessions', 'readFile']
        });

      expect(response.status).toBe(200);
      expect(response.body.data.response).toMatch(/summarize|tools|analyze/i);
      expect(response.body.data.toolsUsed).toEqual(['listSessions', 'readFile']);
    });
  });

  describe('GET /llm/console', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/llm/console');

      expect(response.status).toBe(401);
    });
  });
});
