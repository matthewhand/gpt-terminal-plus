import express from 'express';
import request from 'supertest';
import fs from 'fs';
import path from 'path';

function makeApp() {
  const app = express();
  app.use(express.json());
  const commandRoutes = require('../../../src/routes/commandRoutes').default;
  app.use('/command', commandRoutes);
  return app;
}

describe('/command/diff and /command/patch', () => {
  const app = makeApp();

  it('returns 400 for missing filePath on diff', async () => {
    const res = await request(app)
      .post('/command/diff')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'filePath is required');
  });

  it('returns 404 for non-existent file on diff', async () => {
    const res = await request(app)
      .post('/command/diff')
      .send({ filePath: '/tmp/definitely-not-here-' + Date.now() });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'File not found');
  });

  it('returns mocked unified diff for existing file', async () => {
    const tmp = path.join('/tmp', `diff-file-${Date.now()}.txt`);
    fs.writeFileSync(tmp, 'line1\nold content\nline3\n');
    const res = await request(app)
      .post('/command/diff')
      .send({ filePath: tmp });
    expect(res.status).toBe(200);
    expect(typeof res.body?.diff).toBe('string');
    expect(res.body.diff).toContain(`--- a/${tmp}`);
    expect(res.body.diff).toContain(`+++ b/${tmp}`);
    expect(res.body.diff).toContain('-old content');
    expect(res.body.diff).toContain('+new content');
    fs.unlinkSync(tmp);
  });

  it('validates required fields for patch', async () => {
    const res = await request(app)
      .post('/command/patch')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'filePath and patch are required');
  });

  it('returns 404 for non-existent file on patch', async () => {
    const res = await request(app)
      .post('/command/patch')
      .send({ filePath: '/tmp/nope-' + Date.now(), patch: '--- a\n+++ b' });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'File not found');
  });

  it('rejects invalid patch format', async () => {
    const tmp = path.join('/tmp', `patch-file-${Date.now()}.txt`);
    fs.writeFileSync(tmp, 'content\n');
    const res = await request(app)
      .post('/command/patch')
      .send({ filePath: tmp, patch: 'invalid patch data' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: false, error: 'Invalid patch format' });
    fs.unlinkSync(tmp);
  });

  it('accepts valid patch format', async () => {
    const tmp = path.join('/tmp', `patch-file-ok-${Date.now()}.txt`);
    fs.writeFileSync(tmp, 'content\n');
    const res = await request(app)
      .post('/command/patch')
      .send({ filePath: tmp, patch: '--- a\n+++ b\n@@ -1,1 +1,1 @@\n-content\n+new\n' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    fs.unlinkSync(tmp);
  });
});

