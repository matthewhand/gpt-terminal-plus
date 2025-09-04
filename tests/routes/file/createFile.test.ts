import request from 'supertest';
import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import setupMiddlewares from '../../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../../src/routes';
import { getOrGenerateApiToken } from '../../../src/common/apiToken';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('POST /file/create', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../../tmp_rovodev_file_create');
  const token = getOrGenerateApiToken();
  
  // Store original environment
  const originalEnv = {
    API_TOKEN: process.env.API_TOKEN,
    NODE_ENV: process.env.NODE_ENV
  };

  beforeAll(() => {
    process.env.API_TOKEN = token;
    process.env.NODE_ENV = 'test';
    app = makeApp();
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up any test files
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir);
      files.forEach(file => {
        const filePath = path.join(testDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
    }
  });

  afterAll(() => {
    // Restore environment
    Object.assign(process.env, originalEnv);
    
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('successful file creation', () => {
    it('should create file successfully with basic content', async () => {
      const testFile = path.join(testDir, 'basic-test.txt');
      const content = 'Hello World';
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: content
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('File created successfully');
      expect(response.body.data.filePath).toBe(testFile);
      expect(fs.existsSync(testFile)).toBe(true);
      expect(fs.readFileSync(testFile, 'utf8')).toBe(content);
    });

    it('should create file with empty content', async () => {
      const testFile = path.join(testDir, 'empty-test.txt');
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: ''
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(fs.existsSync(testFile)).toBe(true);
      expect(fs.readFileSync(testFile, 'utf8')).toBe('');
    });

    it('should create file with multiline content', async () => {
      const testFile = path.join(testDir, 'multiline-test.txt');
      const content = 'Line 1\nLine 2\nLine 3\n';
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: content
        });

      expect(response.status).toBe(200);
      expect(fs.readFileSync(testFile, 'utf8')).toBe(content);
    });

    it('should create file with special characters', async () => {
      const testFile = path.join(testDir, 'special-chars-test.txt');
      const content = 'Special chars: áéíóú ñ ¿¡ €$£¥ 中文 🚀';
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: content
        });

      expect(response.status).toBe(200);
      expect(fs.readFileSync(testFile, 'utf8')).toBe(content);
    });

    it('should create file with JSON content', async () => {
      const testFile = path.join(testDir, 'json-test.json');
      const content = JSON.stringify({ key: 'value', number: 42, array: [1, 2, 3] }, null, 2);
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: content
        });

      expect(response.status).toBe(200);
      expect(fs.readFileSync(testFile, 'utf8')).toBe(content);
    });
  });

  describe('file overwrite scenarios', () => {
    it('should handle overwrite scenario with backup option', async () => {
      const testFile = path.join(testDir, 'overwrite-test.txt');
      const originalContent = 'Original content';
      const newContent = 'New content';
      
      // Create initial file
      fs.writeFileSync(testFile, originalContent);
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: newContent,
          backup: true
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(fs.readFileSync(testFile, 'utf8')).toBe(newContent);
    });

    it('should handle overwrite without backup option', async () => {
      const testFile = path.join(testDir, 'overwrite-no-backup.txt');
      const originalContent = 'Original content';
      const newContent = 'New content';
      
      // Create initial file
      fs.writeFileSync(testFile, originalContent);
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: newContent
        });

      expect(response.status).toBe(200);
      expect(fs.readFileSync(testFile, 'utf8')).toBe(newContent);
    });

    it('should handle overwrite of read-only file', async () => {
      const testFile = path.join(testDir, 'readonly-test.txt');
      
      // Create initial file and make it read-only
      fs.writeFileSync(testFile, 'Original content');
      fs.chmodSync(testFile, 0o444); // Read-only
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: 'New content'
        });

      // Should handle permission error gracefully
      expect([200, 403, 500]).toContain(response.status);
      
      // Restore permissions for cleanup
      try {
        fs.chmodSync(testFile, 0o644);
      } catch (e) {
        // Ignore cleanup errors
      }
    });
  });

  describe('input validation', () => {
    it('should return error for missing filePath', async () => {
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Hello World' });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('File path is required');
      expect(response.body.data).toBe(null);
    });

    it('should return error for null filePath', async () => {
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: null,
          content: 'Hello World'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return error for invalid filePath type', async () => {
      const invalidPaths = [123, true, [], {}];
      
      for (const invalidPath of invalidPaths) {
        const response = await request(app)
          .post('/file/create')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            filePath: invalidPath,
            content: 'Hello World'
          });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toContain('must be a string');
      }
    });

    it('should return error for empty filePath', async () => {
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: '',
          content: 'Hello World'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should return error for missing content', async () => {
      const testFile = path.join(testDir, 'no-content.txt');
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: testFile });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should handle invalid content types', async () => {
      const testFile = path.join(testDir, 'invalid-content.txt');
      const invalidContents = [123, true, [], {}];
      
      for (const invalidContent of invalidContents) {
        const response = await request(app)
          .post('/file/create')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            filePath: testFile,
            content: invalidContent
          });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
      }
    });
  });

  describe('security and path validation', () => {
    it('should reject absolute paths outside working directory', async () => {
      const maliciousPaths = [
        '/etc/passwd',
        '/tmp/malicious.txt',
        'C:\\Windows\\System32\\config\\sam'
      ];
      
      for (const maliciousPath of maliciousPaths) {
        const response = await request(app)
          .post('/file/create')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            filePath: maliciousPath,
            content: 'malicious content'
          });

        expect([400, 403]).toContain(response.status);
        expect(response.body.status).toBe('error');
      }
    });

    it('should reject path traversal attempts', async () => {
      const traversalPaths = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        './../../etc/shadow',
        'subdir/../../../etc/passwd'
      ];
      
      for (const traversalPath of traversalPaths) {
        const response = await request(app)
          .post('/file/create')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            filePath: traversalPath,
            content: 'traversal content'
          });

        expect([400, 403]).toContain(response.status);
        expect(response.body.status).toBe('error');
      }
    });

    it('should allow valid relative paths', async () => {
      const validPaths = [
        path.join(testDir, 'valid1.txt'),
        path.join(testDir, 'subdir', 'valid2.txt'),
        path.join(testDir, 'nested', 'deep', 'valid3.txt')
      ];
      
      for (const validPath of validPaths) {
        // Ensure directory exists
        const dir = path.dirname(validPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        const response = await request(app)
          .post('/file/create')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            filePath: validPath,
            content: 'valid content'
          });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
      }
    });
  });

  describe('authentication and authorization', () => {
    it('should require authentication', async () => {
      const testFile = path.join(testDir, 'auth-test.txt');
      
      const response = await request(app)
        .post('/file/create')
        .send({ 
          filePath: testFile,
          content: 'Hello World'
        });

      expect(response.status).toBe(401);
    });

    it('should reject invalid tokens', async () => {
      const testFile = path.join(testDir, 'invalid-token.txt');
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', 'Bearer invalid-token')
        .send({ 
          filePath: testFile,
          content: 'Hello World'
        });

      expect(response.status).toBe(401);
    });

    it('should reject malformed authorization headers', async () => {
      const testFile = path.join(testDir, 'malformed-auth.txt');
      const malformedHeaders = [
        'invalid-format',
        'Bearer',
        'Basic dGVzdA==',
        `Token ${token}`
      ];
      
      for (const header of malformedHeaders) {
        const response = await request(app)
          .post('/file/create')
          .set('Authorization', header)
          .send({ 
            filePath: testFile,
            content: 'Hello World'
          });

        expect(response.status).toBe(401);
      }
    });
  });

  describe('error handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBe(400);
    });

    it('should handle very large content', async () => {
      const testFile = path.join(testDir, 'large-content.txt');
      const largeContent = 'x'.repeat(1024 * 1024); // 1MB
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: largeContent
        });

      // Should either succeed or fail gracefully
      expect([200, 413, 500]).toContain(response.status);
    });

    it('should handle concurrent file creation requests', async () => {
      const requests = Array(5).fill(null).map((_, i) => 
        request(app)
          .post('/file/create')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            filePath: path.join(testDir, `concurrent-${i}.txt`),
            content: `Content ${i}`
          })
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach((response, i) => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
      });
    });
  });

  describe('response format validation', () => {
    it('should return consistent response structure for success', async () => {
      const testFile = path.join(testDir, 'response-format.txt');
      
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          filePath: testFile,
          content: 'test content'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('filePath');
      expect(typeof response.body.message).toBe('string');
      expect(typeof response.body.data.filePath).toBe('string');
    });

    it('should return consistent response structure for errors', async () => {
      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'missing path' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data', null);
      expect(typeof response.body.message).toBe('string');
    });
  });
});