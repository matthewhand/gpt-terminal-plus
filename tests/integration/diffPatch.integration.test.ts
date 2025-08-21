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

describe('Diff & Patch Integration Tests', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../tmp');
  const testFile = path.join(testDir, 'integration-test.txt');
  const token = 'test-token';

  beforeAll(async () => {
    process.env.API_TOKEN = token;
    app = makeApp();
    
    // Ensure tmp directory exists
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  beforeEach(() => {
    // Create test file with deterministic content
    const content = 'function hello() {\n  console.log("old message");\n}\n';
    fs.writeFileSync(testFile, content);
  });

  afterEach(() => {
    // Clean up test file
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  afterAll(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should complete full diff-patch workflow', async () => {
    // Step 1: Get diff for existing file
    const diffResponse = await request(app)
      .post('/command/diff')
      .send({ filePath: testFile })
      .expect(200);

    expect(diffResponse.body).toHaveProperty('diff');
    expect(typeof diffResponse.body.diff).toBe('string');
    expect(diffResponse.body.diff).toMatch(/^---.*\n\+\+\+.*\n@@/);

    // Step 2: Apply a valid patch
    const validPatch = `--- a/${testFile}
+++ b/${testFile}
@@ -1,3 +1,3 @@
 function hello() {
-  console.log("old message");
+  console.log("new message");
 }`;

    const patchResponse = await request(app)
      .post('/command/patch')
      .send({ 
        filePath: testFile,
        patch: validPatch
      })
      .expect(200);

    expect(patchResponse.body).toEqual({ ok: true });
  });

  it('should handle patch failure gracefully', async () => {
    // Try to apply an invalid patch
    const invalidPatch = 'this is not a valid unified diff format invalid';

    const response = await request(app)
      .post('/command/patch')
      .send({ 
        filePath: testFile,
        patch: invalidPatch
      })
      .expect(200);

    expect(response.body).toEqual({ 
      ok: false, 
      error: 'Invalid patch format' 
    });
  });

  it('should return proper JSON structure for diff endpoint', async () => {
    const response = await request(app)
      .post('/command/diff')
      .send({ filePath: testFile })
      .expect(200);

    // Verify JSON structure matches OpenAPI spec
    expect(response.body).toHaveProperty('diff');
    expect(typeof response.body.diff).toBe('string');
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('should return proper JSON structure for patch endpoint success', async () => {
    const patch = 'some valid patch content';

    const response = await request(app)
      .post('/command/patch')
      .send({ 
        filePath: testFile,
        patch: patch
      })
      .expect(200);

    // Verify JSON structure matches OpenAPI spec
    expect(response.body).toHaveProperty('ok');
    expect(typeof response.body.ok).toBe('boolean');
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('should return proper JSON structure for patch endpoint failure', async () => {
    const invalidPatch = 'invalid patch format';

    const response = await request(app)
      .post('/command/patch')
      .send({ 
        filePath: testFile,
        patch: invalidPatch
      })
      .expect(200);

    // Verify JSON structure matches OpenAPI spec for error case
    expect(response.body).toHaveProperty('ok', false);
    expect(response.body).toHaveProperty('error');
    expect(typeof response.body.error).toBe('string');
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('should handle concurrent requests properly', async () => {
    // Create multiple test files
    const files = [
      path.join(testDir, 'concurrent1.txt'),
      path.join(testDir, 'concurrent2.txt'),
      path.join(testDir, 'concurrent3.txt')
    ];

    files.forEach(file => {
      fs.writeFileSync(file, 'test content\n');
    });

    try {
      // Send concurrent diff requests
      const promises = files.map(file => 
        request(app)
          .post('/command/diff')
          .send({ filePath: file })
      );

      const responses = await Promise.all(promises);

      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('diff');
      });
    } finally {
      // Clean up
      files.forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });
    }
  });
});