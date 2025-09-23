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

  describe('GET /activity/list', () => {
    beforeEach(() => {
      // Mock fs operations
      jest.spyOn(fs, 'readdir').mockImplementation((path: any) => {
        if (path.includes('data/activity')) {
          if (path.endsWith('activity')) {
            return Promise.resolve(['2025-01-01', '2025-01-02']);
          } else if (path.endsWith('2025-01-01')) {
            return Promise.resolve(['session_001', 'session_002']);
          } else if (path.endsWith('2025-01-02')) {
            return Promise.resolve(['session_003']);
          } else if (path.includes('session_')) {
            return Promise.resolve(['meta.json', '1-executeShell.json']);
          }
        }
        return Promise.resolve([]);
      });

      jest.spyOn(fs, 'readFile').mockImplementation((path: any) => {
        if (path.endsWith('meta.json')) {
          return Promise.resolve(JSON.stringify({
            sessionId: 'session_001',
            startedAt: '2025-01-01T10:00:00Z',
            user: 'testuser',
            label: 'Test Session'
          }));
        } else if (path.endsWith('1-executeShell.json')) {
          return Promise.resolve(JSON.stringify({
            type: 'executeShell',
            command: 'ls',
            timestamp: '2025-01-01T10:00:00Z'
          }));
        }
        return Promise.resolve('{}');
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return sessions list', async () => {
      const response = await request(app)
        .get('/activity/list')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('sessions');
      expect(Array.isArray(response.body.data.sessions)).toBe(true);
      expect(response.body.data.sessions.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/activity/list');

      expect(response.status).toBe(401);
    });

    it('should support limit parameter', async () => {
      const response = await request(app)
        .get('/activity/list?limit=1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.sessions.length).toBeLessThanOrEqual(1);
    });

    it('should support date parameter', async () => {
      const response = await request(app)
        .get('/activity/list?date=2025-01-01')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.sessions.every((s: any) => s.date === '2025-01-01')).toBe(true);
    });

    it('should support type filter', async () => {
      const response = await request(app)
        .get('/activity/list?type=executeShell')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.sessions.every((s: any) => s.types.includes('executeShell'))).toBe(true);
    });

    it('should handle missing activity directory', async () => {
      jest.spyOn(fs, 'readdir').mockRejectedValue(new Error('ENOENT'));
      const response = await request(app)
        .get('/activity/list')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.sessions).toEqual([]);
    });

    it('should handle invalid session directories', async () => {
      jest.spyOn(fs, 'readdir').mockResolvedValue(['invalid_dir']);
      const response = await request(app)
        .get('/activity/list')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
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