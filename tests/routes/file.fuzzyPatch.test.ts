import request from 'supertest';
import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';

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

describe('POST /file/fuzzy-patch', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../tmp-fuzzy');
  const testFile = path.join(testDir, 'file.txt');

  beforeAll(() => {
    process.env.API_TOKEN = 'test-token';
    app = makeApp();
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    fs.writeFileSync(testFile, ['line1', 'line2', 'line3', ''].join('\n'), 'utf-8');
  });

  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    // Remove any backups created
    const backups = fs.readdirSync(testDir).filter(f => f.startsWith('file.txt.backup.'));
    backups.forEach(f => fs.unlinkSync(path.join(testDir, f)));
  });

  it('returns preview with patchedText without writing to disk', async () => {
    const oldText = ['line1', 'line2', 'line3', ''].join('\n');
    const newText = ['line1', 'line-CHANGED', 'line3', ''].join('\n');

    const res = await request(app)
      .post('/file/fuzzy-patch')
      .send({ filePath: testFile, oldText, newText, preview: true })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.preview).toBe(true);
    expect(typeof res.body.patchedText).toBe('string');
    expect(res.body.patchedText).toContain('line-CHANGED');

    // Verify disk not changed
    const disk = fs.readFileSync(testFile, 'utf-8');
    expect(disk).toContain('line2');
    expect(disk).not.toContain('line-CHANGED');
  });

  it('applies patch and creates a backup in non-preview', async () => {
    const oldText = ['line1', 'line2', 'line3', ''].join('\n');
    const newText = ['line1', 'lineX', 'line3', ''].join('\n');

    const res = await request(app)
      .post('/file/fuzzy-patch')
      .send({ filePath: testFile, oldText, newText })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.backup).toMatch(/file.txt\.backup\./);
    expect(typeof res.body.appliedPatches).toBe('number');
    expect(res.body.totalPatches).toBeGreaterThan(0);

    // Backup exists and contains original content
    const backupPath = res.body.backup as string;
    const backupContent = fs.readFileSync(backupPath, 'utf-8');
    expect(backupContent).toContain('line2');

    // File updated
    const disk = fs.readFileSync(testFile, 'utf-8');
    expect(disk).toContain('lineX');
  });

  it('rejects with 400 on missing filePath', async () => {
    const oldText = 'a';
    const newText = 'b';
    const res = await request(app)
      .post('/file/fuzzy-patch')
      .send({ oldText, newText })
      .expect(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects with 400 when no hunks apply (no diff)', async () => {
    const text = fs.readFileSync(testFile, 'utf-8');
    const res = await request(app)
      .post('/file/fuzzy-patch')
      .send({ filePath: testFile, oldText: text, newText: text })
      .expect(400);
    expect(res.body).toHaveProperty('error');
  });
});

