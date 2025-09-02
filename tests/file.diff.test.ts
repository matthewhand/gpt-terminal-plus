import request from 'supertest';
import express from 'express';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock child_process.exec so applyDiff doesn't call real git
jest.mock('child_process', () => {
  return {
    exec: (cmd: string, cb: any) => {
      // Support both exec(cmd, cb) and exec(cmd, opts, cb)
      const callback = typeof cb === 'function' ? cb : arguments[2];
      if (cmd.includes('--check')) {
        // Simulate successful validation
        callback(null, '', '');
      } else {
        // Simulate successful application
        callback(null, 'applied', '');
      }
    }
  } as any;
});

// Import after mocks so module-level exec is wrapped by jest
import { applyDiff } from '../src/routes/file';

const app = express();
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

const token = getOrGenerateApiToken();

describe('/file/diff endpoint', () => {
  test('validates diff content is required', async () => {
    const res = await request(app)
      .post('/file/diff')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Diff content is required');
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
    expect(res.body.dryRun).toBe(true);
  });
});
