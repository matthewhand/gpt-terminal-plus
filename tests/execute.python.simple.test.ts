import request from 'supertest';
import express from 'express';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

const app = setupApiRouter(express());
const token = getOrGenerateApiToken();

describe('POST /command/execute-code (python)', () => {
  it('runs a tiny python snippet', async () => {
    const res = await request(app)
      .post('/command/execute-code')
      .set('Authorization', `Bearer ${token}`)
      .send({ language: 'python', code: 'print("py-ok")' });

    expect(res.status).toBe(200);
    expect((res.body.result?.stdout || '') as string).toContain('py-ok');
    expect(res.body.result?.exitCode).toBe(0);
  });
});
