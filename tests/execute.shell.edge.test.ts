import request from 'supertest';
import express from 'express';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('execute-shell edge cases', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  it('handles empty command', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: '' });

    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(1);
  });

  it('handles malformed JSON', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send('invalid json');

    expect(res.status).toBe(400);
  });

  it('handles missing command field', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .send({ notCommand: 'echo test' });

    expect(res.status).toBe(200);
    expect(res.body?.result?.exitCode).toBe(1);
  });
});