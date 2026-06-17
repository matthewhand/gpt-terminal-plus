import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('Shell session routes (mounted)', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  beforeEach(() => {
    const { __clearSessionsForTests } = require('../../src/session/ShellSessionDriver');
    const { _resetGlobalStateForTests } = require('../../src/utils/GlobalStateHelper');
    __clearSessionsForTests();
    _resetGlobalStateForTests();
  });

  it('requires authentication', async () => {
    const response = await request(app).post('/shell/session/start');
    expect(response.status).toBe(401);
  });

  it('POST /shell/session/start returns 200 (implemented)', async () => {
    const response = await request(app)
      .post('/shell/session/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ shell: 'bash' });
    expect(response.status).toBe(200);
  });

  it('GET /shell/session/list returns 200', async () => {
    const response = await request(app)
      .get('/shell/session/list')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
