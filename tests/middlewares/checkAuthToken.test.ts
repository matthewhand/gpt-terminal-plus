import express, { Request, Response } from 'express';
import request from 'supertest';
import { checkAuthToken } from '../../src/middlewares/checkAuthToken';

describe('checkAuthToken middleware', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.API_TOKEN; // ensure fresh generation unless explicitly set
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const buildApp = (mountPath = '/') => {
    const app = express();
    app.use(checkAuthToken);
    // health route should bypass auth
    app.get('/health', (_: Request, res: Response) => res.status(200).json({ ok: true }));
    // generic protected route
    app.get('/protected', (_: Request, res: Response) => res.status(200).json({ ok: true }));

    // chat and server routers simulate baseUrl specific behavior
    const chat = express.Router();
    chat.get('/echo', (_: Request, res: Response) => res.status(200).json({ ok: true }));
    app.use('/chat', chat);

    const server = express.Router();
    server.get('/info', (_: Request, res: Response) => res.status(200).json({ ok: true }));
    app.use('/server', server);

    return app;
  };

  it('bypasses auth for /health', async () => {
    const app = buildApp();
    await request(app).get('/health').expect(200);
  });

  it('rejects missing token with 401', async () => {
    const app = buildApp();
    await request(app).get('/protected').expect(401);
  });

  it('rejects wrong token with 403 for generic routes', async () => {
    // Stabilize token so we know the expected good one
    process.env.API_TOKEN = 'good_token_123';
    const app = buildApp();
    await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer bad_token')
      .expect(403);
  });

  it('rejects wrong token with 401 for /chat base route', async () => {
    process.env.API_TOKEN = 'good_token_123';
    const app = buildApp();
    await request(app)
      .get('/chat/echo')
      .set('Authorization', 'Bearer another_bad')
      .expect(401);
  });

  it('accepts valid token (generated when missing)', async () => {
    const app = buildApp();
    // First call without token will set API_TOKEN via generator; capture it
    // We trigger generation by attempting an authorized call with the correct token after fetching it
    // by calling the middleware indirectly once.
    // Call once to force generation and read out the env value
    await request(app).get('/protected').expect(401);
    const token = process.env.API_TOKEN;
    expect(token).toBeDefined();
    await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('accepts valid token when explicitly set via env', async () => {
    process.env.API_TOKEN = 'explicit_token';
    const app = buildApp();
    await request(app)
      .get('/server/info')
      .set('Authorization', 'Bearer explicit_token')
      .expect(200);
  });
});
