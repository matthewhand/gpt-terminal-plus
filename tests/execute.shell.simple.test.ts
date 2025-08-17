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

describe('POST /command/execute (shell)', () => {
  it('executes "echo ok" with exitCode 0', async () => {
    const res = await request(app)
      .post('/command/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ command: 'echo ok' });

    expect(res.status).toBe(200);
    expect(res.body.result?.exitCode).toBe(0);
    expect(String(res.body.result?.stdout || '')).toContain('ok');
  });
});
