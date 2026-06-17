import request from 'supertest';
import { makeProdApp } from './utils/testApp';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// This suite validates input-size circuit breakers for /command/execute-shell
// in a deterministic way. It does not rely on optional route wiring flags.

describe('Circuit Breakers: execute-shell input limits', () => {
  let app: any;
  let token: string;

  beforeAll(async () => {
    process.env.USE_PROD_ROUTES_FOR_TEST = '1';
    // makeProdApp now handles token + config setup for auth in shared prod routes
    app = await makeProdApp();
    token = getOrGenerateApiToken();
  });

  afterAll(() => {
    delete process.env.USE_PROD_ROUTES_FOR_TEST;
  });

  test('rejects with 413 when over limit and truncation disabled', async () => {
    process.env.MAX_INPUT_CHARS = '100';
    process.env.ALLOW_TRUNCATION = 'false';
    const huge = 'x'.repeat(5000);

    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: `echo ${huge}` });
    expect(res.status).toBe(413);
    expect(res.body).toMatchObject({ error: 'Input exceeded limit', truncated: true });
    expect(typeof res.body.stdout).toBe('string');
    expect(res.body.stdout.length).toBe(Number(process.env.MAX_INPUT_CHARS));
  });

  test('truncates command when over limit and truncation enabled', async () => {
    process.env.MAX_INPUT_CHARS = '100';
    process.env.ALLOW_TRUNCATION = 'true';
    const huge = 'x'.repeat(5000);

    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: `echo ${huge}` });
    // Expect success because input is truncated and executed
    expect(res.status).toBe(200);
    // Truncated command includes the leading 'echo ' (length 5), so output x-count is limit-5
    const limit = Number(process.env.MAX_INPUT_CHARS);
    const expectedX = Math.max(0, limit - 5);
    const out = String(res.body?.result?.stdout || '').trim();
    expect(out.length).toBe(expectedX);
    expect(out).toMatch(/^x+$/);
  });
});
