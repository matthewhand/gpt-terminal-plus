const request = require('supertest');
const express = require('express');
const setupMiddlewares =
  require('../src/middlewares/setupMiddlewares').default ||
  require('../src/middlewares/setupMiddlewares');
const routesMod = require('../src/routes');
const { registerOpenApiRoutes } = require('../src/openapi');
const { getOrGenerateApiToken } = require('../src/common/apiToken');

function makeApp() {
  const app = express();
  setupMiddlewares(app);
  
  // Register OpenAPI routes
  registerOpenApiRoutes(app);
  
  const anyRoutes = routesMod;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  } else {
    const { Router } = require('express');
    const router = Router();
    const setup = anyRoutes.setupRoutes || anyRoutes.default;
    if (typeof setup === 'function') setup(router);
    app.use('/', router);
  }
  return app;
}

describe('OpenAPI surface', () => {
  let app;
  let token;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = makeApp();
  });

  it('serves /openapi.json', async () => {
    const res = await request(app)
      .get('/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('openapi');
    expect(res.body).toHaveProperty('paths');
  });

  it('serves /openapi.yaml', async () => {
    const res = await request(app)
      .get('/openapi.yaml');
    expect(res.status).toBe(200);
    expect(res.text).toContain('openapi:');
    expect(res.text).toContain('paths:');
  });
});
