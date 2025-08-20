import request from 'supertest';
import express from 'express';
import { applyPatch } from '../src/routes/file/patch';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';

const app = express();
app.use(express.json());

// Mock server handler
app.use((req: any, res, next) => {
  req.serverHandler = {
    protocol: 'local',
    hostname: 'localhost'
  };
  next();
});

app.post('/file/patch', applyPatch);

const token = getOrGenerateApiToken();

describe('File Patch Comprehensive Tests', () => {
  const testDir = '/tmp/patch-test';
  const testFile = path.join(testDir, 'test.txt');
  
  beforeAll(async () => {
    try {
      await mkdir(testDir, { recursive: true });
    } catch {}
  });

  beforeEach(async () => {
    const content = `line 1
old content here
line 3
more content
final line`;
    await writeFile(testFile, content, 'utf8');
  });

  afterAll(async () => {
    try {
      await unlink(testFile);
    } catch {}
  });

  test('applies search and replace patch', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        file: testFile,
        search: 'old content here',
        replace: 'new content here'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.backup).toBeDefined();
  });

  test('applies line-based patch', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        file: testFile,
        startLine: 2,
        endLine: 2,
        replace: 'completely new line 2'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.linesChanged).toBeDefined();
  });

  test('handles dry run mode', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        file: testFile,
        search: 'old content',
        replace: 'new content',
        dryRun: true
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.dryRun).toBe(true);
    expect(res.body.preview).toBeDefined();
  });

  test('validates required parameters', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('File path is required');
  });

  test('handles search string not found', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        file: testFile,
        search: 'nonexistent content',
        replace: 'new content'
      });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Search string not found in file');
  });

  test('deletes lines when replace is empty', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        file: testFile,
        startLine: 2,
        endLine: 2
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.linesChanged).toBe(-1);
  });
});