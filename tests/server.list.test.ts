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

describe('Server Management API', () => {
  const app = makeApp();
  const token = getOrGenerateApiToken();

  describe('Server Listing', () => {
    it('returns server list with proper structure', async () => {
      const res = await request(app)
        .get('/server/list')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('servers');
      expect(Array.isArray(res.body.servers)).toBe(true);
    });

    it('validates server object structure', async () => {
      const res = await request(app)
        .get('/server/list')
        .set('Authorization', `Bearer ${token}`);

      if (res.body.servers.length > 0) {
        const server = res.body.servers[0];
        expect(server).toHaveProperty('hostname');
        expect(server).toHaveProperty('protocol');
        expect(['local', 'ssh', 'ssm']).toContain(server.protocol);
      }
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .get('/server/list');
      expect(res.status).toBe(401);
    });

    it('rejects invalid auth token', async () => {
      const res = await request(app)
        .get('/server/list')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });
  });

  describe('Server Registration', () => {
    it('registers new local server', async () => {
      const serverData = {
        hostname: 'test-local',
        protocol: 'local'
      };

      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(serverData);

      expect([200, 201]).toContain(res.status);
      if (res.body.success !== false) {
        expect(res.body).toHaveProperty('server');
      }
    });

    it('registers SSH server with credentials', async () => {
      const serverData = {
        hostname: 'test-ssh',
        protocol: 'ssh',
        host: 'ssh.example.com',
        port: 22,
        username: 'testuser'
      };

      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(serverData);

      expect([200, 201, 400]).toContain(res.status);
    });

    it('validates required fields', async () => {
      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('rejects invalid protocol', async () => {
      const serverData = {
        hostname: 'test-invalid',
        protocol: 'invalid-protocol'
      };

      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(serverData);

      expect(res.status).toBe(400);
    });
  });

  describe('Server Removal', () => {
    it('handles server removal requests', async () => {
      const res = await request(app)
        .delete('/server/remove/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect([200, 404]).toContain(res.status);
    });

    it('requires authentication for removal', async () => {
      const res = await request(app)
        .delete('/server/remove/test');
      expect(res.status).toBe(401);
    });
  });

  describe('Server Selection', () => {
    it('handles server selection', async () => {
      const res = await request(app)
        .post('/server/set')
        .set('Authorization', `Bearer ${token}`)
        .send({ hostname: 'localhost' });

      expect([200, 404]).toContain(res.status);
    });

    it('validates server selection payload', async () => {
      const res = await request(app)
        .post('/server/set')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('Error Handling', () => {
    it('handles malformed JSON', async () => {
      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(res.status).toBe(400);
    });

    it('returns 404 for non-existent endpoints', async () => {
      const res = await request(app)
        .get('/server/nonexistent')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
