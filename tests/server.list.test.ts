// @ts-nocheck
import request from 'supertest';
import express from 'express';

const setupMiddlewares = require('../src/middlewares/setupMiddlewares').default
  || require('../src/middlewares/setupMiddlewares');
const routesMod = require('../src/routes');
const mountRoutes = routesMod.setupApiRouter
  ? (app: any) => routesMod.setupApiRouter(app)
  : (app: any) => {
      const { Router } = require('express');
      const router = Router();
      const setup = routesMod.setupRoutes || routesMod.default;
      setup(router);
      app.use('/', router);
      return app;
    };

const app = mountRoutes(setupMiddlewares(express()));
const { getOrGenerateApiToken } = require('../src/common/apiToken');
const token = getOrGenerateApiToken();

describe('GET /server/list', () => {
  it('returns 200 and an array of servers', async () => {
    const res = await request(app)
      .get('/server/list')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('servers');
    expect(Array.isArray(res.body.servers)).toBe(true);
  });
});
