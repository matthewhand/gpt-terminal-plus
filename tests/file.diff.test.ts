import request from 'supertest';
import express from 'express';
import { applyDiff } from '../src/routes/file/diff';
import { getOrGenerateApiToken } from '../src/common/apiToken';

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
// Add middleware for server handler
app.use('/file/diff', (req: any, res, next) => {
  if (!req.serverHandler) {
    req.serverHandler = {
      protocol: 'local',
      hostname: 'localhost',
      executeCommand: async () => ({ success: true, stdout: '', stderr: '', exitCode: 0 })
    };
  }
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