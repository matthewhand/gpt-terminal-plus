import request from 'supertest';
import express from 'express';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

const app = setupApiRouter(express());
const token = getOrGenerateApiToken();

describe('POST /command/execute (shell)', () => {
  it('executes "echo ok" with exitCode 0', async () => {
    const res = await request(app)
      .post('/command/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: 'echo ok' });

    expect(res.status).toBe(200);
    expect(res.body.result?.exitCode).toBe(0);
    expect((res.body.result?.stdout || '') as string).toContain('ok');
  });
});
