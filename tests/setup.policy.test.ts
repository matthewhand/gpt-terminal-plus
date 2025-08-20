import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import fs from 'fs';

describe('Setup Policy UI', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setupApiRouter(app);
  });

  it('renders policy page', async () => {
    const res = await request(app).get('/setup/policy').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.text).toContain('Safety Policy');
  });

  it('updates policy config', async () => {
    const res = await request(app)
      .post('/setup/policy')
      .set('Authorization', `Bearer ${token}`)
      .type('form')
      .send({ confirmRegex: 'rm\\s+-rf', denyRegex: ':/$' });
    expect([200,302]).toContain(res.status);
    const raw = fs.readFileSync('config/test/test.json','utf8');
    expect(raw).toContain('confirmRegex');
    expect(raw).toContain('denyRegex');
  });
});

