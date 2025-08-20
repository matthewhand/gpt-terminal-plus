import request from 'supertest';
import { makeProdApp } from '../utils/testApp';
import { getOrGenerateApiToken } from '../../src/common/apiToken';

const token = getOrGenerateApiToken();

describe('SSH Diff/Patch Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = await makeProdApp();
  });

  test('registers worker1 for diff/patch testing', async () => {
    const res = await request(app)
      .post('/server/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hostname: 'worker1-diff',
        protocol: 'ssh',
        config: {
          host: 'worker1',
          username: process.env.USER || 'chatgpt',
          port: 22,
          privateKeyPath: process.env.HOME + '/.ssh/id_rsa'
        }
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('creates test file on worker1', async () => {
    const testContent = `# Test File for Diff/Patch
line 1: original content
line 2: old value here
line 3: more content
line 4: final line`;

    const res = await request(app)
      .post('/file/create')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker1-diff')
      .send({
        filePath: '/tmp/diff-patch-test.txt',
        content: testContent
      });
    
    expect(res.status).toBe(200);
  });

  test('applies patch via SSH', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker1-diff')
      .send({
        filePath: '/tmp/diff-patch-test.txt',
        search: 'old value here',
        replace: 'new updated value'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('verifies patch was applied via SSH', async () => {
    const res = await request(app)
      .post('/file/read')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker1-diff')
      .send({
        filePath: '/tmp/diff-patch-test.txt'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.content).toContain('new updated value');
    expect(res.body.content).not.toContain('old value here');
  });

  test('applies unified diff via SSH', async () => {
    const unifiedDiff = `--- a/diff-patch-test.txt
+++ b/diff-patch-test.txt
@@ -1,5 +1,5 @@
 # Test File for Diff/Patch
 line 1: original content
-line 2: new updated value
+line 2: diff updated value
 line 3: more content
 line 4: final line`;

    const res = await request(app)
      .post('/file/diff')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker1-diff')
      .send({
        diff: unifiedDiff,
        dryRun: true
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.dryRun).toBe(true);
  });

  test('tests line-based patch via SSH', async () => {
    const res = await request(app)
      .post('/file/patch')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker1-diff')
      .send({
        filePath: '/tmp/diff-patch-test.txt',
        startLine: 4,
        endLine: 4,
        replace: 'line 3: SSH patched content'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  afterAll(async () => {
    // Cleanup test file
    try {
      await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Selected-Server', 'worker1-diff')
        .send({
          command: 'rm -f /tmp/diff-patch-test.txt /tmp/diff-patch-test.txt.backup.*'
        });
    } catch {}
  });
});