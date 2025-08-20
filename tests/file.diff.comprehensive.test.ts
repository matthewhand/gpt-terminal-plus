import request from 'supertest';
import express from 'express';
import { applyDiff } from '../src/routes/file/diff';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';

const app = express();
app.use(express.json());

// Mock server handler
app.use((req: any, res, next) => {
  req.serverHandler = {
    protocol: 'local',
    hostname: 'localhost',
    executeCommand: async (cmd: string) => {
      if (cmd.includes('git apply --check')) {
        return { success: true, stdout: '', stderr: '', exitCode: 0 };
      }
      if (cmd.includes('git apply')) {
        return { success: true, stdout: 'Applied successfully', stderr: '', exitCode: 0 };
      }
      return { success: false, stdout: '', stderr: 'Command failed', exitCode: 1 };
    }
  };
  next();
});

app.post('/file/diff', applyDiff);

const token = getOrGenerateApiToken();

describe('File Diff Comprehensive Tests', () => {
  const testDir = '/tmp/diff-test';
  
  beforeAll(async () => {
    try {
      await mkdir(testDir, { recursive: true });
    } catch {}
  });

  afterAll(async () => {
    try {
      await unlink(path.join(testDir, 'test.txt'));
    } catch {}
  });

  test('applies valid unified diff', async () => {
    const validDiff = `--- a/test.txt
+++ b/test.txt
@@ -1,3 +1,3 @@
 line 1
-old line 2
+new line 2
 line 3`;

    const res = await request(app)
      .post('/file/diff')
      .set('Authorization', `Bearer ${token}`)
      .send({ diff: validDiff });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('successfully');
  });

  test('validates diff format before applying', async () => {
    const invalidDiff = 'this is not a valid diff format';

    const res = await request(app)
      .post('/file/diff')
      .set('Authorization', `Bearer ${token}`)
      .send({ diff: invalidDiff });
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid diff format');
    expect(res.body.message).toContain('validation');
  });

  test('handles dry run mode', async () => {
    const validDiff = `--- a/test.txt
+++ b/test.txt
@@ -1 +1 @@
-old content
+new content`;

    const res = await request(app)
      .post('/file/diff')
      .set('Authorization', `Bearer ${token}`)
      .send({ diff: validDiff, dryRun: true });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.dryRun).toBe(true);
    expect(res.body.message).toContain('validation passed');
  });

  test('requires diff content', async () => {
    const res = await request(app)
      .post('/file/diff')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Diff content is required');
  });

  test('handles complex multi-file diff', async () => {
    const multiFileDiff = `--- a/file1.txt
+++ b/file1.txt
@@ -1 +1 @@
-content1
+updated1
--- a/file2.txt
+++ b/file2.txt
@@ -1 +1 @@
-content2
+updated2`;

    const res = await request(app)
      .post('/file/diff')
      .set('Authorization', `Bearer ${token}`)
      .send({ diff: multiFileDiff });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});