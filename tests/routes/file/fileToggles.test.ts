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

describe('File Operation Toggles', () => {
  let app: express.Application;
  const token = 'test-token';
  const configPath = path.join(process.cwd(), 'convict-config.json');

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  afterEach(() => {
    // Clean up persisted config
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });

  describe('GET /file/operations', () => {
    it('should list all file operations with their enabled status', async () => {
      const res = await request(app)
        .get('/file/operations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      // Check structure
      res.body.data.forEach((op: any) => {
        expect(op).toHaveProperty('operation');
        expect(op).toHaveProperty('enabled');
        expect(typeof op.enabled).toBe('boolean');
      });

      // Check that all expected operations are present
      const operations = res.body.data.map((op: any) => op.operation);
      expect(operations).toContain('create');
      expect(operations).toContain('read');
      expect(operations).toContain('search');
    });

    it('should return 403 when file operations are disabled', async () => {
      // Mock getSettings to return disabled files
      const originalGetSettings = getSettings;
      (getSettings as any) = jest.fn().mockReturnValue({
        files: { enabled: false }
      });

      const res = await request(app)
        .get('/file/operations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('File operations are disabled');

      // Restore
      (getSettings as any) = originalGetSettings;
    });
  });

  describe('POST /file/:operation/toggle', () => {
    it('should toggle an operation to enabled', async () => {
      const res = await request(app)
        .post('/file/create/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: true });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.operation).toBe('create');
      expect(res.body.data.enabled).toBe(true);
    });

    it('should toggle an operation to disabled', async () => {
      const res = await request(app)
        .post('/file/read/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: false });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.operation).toBe('read');
      expect(res.body.data.enabled).toBe(false);
    });

    it('should toggle operation without enabled parameter (flip current state)', async () => {
      // First set to known state
      await request(app)
        .post('/file/update/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: true });

      // Then toggle without parameter
      const res = await request(app)
        .post('/file/update/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.operation).toBe('update');
      expect(res.body.data.enabled).toBe(false); // Should be flipped from true
    });

    it('should persist the toggle change', async () => {
      await request(app)
        .post('/file/search/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: false });

      // Check if config file was created
      expect(fs.existsSync(configPath)).toBe(true);

      // Verify the change was persisted
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(configData.files.operations.search.enabled).toBe(false);
    });

    it('should return 400 for invalid operation', async () => {
      const res = await request(app)
        .post('/file/invalid-operation/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: true });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid operation');
    });

    it('should return 403 when file operations are disabled', async () => {
      // Mock getSettings to return disabled files
      const originalGetSettings = getSettings;
      (getSettings as any) = jest.fn().mockReturnValue({
        files: { enabled: false }
      });

      const res = await request(app)
        .post('/file/create/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: true });

      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('File operations are disabled');

      // Restore
      (getSettings as any) = originalGetSettings;
    });
  });

  describe('POST /file/operations/bulk', () => {
    it('should bulk toggle multiple operations successfully', async () => {
      const operations = {
        create: true,
        read: false,
        update: true
      };

      const res = await request(app)
        .post('/file/operations/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(3);

      res.body.data.forEach((result: any) => {
        expect(result).toHaveProperty('operation');
        expect(result).toHaveProperty('enabled');
        expect(result).toHaveProperty('success');
        expect(result.success).toBe(true);
        expect(result.enabled).toBe(operations[result.operation as keyof typeof operations]);
      });
    });

    it('should handle partial failures in bulk toggle', async () => {
      const operations = {
        create: true,
        'invalid-op': false,
        read: false
      };

      const res = await request(app)
        .post('/file/operations/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations });

      expect(res.status).toBe(207); // Multi-status
      expect(res.body.status).toBe('partial');
      expect(Array.isArray(res.body.data)).toBe(true);

      const results = res.body.data;
      const createResult = results.find((r: any) => r.operation === 'create');
      const invalidResult = results.find((r: any) => r.operation === 'invalid-op');
      const readResult = results.find((r: any) => r.operation === 'read');

      expect(createResult.success).toBe(true);
      expect(createResult.enabled).toBe(true);

      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error).toContain('Invalid operation');

      expect(readResult.success).toBe(true);
      expect(readResult.enabled).toBe(false);
    });

    it('should handle invalid enabled values in bulk toggle', async () => {
      const operations = {
        create: 'not-a-boolean' as any,
        read: true
      };

      const res = await request(app)
        .post('/file/operations/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations });

      expect(res.status).toBe(207);
      expect(res.body.status).toBe('partial');

      const createResult = res.body.data.find((r: any) => r.operation === 'create');
      const readResult = res.body.data.find((r: any) => r.operation === 'read');

      expect(createResult.success).toBe(false);
      expect(createResult.error).toContain('enabled must be a boolean');

      expect(readResult.success).toBe(true);
      expect(readResult.enabled).toBe(true);
    });

    it('should return 400 for missing operations object', async () => {
      const res = await request(app)
        .post('/file/operations/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('operations object is required');
    });

    it('should return 400 for non-object operations', async () => {
      const res = await request(app)
        .post('/file/operations/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: 'not-an-object' });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('operations object is required');
    });

    it('should return 403 when file operations are disabled', async () => {
      // Mock getSettings to return disabled files
      const originalGetSettings = getSettings;
      (getSettings as any) = jest.fn().mockReturnValue({
        files: { enabled: false }
      });

      const res = await request(app)
        .post('/file/operations/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: { create: true } });

      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('File operations are disabled');

      // Restore
      (getSettings as any) = originalGetSettings;
    });

    it('should persist successful changes in bulk toggle', async () => {
      await request(app)
        .post('/file/operations/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: { create: false, read: true } });

      // Check persistence
      expect(fs.existsSync(configPath)).toBe(true);
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(configData.files.operations.create.enabled).toBe(false);
      expect(configData.files.operations.read.enabled).toBe(true);
    });
  });

  describe('integration with persistence', () => {
    it('should maintain state across requests', async () => {
      // Set initial state
      await request(app)
        .post('/file/create/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: false });

      // Check state
      let res = await request(app)
        .get('/file/operations')
        .set('Authorization', `Bearer ${token}`);

      const createOp = res.body.data.find((op: any) => op.operation === 'create');
      expect(createOp.enabled).toBe(false);

      // Toggle again
      await request(app)
        .post('/file/create/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: true });

      // Check state again
      res = await request(app)
        .get('/file/operations')
        .set('Authorization', `Bearer ${token}`);

      const createOpAgain = res.body.data.find((op: any) => op.operation === 'create');
      expect(createOpAgain.enabled).toBe(true);
    });
  });
});