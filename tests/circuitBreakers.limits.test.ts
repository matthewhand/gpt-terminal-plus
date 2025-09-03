import request from 'supertest';
import { makeProdApp } from './utils/testApp';

// Only run these end-to-end prod-route tests when explicitly enabled.
// They exercise real middleware + route ordering and may be environment-sensitive.
const run = process.env.ENABLE_PROD_CIRCUIT_TESTS === '1' ? describe : describe.skip;

run('Circuit Breakers (prod routes)', () => {
  let app: any;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.USE_PROD_ROUTES_FOR_TEST = '1';
  });

  afterEach(() => {
    // Reset between tests to avoid cross-env bleed
    delete process.env.MAX_INPUT_CHARS;
    delete process.env.ALLOW_TRUNCATION;
  });

  test('execute-shell rejects over-limit input with 413 when truncation disabled', async () => {
    process.env.ALLOW_TRUNCATION = 'false';
    process.env.MAX_INPUT_CHARS = '100';
    app = await makeProdApp();

    const huge = 'x'.repeat(5000);
    const res = await request(app)
      .post('/command/execute-shell')
      .send({ command: `echo ${huge}` });

    expect(res.status).toBe(413);
    expect(res.body).toHaveProperty('error');
    expect(String(res.body.error)).toMatch(/input/i);
    expect(res.body).toHaveProperty('truncated', true);
    expect(typeof res.body.stdout).toBe('string');
    expect(res.body.stdout.length).toBeLessThanOrEqual(100);
  });

  test('execute-shell truncates over-limit input when truncation enabled', async () => {
    process.env.ALLOW_TRUNCATION = 'true';
    process.env.MAX_INPUT_CHARS = '64';
    app = await makeProdApp();

    const huge = 'y'.repeat(5000);
    const res = await request(app)
      .post('/command/execute-shell')
      .send({ command: `printf "${huge}"` });

    // Should execute successfully with truncated command applied server-side
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('result');
    const result = res.body.result || {};
    expect(result).toHaveProperty('exitCode');
    expect(typeof result.stdout).toBe('string');
    // Output will also be large, but command itself was truncated before execution
    // We assert the server responded OK rather than 413
    expect([0, 1]).toContain(result.exitCode);
  });
});
