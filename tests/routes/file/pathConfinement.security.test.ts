import request from 'supertest';
import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import setupMiddlewares from '../../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../../src/routes';
import { getOrGenerateApiToken } from '../../../src/common/apiToken';

/**
 * Regression for the arbitrary-file-write / out-of-root-read hole: the live
 * file handlers previously stripped a leading "/" then re-prepended it, so an
 * absolute path round-tripped back to absolute and reached the local action
 * unchecked. The handlers now confine to the working root via resolveSafePath.
 */
function makeApp() {
  const app = express();
  setupMiddlewares(app);
  (routesMod as any).setupApiRouter?.(app);
  return app;
}

describe('file routes: working-root confinement (security)', () => {
  const token = getOrGenerateApiToken();
  let app: express.Application;

  beforeAll(() => {
    process.env.API_TOKEN = token;
    process.env.NODE_ENV = 'test';
    try {
      const rl = require('../../../src/middlewares/advancedRateLimit');
      if (rl?.rateLimiters) {
        const noop = (_req: any, _res: any, next: any) => next();
        rl.rateLimiters.strict = noop; rl.rateLimiters.moderate = noop; rl.rateLimiters.lenient = noop;
      }
    } catch (e) { void e; }
    app = makeApp();
  });

  const auth = (r: request.Test) => r.set('Authorization', `Bearer ${token}`);

  it('rejects createFile to an absolute path outside the working root and writes nothing', async () => {
    const target = path.join(os.tmpdir(), `confine_poc_${Date.now()}.txt`);
    if (fs.existsSync(target)) fs.unlinkSync(target);

    const res = await auth(request(app).post('/file/create')).send({ filePath: target, content: 'should-not-write' });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/outside the working root/);
    expect(fs.existsSync(target)).toBe(false);
  });

  it('rejects createFile path traversal that climbs above the root', async () => {
    const res = await auth(request(app).post('/file/create')).send({ filePath: '../../../../etc/confine_poc.txt', content: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
  });

  it('rejects readFile of an absolute path outside the root', async () => {
    const res = await auth(request(app).post('/file/read')).send({ filePath: '/etc/passwd' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/outside the working root/);
  });

  it('rejects listFiles of an absolute directory outside the root', async () => {
    const res = await auth(request(app).post('/file/list')).send({ directory: '/etc' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/outside the working root/);
  });

  it('still allows a normal relative path under the root', async () => {
    const rel = `confine_ok_${Date.now()}.txt`;
    const res = await auth(request(app).post('/file/create')).send({ filePath: rel, content: 'ok' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    // cleanup
    const abs = path.resolve(process.cwd(), rel);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  });
});
