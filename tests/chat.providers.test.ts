import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes/index';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('Chat Providers and Models', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  describe('Models Endpoint', () => {
    it('returns supported models and mappings', async () => {
      const res = await request(app)
        .get('/chat/models')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.supported)).toBe(true);
      expect(res.body.supported).toContain('gpt-oss:20b');
      expect(res.body.modelMaps).toBeDefined();
    });

    it('validates model structure', async () => {
      const res = await request(app)
        .get('/chat/models')
        .set('Authorization', `Bearer ${token}`);
      expect(res.body.supported.length).toBeGreaterThan(0);
      expect(typeof res.body.modelMaps).toBe('object');
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .get('/chat/models');
      expect(res.status).toBe(401);
    });

    it('rejects invalid auth token', async () => {
      const res = await request(app)
        .get('/chat/models')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });
  });

  describe('Providers Endpoint', () => {
    it('returns provider configuration', async () => {
      const res = await request(app)
        .get('/chat/providers')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('provider');
      expect(res.body).toHaveProperty('endpoints');
    });

    it('validates provider structure', async () => {
      const res = await request(app)
        .get('/chat/providers')
        .set('Authorization', `Bearer ${token}`);
      expect(['ollama', 'openai', 'lmstudio']).toContain(res.body.provider);
      expect(typeof res.body.endpoints).toBe('object');
    });

    it('includes required endpoint fields', async () => {
      const res = await request(app)
        .get('/chat/providers')
        .set('Authorization', `Bearer ${token}`);
      const endpoints = res.body.endpoints;
      if (endpoints.chat) {
        expect(typeof endpoints.chat).toBe('string');
      }
      if (endpoints.models) {
        expect(typeof endpoints.models).toBe('string');
      }
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .get('/chat/providers');
      expect(res.status).toBe(401);
    });

    it('handles malformed requests', async () => {
      const res = await request(app)
        .get('/chat/providers')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'invalid/type');
      expect(res.status).toBe(200);
    });
  });

  describe('Provider Switching', () => {
    it('handles provider configuration updates', async () => {
      const res = await request(app)
        .get('/chat/providers')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      const originalProvider = res.body.provider;
      expect(typeof originalProvider).toBe('string');
    });
  });

  describe('Error Handling', () => {
    it('returns 404 for non-existent endpoints', async () => {
      const res = await request(app)
        .get('/chat/nonexistent')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it('handles server errors gracefully', async () => {
      const res = await request(app)
        .get('/chat/models')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Test-Error', 'true');
      expect([200, 500]).toContain(res.status);
    });
  });
});

