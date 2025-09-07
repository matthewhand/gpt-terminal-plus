import request from 'supertest';
import express, { Router } from 'express';
import fs from 'fs';
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
  return app;
}

describe('Activity Routes', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  describe.skip('GET /activity/list', () => {
    it.skip('should return sessions list', async () => {
      const response = await request(app)
        .get('/activity/list')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('sessions');
      expect(Array.isArray(response.body.data.sessions)).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/activity/list');

      expect(response.status).toBe(401);
    });

    it.skip('should support limit parameter', async () => {
      const response = await request(app)
        .get('/activity/list?limit=5')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.sessions.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /activity/session/:date/:id', () => {
    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .get('/activity/session/2025-01-01/session_nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Session not found');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/activity/session/2025-01-01/session_test');

      expect(response.status).toBe(401);
    });
  });
});