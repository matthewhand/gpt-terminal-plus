import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import setupMiddlewares from '../../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../../src/routes';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('POST /file/patch', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../tmp/patch-tests');
  const testFile = path.join(testDir, 'test.txt');
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
  });

  beforeEach(() => {
    fs.writeFileSync(testFile, 'line1\nline2\nline3');
  });

  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('applies search/replace successfully', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({ file: testFile, search: 'line2', replace: 'LINE_TWO' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/successfully/i);
    expect(res.body.backup).toBeDefined();

    const updated = fs.readFileSync(testFile, 'utf-8');
    expect(updated).toContain('LINE_TWO');
  });

  it('returns 400 when search string not found', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({ file: testFile, search: 'absent', replace: 'noop' });

    expect(res.status).toBe(400);
    expect(String(res.body.error)).toMatch(/not found/i);
  });

  it('supports dryRun with preview', async () => {
    const original = fs.readFileSync(testFile, 'utf-8');
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({ file: testFile, search: 'line1', replace: 'FIRST', dryRun: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.dryRun).toBe(true);
    expect(res.body.preview).toMatch(/FIRST|line/);
    expect(fs.readFileSync(testFile, 'utf-8')).toBe(original);
  });

  it('returns 400 when missing both search and startLine', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({ file: testFile });

    expect(res.status).toBe(400);
    expect(String(res.body.error)).toMatch(/search.*startLine/i);
  });

  it('returns 400 when startLine exceeds file length', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({ file: testFile, startLine: 999, replace: 'X' });

    expect(res.status).toBe(400);
    expect(String(res.body.error)).toMatch(/exceeds file length/i);
  });

  it('requires auth', async () => {
    const res = await request(app)
      .post('/file/patch')
      .send({ file: testFile, search: 'line1', replace: 'X' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });
});

