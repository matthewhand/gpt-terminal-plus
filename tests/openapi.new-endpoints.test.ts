import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import * as routesMod from '../src/routes';

import { registerOpenAPIRoutes } from '../src/openapi';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  } else {
    const router = express.Router();
    const setup = anyRoutes.setupRoutes || anyRoutes.default;
    if (typeof setup === 'function') setup(router);
    app.use('/', router);
  }
  registerOpenAPIRoutes(app);
  return app;
}

describe('OpenAPI Endpoints', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  it('includes /activity/list', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/activity/list:');
    expect(spec).toContain('summary: List recent activity sessions');
  });

  it('includes /activity/session/{date}/{id}', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/activity/session/{date}/{id}:');
    expect(spec).toContain('summary: Fetch a full activity session');
  });

  it('includes executors capability endpoints', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/command/executors:');
    expect(spec).toContain('summary: List available executors');
    expect(spec).toContain('/command/executors/{name}/toggle:');
    expect(spec).toContain('summary: Enable or disable an executor');
    expect(spec).toContain('/command/executors/{name}/update:');
    expect(spec).toContain('summary: Update executor command and args');
  });

  it('includes generic execute-shell by default exposure', async () => {
    const response = await request(app).get('/openapi.yaml');
    const spec = response.text;
    expect(spec).toContain('/command/execute-shell:');
    expect(spec).toContain('summary: Execute a command using configured shell (generic)');
  });
});
