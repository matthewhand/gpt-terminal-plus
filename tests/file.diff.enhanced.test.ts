import request from 'supertest';
import express from 'express';

// We will isolate modules per test to control the child_process mock behavior

describe('/file/diff endpoint – enhanced', () => {
  const buildApp = (options: { checkFails?: boolean } = {}) => {
    jest.isolateModules(() => {
      jest.resetModules();
      jest.doMock('child_process', () => {
        const util = require('util');
        const execFn = (cmd: string, ...rest: any[]) => {
          const cb = typeof rest[0] === 'function' ? rest[0] : rest[1];
          if (cmd.includes('--check')) {
            if (options.checkFails) {
              cb(new Error('patch does not apply'), '', '');
            } else {
              cb(null, '', '');
            }
          } else {
            cb(null, 'applied', '');
          }
        };
        // Make promisify(exec) return { stdout, stderr } like real exec
        execFn[util.promisify.custom] = (cmd: string) => {
          if (cmd.includes('--check')) {
            if (options.checkFails) {
              return Promise.reject(new Error('patch does not apply'));
            }
            return Promise.resolve({ stdout: '', stderr: '' });
          }
          return Promise.resolve({ stdout: 'applied', stderr: '' });
        };
        return { exec: execFn };
      });

      // Dynamically import after mocking
      const { applyDiff } = require('../src/routes/file');

      const app = express();
      app.use(express.json());
      app.use((req: any, _res, next) => {
        req.serverHandler = {
          protocol: 'local',
          hostname: 'localhost',
          executeCommand: async () => ({ success: true, stdout: '', stderr: '', exitCode: 0 })
        };
        next();
      });
      app.post('/file/diff', applyDiff);

      (global as any).__testApp = app;
    });

    return (global as any).__testApp as express.Application;
  };

  it('applies a valid diff when not in dryRun', async () => {
    const app = buildApp();

    const validDiff = `--- a/test.txt\n+++ b/test.txt\n@@ -1 +1 @@\n-old\n+new`;

    const res = await request(app)
      .post('/file/diff')
      .send({ diff: validDiff, dryRun: false });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Diff applied successfully');
    expect(res.body.stdout).toBe('applied');
    expect(res.body.stderr).toBe('');
  });

  it('rejects an invalid diff with a clear error', async () => {
    const app = buildApp({ checkFails: true });

    const invalidDiff = `--- a/unknown.txt\n+++ b/unknown.txt\n@@ -1 +1 @@\n-a\n+b`;

    const res = await request(app)
      .post('/file/diff')
      .send({ diff: invalidDiff, dryRun: false });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid diff format');
    expect(res.body.message).toBe('Diff validation failed');
    expect(String(res.body.details)).toContain('patch does not apply');
  });
});
