import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import setupMiddlewares from '../../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../../src/routes';
import { getSettings } from '../../../src/settings/store';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('POST /file/search', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../../tmp/search');
  const testFile1 = path.join(testDir, 'test1.txt');
  const testFile2 = path.join(testDir, 'test2.js');
  const testFile3 = path.join(testDir, 'test3.ts');
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  beforeEach(() => {
    // Create test files with content
    fs.writeFileSync(testFile1, 'This is a test file\nwith multiple lines\nfunction test() {\n  return "hello";\n}');
    fs.writeFileSync(testFile2, 'const test = () => {\n  console.log("test");\n  return true;\n};');
    fs.writeFileSync(testFile3, 'interface Test {\n  name: string;\n  value: number;\n}\n\nexport class TestClass implements Test {\n  constructor(public name: string, public value: number) {}\n}');
  });

  afterEach(() => {
    [testFile1, testFile2, testFile3].forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('successful searches', () => {
    it('should search for a simple string pattern', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'test',
          path: 'tmp/search'
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.items)).toBe(true);
      expect(res.body.data.total).toBeGreaterThan(0);
      expect(res.body.data.items[0]).toHaveProperty('filePath');
      expect(res.body.data.items[0]).toHaveProperty('lineNumber');
      expect(res.body.data.items[0]).toHaveProperty('content');
    });

    it('should search with regex pattern', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'function\\s+\\w+',
          path: 'tmp/search'
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.total).toBeGreaterThan(0);
    });

    it('should handle case insensitive search', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'TEST',
          path: 'tmp/search',
          caseSensitive: false
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.total).toBeGreaterThan(0);
    });

    it('should handle pagination', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'test',
          path: 'tmp/search',
          page: 1,
          limit: 2
        });

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBeLessThanOrEqual(2);
      expect(res.body.data.limit).toBe(2);
      expect(res.body.data.offset).toBe(0);
    });

    it('should handle second page', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'test',
          path: 'tmp/search',
          page: 2,
          limit: 1
        });

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBeLessThanOrEqual(1);
      expect(res.body.data.offset).toBe(1);
    });
  });

  describe('validation and error handling', () => {
    it('should return 400 for missing pattern', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          path: 'tmp/search'
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Required');
    });

    it('should return 400 for empty pattern', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: '',
          path: 'tmp/search'
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Pattern is required');
    });

    it('should return 400 for missing path', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'test'
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Required');
    });

    it('should return 400 for invalid regex pattern', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: '[invalid',
          path: 'tmp/search'
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid regex pattern');
    });

    it('should return 403 when file operations are disabled', async () => {
      // Mock getSettings to return disabled files
      const originalGetSettings = getSettings;
      (getSettings as any) = jest.fn().mockReturnValue({
        files: { enabled: false }
      });

      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'test',
          path: 'tmp/search'
        });

      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('File search is disabled');

      // Restore
      (getSettings as any) = originalGetSettings;
    });

    it('should return 400 for invalid page number', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'test',
          path: 'tmp/search',
          page: 0
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should return 400 for invalid limit', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'test',
          path: 'tmp/search',
          limit: 1001
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });

  describe('edge cases', () => {
    it('should return empty results for non-matching pattern', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'nonexistentpattern12345',
          path: 'tmp/search'
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.items).toEqual([]);
      expect(res.body.data.total).toBe(0);
    });

    it('should handle special regex characters', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: '\\bfunction\\b',
          path: 'tmp/search'
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should handle large limit', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'test',
          path: 'tmp/search',
          limit: 1000
        });

      expect(res.status).toBe(200);
      expect(res.body.data.limit).toBe(1000);
    });

    it('should handle case sensitive search', async () => {
      const res = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pattern: 'TEST',
          path: 'tmp/search',
          caseSensitive: true
        });

      expect(res.status).toBe(200);
      // Should have fewer or no results since content has 'test' not 'TEST'
      expect(res.body.data.total).toBeLessThanOrEqual(1);
    });
  });
});