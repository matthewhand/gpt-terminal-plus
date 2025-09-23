import request from 'supertest';
import { app } from '../../utils/testApp';

describe('Middlewares: CORS and Security Headers', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    // Initialize app for testing
    await Promise.resolve(); // Placeholder
  });

  test('OPTIONS preflight includes CORS headers', async () => {
    const res = await request(app)
      .options('/command/execute-code')
      .set('Origin', 'http://example.test')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type');

    expect(res.status).toBeLessThan(400); // some frameworks return 204/200
    // With credentials=true and permissive origin, cors echoes the request origin
    expect(res.headers['access-control-allow-origin']).toBe('http://example.test');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
    expect(res.headers['access-control-allow-methods'] || '').toMatch(/GET|POST|OPTIONS/);
  });

  test('responses include helmet security headers', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBeLessThan(500);
    // A few representative helmet headers
    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['strict-transport-security']).toContain('max-age');
    // CSP is enabled with custom directives
    expect(res.headers['content-security-policy']).toBeDefined();
  });
});
