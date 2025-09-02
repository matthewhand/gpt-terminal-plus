import request from 'supertest';
import express, { Router } from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';
import { getOrGenerateApiToken } from '../../src/common/apiToken';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  } else {
    const router = Router();
    const setup = anyRoutes.setupRoutes || anyRoutes.default;
    if (typeof setup === 'function') setup(router);
    app.use('/', router);
  }
  return app;
}

// Integration test for session-based execution flow using mocked test router
describe('Session Uplift Integration', () => {
  const app = makeApp();
  const token = getOrGenerateApiToken();

  it('returns a plan in dry-run mode', async () => {
    const res = await request(app)
      .post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .send({ instructions: 'echo do something', dryRun: true });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.plan).toBeDefined();
    expect(res.body.plan.commands?.[0]?.cmd).toContain('echo');
  });

  it('streams SSE events for plan/step/done', async () => {
    const res = await request(app)
      .post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'text/event-stream')
      .send({ instructions: 'remote: list files', stream: true });

    expect(res.status).toBe(200);
    const text = res.text || '';
    expect(text).toContain('event: plan');
    expect(text).toContain('event: step');
    expect(text).toContain('event: done');
  });
});
