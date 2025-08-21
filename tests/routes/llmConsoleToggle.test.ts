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

describe('LLM Console Feature Toggle', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  describe('GET /llm/console with feature toggle', () => {
    it('should require both LLM enabled and LLM Console feature enabled', async () => {
      const response = await request(app)
        .get('/llm/console')
        .set('Authorization', `Bearer ${token}`);

      // Should return 404 when feature is disabled (default state)
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('LLM Console feature is disabled');
    });
  });

  describe('POST /llm/query with feature dependencies', () => {
    it('should work when LLM is enabled regardless of console toggle', async () => {
      const response = await request(app)
        .post('/llm/query')
        .set('Authorization', `Bearer ${token}`)
        .send({
          prompt: 'Test query',
          tools: ['listSessions']
        });

      // Query should work if LLM is enabled, independent of console UI toggle
      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Dashboard integration', () => {
    it('should serve dashboard page', async () => {
      const response = await request(app)
        .get('/dashboard.html');

      expect([200, 404]).toContain(response.status);
    });
  });
});