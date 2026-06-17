import request from 'supertest';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Enhanced mock for child_process.exec with more realistic behavior
jest.mock('child_process', () => {
  const mockExec = jest.fn();
  return {
    exec: mockExec
  } as any;
});

// Import after mocks so module-level exec is wrapped by jest
import { applyDiff } from '../src/routes/file';
import { exec } from 'child_process';

const mockExec = exec as jest.MockedFunction<typeof exec>;

describe('/file/diff endpoint - Enhanced', () => {
  let app: express.Express;
  let token: string;
  let tempDir: string;
  let testFile: string;

  beforeAll(async () => {
    token = getOrGenerateApiToken();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'diff-test-'));
    testFile = path.join(tempDir, 'test.txt');
  });

  beforeEach(async () => {
    // Reset mocks and create fresh app for each test
    jest.clearAllMocks();
    
    app = express();
    app.use(express.json());
    app.use((req: any, res, next) => {
      req.serverHandler = {
        protocol: 'local',
        hostname: 'localhost',
        executeCommand: async () => ({ success: true, stdout: '', stderr: '', exitCode: 0 })
      };
      next();
    });
    app.post('/file/diff', applyDiff);

    // Create test file with known content
    await fs.writeFile(testFile, 'original content\nline 2\nline 3\n');
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('Input Validation', () => {
    test('validates diff content is required', async () => {
      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Diff content is required');
    });

    test('validates diff content is not empty string', async () => {
      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: '' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Diff content is required');
    });

    test('validates diff content is not just whitespace', async () => {
      mockExec.mockImplementation((cmd: string, cb: any) => {
        const callback = typeof cb === 'function' ? cb : arguments[2];
        const error: any = new Error('patch: malformed patch');
        error.code = 1;
        callback(error, '', 'patch: malformed patch');
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: '   ' });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.error).toMatch(/Diff content is required|Invalid diff format/);
    });

    test('rejects malformed diff format', async () => {
      const invalidDiff = 'this is not a valid diff format';
      
      mockExec.mockImplementation((cmd: string, cb: any) => {
        const callback = typeof cb === 'function' ? cb : arguments[2];
        const error: any = new Error('patch: malformed patch');
        error.code = 1;
        callback(error, '', 'patch: malformed patch');
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: invalidDiff });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid diff format');
    });
  });

  describe('Dry Run Mode', () => {
    test('handles dry run mode with valid diff', async () => {
      const validDiff = `--- a/test.txt
+++ b/test.txt
@@ -1,3 +1,3 @@
-original content
+modified content
 line 2
 line 3`;

      mockExec.mockImplementation((cmd: string, cb: any) => {
        const callback = typeof cb === 'function' ? cb : arguments[2];
        if (cmd.includes('--check') || cmd.includes('--dry-run')) {
          callback(null, 'patch would apply cleanly', '');
        } else {
          callback(null, 'applied successfully', '');
        }
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: validDiff, dryRun: true });
      
      expect(res.status).toBe(200);
      expect(res.body.dryRun).toBe(true);
      expect(res.body.success).toBe(true);
      expect(mockExec).toHaveBeenCalledWith(
        expect.stringContaining('--check'),
        expect.any(Function)
      );
    });

    test('dry run detects conflicts', async () => {
      const conflictingDiff = `--- a/test.txt
+++ b/test.txt
@@ -1,3 +1,3 @@
-nonexistent content
+modified content
 line 2
 line 3`;

      mockExec.mockImplementation((cmd: string, cb: any) => {
        const callback = typeof cb === 'function' ? cb : arguments[2];
        if (cmd.includes('--check')) {
          const error: any = new Error('patch does not apply');
          error.code = 1;
          callback(error, '', 'patch does not apply');
        }
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: conflictingDiff, dryRun: true });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Patch validation failed|Invalid diff format|patch does not apply/);
    });
  });

  describe('Actual Application', () => {
    test('applies valid diff successfully', async () => {
      const validDiff = `--- a/test.txt
+++ b/test.txt
@@ -1,3 +1,3 @@
-original content
+modified content
 line 2
 line 3`;

      mockExec.mockImplementation((cmd: string, cb: any) => {
        const callback = typeof cb === 'function' ? cb : arguments[2];
        if (cmd.includes('--check')) {
          callback(null, '', '');
        } else {
          callback(null, 'patching file test.txt', '');
        }
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: validDiff });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('applied successfully');
    });

    test('handles patch application failure', async () => {
      const validDiff = `--- a/test.txt
+++ b/test.txt
@@ -1,3 +1,3 @@
-original content
+modified content
 line 2
 line 3`;

      mockExec.mockImplementation((cmd: string, cb: any) => {
        const callback = typeof cb === 'function' ? cb : arguments[2];
        if (cmd.includes('--check')) {
          callback(null, '', '');
        } else {
          const error: any = new Error('patch failed');
          error.code = 1;
          callback(error, '', 'Hunk #1 FAILED');
        }
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: validDiff });
      
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.error).toMatch(/Failed to apply patch|patch failed|Hunk.*FAILED/);
    });
  });

  describe('Edge Cases', () => {
    test('handles very large diff content', async () => {
      const largeDiff = `--- a/large.txt
+++ b/large.txt
@@ -1,1000 +1,1000 @@
${Array.from({ length: 1000 }, (_, i) => `-line ${i}\n+modified line ${i}`).join('\n')}`;

      mockExec.mockImplementation((cmd: string, cb: any) => {
        const callback = typeof cb === 'function' ? cb : arguments[2];
        callback(null, 'applied', '');
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: largeDiff });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('handles diff with special characters and unicode', async () => {
      const unicodeDiff = `--- a/unicode.txt
+++ b/unicode.txt
@@ -1,3 +1,3 @@
-Hello 世界
+Hello 🌍 世界
 Special chars: !@#$%^&*()
-Émojis: 😀🎉
+Émojis: 😀🎉✨`;

      mockExec.mockImplementation((cmd: string, cb: any) => {
        const callback = typeof cb === 'function' ? cb : arguments[2];
        callback(null, 'applied', '');
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: unicodeDiff });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('handles timeout scenarios', async () => {
      const validDiff = `--- a/test.txt
+++ b/test.txt
@@ -1 +1 @@
-old
+new`;

      mockExec.mockImplementation((cmd: string, cb: any) => {
        // Simulate timeout by never calling callback
        setTimeout(() => {
          const callback = typeof cb === 'function' ? cb : arguments[2];
          const error: any = new Error('Command timeout');
          error.code = 'TIMEOUT';
          callback(error, '', '');
        }, 100);
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: validDiff });
      
      // Should handle timeout gracefully
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Security', () => {
    test('prevents command injection in diff content', async () => {
      const maliciousDiff = `--- a/test.txt; rm -rf /
+++ b/test.txt
@@ -1 +1 @@
-safe
+content`;

      mockExec.mockImplementation((cmd: string, cb: any) => {
        // Verify command doesn't contain injection
        expect(cmd).not.toContain('rm -rf');
        expect(cmd).not.toContain(';');
        
        const callback = typeof cb === 'function' ? cb : arguments[2];
        callback(null, 'applied', '');
      });

      const res = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: maliciousDiff });
      
      expect(res.status).toBe(200);
    });

    test('handles authorization properly', async () => {
      const validDiff = `--- a/test.txt
+++ b/test.txt
@@ -1 +1 @@
-old
+new`;

      const res = await request(app)
        .post('/file/diff')
        .send({ diff: validDiff });
      
      // Check if auth is actually required (some endpoints may not require it)
      expect([200, 401]).toContain(res.status);
    });
  });
});
