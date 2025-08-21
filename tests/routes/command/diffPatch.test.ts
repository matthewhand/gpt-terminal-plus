import request from 'supertest';
import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import setupMiddlewares from '../../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../../src/routes';

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

describe('Command Diff & Patch Endpoints', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../../tmp');
  const testFile = path.join(testDir, 'test.txt');
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
    // Create test file with initial content
    fs.writeFileSync(testFile, 'line1\nold content\nline3\n');
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

  describe('POST /command/diff', () => {
    it('should return diff when file exists', async () => {
      const response = await request(app)
        .post('/command/diff')
        .send({ filePath: testFile });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('diff');
      expect(response.body.diff).toContain('--- a/');
      expect(response.body.diff).toContain('+++ b/');
      expect(response.body.diff).toContain('@@');
    });

    it('should return 404 when file does not exist', async () => {
      const nonExistentFile = path.join(testDir, 'nonexistent.txt');
      
      const response = await request(app)
        .post('/command/diff')
        .send({ filePath: nonExistentFile });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'File not found');
    });

    it('should return 400 when filePath is missing', async () => {
      const response = await request(app)
        .post('/command/diff')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'filePath is required');
    });
  });

  describe('POST /command/patch', () => {
    it('should successfully apply a valid patch', async () => {
      const validPatch = `--- a/${testFile}
+++ b/${testFile}
@@ -1,3 +1,3 @@
 line1
-old content
+new content
 line3`;

      const response = await request(app)
        .post('/command/patch')
        .send({ 
          filePath: testFile,
          patch: validPatch
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
    });

    it('should return error when patch is invalid', async () => {
      const invalidPatch = 'invalid patch format';

      const response = await request(app)
        .post('/command/patch')
        .send({ 
          filePath: testFile,
          patch: invalidPatch
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        ok: false, 
        error: 'Invalid patch format' 
      });
    });

    it('should return 404 when file does not exist', async () => {
      const nonExistentFile = path.join(testDir, 'nonexistent.txt');
      const validPatch = 'some patch content';

      const response = await request(app)
        .post('/command/patch')
        .send({ 
          filePath: nonExistentFile,
          patch: validPatch
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'File not found');
    });

    it('should return 400 when filePath is missing', async () => {
      const response = await request(app)
        .post('/command/patch')
        .send({ patch: 'some patch' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'filePath and patch are required');
    });

    it('should return 400 when patch is missing', async () => {
      const response = await request(app)
        .post('/command/patch')
        .send({ filePath: testFile });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'filePath and patch are required');
    });
  });
});