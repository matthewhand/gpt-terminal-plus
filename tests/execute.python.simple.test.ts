import request from 'supertest';
import app from '../src/app';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('POST /command/execute-code (python)', () => {
  const token = getOrGenerateApiToken();

  it('runs a tiny python snippet', async () => {
    const res = await request(app)
      .post('/command/execute-code')
      .set('Authorization', `Bearer ${token}`)
      .send({ language: 'python', code: 'print("py-ok")' });

    expect(res.status).toBe(200);
    const out = (res.body.result?.stdout || '') as string;
    expect(out).toContain('py-ok');
    expect(res.body.result?.exitCode).toBe(0);
  });
});
