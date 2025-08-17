import request from 'supertest';
import app from '../src/app';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('POST /command/execute (shell)', () => {
  const token = getOrGenerateApiToken();

  it('executes "echo ok" with exitCode 0', async () => {
    const res = await request(app)
      .post('/command/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: 'echo ok' });

    expect(res.status).toBe(200);
    expect(res.body.result?.exitCode).toBe(0);
    expect(res.body.result?.stdout || '').toContain('ok');
  });
});
