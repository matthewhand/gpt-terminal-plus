import request from 'supertest';
import express, { Router } from 'express';
import path from 'path';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }

  // Serve static files like the prod index does so we can assert HTML assets.
  const rootDir = path.resolve(__dirname, '..', '..');
  app.use(express.static(path.join(rootDir, 'public')));
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
    it('returns 404 when either LLM or Console feature is disabled', async () => {
      delete process.env.LLM_ENABLED; // default true in config, rely on console disabled
      delete process.env.LLM_CONSOLE_ENABLED; // ensure console disabled
      app = makeApp();
      const response = await request(app)
        .get('/llm/console')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/LLM Console is not available/i);
    });

    it('serves HTML when both LLM and Console feature are enabled', async () => {
      process.env.LLM_ENABLED = 'true';
      process.env.LLM_CONSOLE_ENABLED = 'true';
      app = makeApp();
      const response = await request(app)
        .get('/llm/console')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      // Content-Type should be HTML when the console is served
      expect(String(response.headers['content-type'])).toMatch(/text\/html/);
      // Basic sanity check that the HTML file is returned
      expect(response.text).toMatch(/LLM Console/i);
    });
  });

  describe('POST /llm/query with feature dependencies', () => {
    it('returns 200 with response structure when LLM is enabled', async () => {
      process.env.LLM_ENABLED = 'true';
      delete process.env.LLM_CONSOLE_ENABLED; // console toggle not required for query
      app = makeApp();
      const response = await request(app)
        .post('/llm/query')
        .set('Authorization', `Bearer ${token}`)
        .send({
          prompt: 'Test query',
          tools: ['listSessions']
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.prompt).toBe('Test query');
    });

    it('returns 404 when LLM is disabled', async () => {
      process.env.LLM_ENABLED = 'false';
      app = makeApp();
      const response = await request(app)
        .post('/llm/query')
        .set('Authorization', `Bearer ${token}`)
        .send({ prompt: 'Test query' });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/LLM querying is not available/i);
    });
  });

  describe('Dashboard integration', () => {
    it('should serve dashboard page', async () => {
      const response = await request(app).get('/dashboard.html');
      expect(response.status).toBe(200);
      // Basic content check to ensure correct asset served
      expect(String(response.headers['content-type'])).toMatch(/text\/html/);
      expect(response.text).toMatch(/<title>Dashboard - GPT Terminal Plus<\/title>|<h1>Dashboard<\/h1>/i);
    });
  });
});
