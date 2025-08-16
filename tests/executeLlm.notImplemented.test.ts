import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('execute-llm not implemented for non-local', () => {
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

  async function setServer(server: string) {
    const r = await request(app)
      .post('/server/set')
      .set('Authorization', `Bearer ${token}`)
      .send({ server, getSystemInfo: false });
    expect(r.status).toBe(200);
  }

  it('returns 501 for SSH protocol', async () => {
    await setServer('ssh-bash.example.com');
    const res = await request(app)
      .post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .send({ instructions: 'do something', dryRun: true });
    expect(res.status).toBe(501);
    expect(res.body.error).toMatch(/not implemented/i);
  });

  it('returns 501 for SSM protocol', async () => {
    await setServer('GAMINGPC.WORKGROUP');
    const res = await request(app)
      .post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .send({ instructions: 'do something', dryRun: true });
    expect(res.status).toBe(501);
    expect(res.body.error).toMatch(/not implemented/i);
  });
});

