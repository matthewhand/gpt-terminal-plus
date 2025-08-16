import express from 'express';
import request from 'supertest';
import { initializeServerHandler } from '../src/middlewares/initializeServerHandler';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import { setupApiRouter } from '../src/routes';

describe('middleware/initializeServerHandler', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    // reuse full router with middleware to ensure handler attaches
    setupApiRouter(app);
  });

  it('attaches server handler and responds 200 for a simple route', async () => {
    const res = await request(app)
      .post('/command/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: 'echo ok' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBeDefined();
  });
});

