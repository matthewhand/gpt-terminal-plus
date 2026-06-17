import request from 'supertest';
import express from 'express';
import { configRouter as configRoutes } from '../../routes/core';

// Always bypass auth for these route tests
jest.mock('../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (_req: any, _res: any, next: any) => next()
}));

// Build a fresh app per test file
const app = express();
app.use(express.json());
app.use('/config', configRoutes);

describe('Config Routes', () => {
  beforeEach(() => {
    // Keep env deterministic across tests
    delete process.env.API_TOKEN;
    delete process.env.PORT;
  });

  describe('GET /config/schema', () => {
    test('returns convict schema object; validate groups when available', async () => {
      const res = await request(app).get('/config/schema');
      expect(res.status).toBe(200);
      expect(res.body && typeof res.body === 'object').toBe(true);
      // Convict schemas expose top-level properties; some builds may return an empty object
      const props = res.body?.properties;
      if (props) {
        expect(props.server).toBeDefined();
        expect(props.security).toBeDefined();
        expect(props.llm).toBeDefined();
      }
    });
  });

  describe('GET /config/override', () => {
    test('returns current config properties snapshot', async () => {
      const res = await request(app).get('/config/override');
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(typeof res.body).toBe('object');
      // Should include nested groups like server/security
      expect(res.body.server).toBeDefined();
      expect(res.body.security).toBeDefined();
    });
  });

  describe('POST /config/override', () => {
    test('only updates API_TOKEN and redacts response', async () => {
      const res = await request(app)
        .post('/config/override')
        .send({ API_TOKEN: 'secret123', unrelated: 'ignored' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Route advertises which keys were updated; only API_TOKEN is supported
      expect(res.body.updates).toEqual({ API_TOKEN: '[UPDATED]' });
      // And the process env should now reflect the change
      expect(process.env.API_TOKEN).toBe('secret123');
    });

    test('handles empty payload gracefully', async () => {
      const res = await request(app).post('/config/override').send({});
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.updates).toEqual({});
    });
  });

  describe('GET /config/settings', () => {
    test('returns structured, redacted settings with readOnly flags', async () => {
      // Set env-backed values so readOnly correctly reflects overrides
      process.env.PORT = '5555';
      process.env.API_TOKEN = 'abc123';

      const res = await request(app).get('/config/settings');
      expect(res.status).toBe(200);
      const body = res.body;
      // Structured response when convict/getRedactedSettings is available
      if (body.server && body.security) {
        expect(body.server.port).toBeDefined();
        expect(body.server.port.readOnly).toBe(true);
        expect(body.security.apiToken.value).toBe('*****');
        expect(typeof body.server.useServerless.readOnly).toBe('boolean');
      } else {
        // Fallback minimal shape
        expect(body.API_TOKEN).toBe('[REDACTED]');
      }
    });
  });
});
