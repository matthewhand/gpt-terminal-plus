import request from 'supertest';
import express from 'express';
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
  }
  return app;
}

describe('POST /file/fuzzy-patch', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../tmp/fuzzy-patch-tests');
  const testFile = path.join(testDir, 'test.txt');
  const token = 'test-token';

  beforeAll(async () => {
    process.env.API_TOKEN = token;
    app = makeApp();
    
    // Ensure test directory exists
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  beforeEach(() => {
    // Create test file with initial content
    const initialContent = 'function hello() {\n  console.log("old message");\n}';
    fs.writeFileSync(testFile, initialContent);
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

  describe('successful fuzzy patching', () => {
    it('should apply fuzzy patch successfully', async () => {
      const oldText = 'function hello() {\n  console.log("old message");\n}';
      const newText = 'function hello() {\n  console.log("new message");\n}';

      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          filePath: testFile,
          oldText,
          newText
        });
        
      if (response.status !== 200) {
        console.error('Error response:', response.body);
        console.error('Status:', response.status);
      }
      
      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('successfully');
      expect(response.body.backup).toBeDefined();
      expect(response.body.results).toBeDefined();
      expect(response.body.appliedPatches).toBeGreaterThan(0);
      expect(response.body.totalPatches).toBeGreaterThan(0);

      // Verify file was actually updated
      const updatedContent = fs.readFileSync(testFile, 'utf-8');
      expect(updatedContent).toContain('new message');
    });

    it('should handle preview mode without modifying file', async () => {
      const oldText = 'function hello() {\n  console.log("old message");\n}';
      const newText = 'function hello() {\n  console.log("preview message");\n}';
      const originalContent = fs.readFileSync(testFile, 'utf-8');

      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          filePath: testFile,
          oldText,
          newText,
          preview: true
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.preview).toBe(true);
      expect(response.body.patchedText).toContain('preview message');
      expect(response.body.results).toBeDefined();
      expect(response.body.backup).toBeUndefined(); // No backup in preview mode

      // Verify file was not modified
      const currentContent = fs.readFileSync(testFile, 'utf-8');
      expect(currentContent).toBe(originalContent);
    });

    it('should apply patch even when file has drifted', async () => {
      // Modify the file to simulate drift
      const driftedContent = '// Added comment\nfunction hello() {\n  console.log("old message");\n}';
      fs.writeFileSync(testFile, driftedContent);

      const oldText = 'function hello() {\n  console.log("old message");\n}';
      const newText = 'function hello() {\n  console.log("fuzzy message");\n}';

      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          filePath: testFile,
          oldText,
          newText
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify patch was applied and drift was preserved
      const updatedContent = fs.readFileSync(testFile, 'utf-8');
      expect(updatedContent).toContain('fuzzy message');
      expect(updatedContent).toContain('// Added comment'); // Drift preserved
    });
  });

  describe('error handling', () => {
    it('should return 400 when filePath is missing', async () => {
      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldText: 'old',
          newText: 'new'
        })
        .expect(400);

      expect(response.body.error).toBe('filePath is required');
    });

    it('should return 400 when oldText is missing', async () => {
      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          filePath: testFile,
          newText: 'new'
        })
        .expect(400);

      expect(response.body.error).toBe('oldText is required');
    });

    it('should return 400 when newText is missing', async () => {
      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          filePath: testFile,
          oldText: 'old'
        })
        .expect(400);

      expect(response.body.error).toBe('newText is required');
    });

    it('should return 400 when file does not exist', async () => {
      const nonExistentFile = path.join(testDir, 'nonexistent.txt');

      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          filePath: nonExistentFile,
          oldText: 'old',
          newText: 'new'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('File not found');
    });

    it('should return 400 when patch cannot be applied', async () => {
      const oldText = 'completely different content';
      const newText = 'updated different content';

      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          filePath: testFile,
          oldText,
          newText
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Patch could not be applied');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/file/fuzzy-patch')
        .send({
          filePath: testFile,
          oldText: 'old',
          newText: 'new'
        })
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('backup functionality', () => {
    it('should create backup file when applying patch', async () => {
      const oldText = 'function hello() {\n  console.log("old message");\n}';
      const newText = 'function hello() {\n  console.log("backup test");\n}';

      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          filePath: testFile,
          oldText,
          newText
        })
        .expect(200);

      expect(response.body.backup).toBeDefined();
      expect(fs.existsSync(response.body.backup)).toBe(true);

      // Verify backup contains original content
      const backupContent = fs.readFileSync(response.body.backup, 'utf-8');
      expect(backupContent).toContain('old message');

      // Clean up backup
      fs.unlinkSync(response.body.backup);
    });

    it('should not create backup in preview mode', async () => {
      const oldText = 'function hello() {\n  console.log("old message");\n}';
      const newText = 'function hello() {\n  console.log("no backup test");\n}';

      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          filePath: testFile,
          oldText,
          newText,
          preview: true
        })
        .expect(200);

      expect(response.body.backup).toBeUndefined();
    });
  });
});