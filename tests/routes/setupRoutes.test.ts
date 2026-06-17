import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';
import fs from 'fs';
import path from 'path';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('Setup Routes', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    process.env.NODE_CONFIG_DIR = 'config/test';
    app = makeApp();
  });

  beforeEach(() => {
    // Clean up test config
    const cfgPath = path.join('config/test', 'test.json');
    if (fs.existsSync(cfgPath)) {
      fs.unlinkSync(cfgPath);
    }
  });

  describe('GET /setup', () => {
    it('should return setup page HTML', async () => {
      const response = await request(app)
        .get('/setup')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toContain('<title>Setup UI</title>');
      expect(response.text).toContain('Safety Policy');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/setup');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /setup/policy', () => {
    it('should return policy configuration page', async () => {
      const response = await request(app)
        .get('/setup/policy')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toContain('<title>Safety Policy Configuration</title>');
      expect(response.text).toContain('Confirm Regex');
      expect(response.text).toContain('Deny Regex');
    });

    it('should load existing policy from config', async () => {
      const cfgPath = path.join('config/test', 'test.json');
      const cfgDir = path.dirname(cfgPath);
      if (!fs.existsSync(cfgDir)) {
        fs.mkdirSync(cfgDir, { recursive: true });
      }
      fs.writeFileSync(cfgPath, JSON.stringify({
        safety: { confirmRegex: 'test-confirm', denyRegex: 'test-deny' }
      }));

      const response = await request(app)
        .get('/setup/policy')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toContain('value="test-confirm"');
      expect(response.text).toContain('value="test-deny"');
    });
  });

  describe('POST /setup/policy', () => {
    it('should save policy configuration', async () => {
      const response = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .send({ confirmRegex: 'new-confirm', denyRegex: 'new-deny' });

      expect(response.status).toBe(302); // Redirect
      expect(response.headers.location).toBe('/setup/policy');

      // Check if config was saved
      const cfgPath = path.join('config/test', 'test.json');
      expect(fs.existsSync(cfgPath)).toBe(true);
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      expect(cfg.safety.confirmRegex).toBe('new-confirm');
      expect(cfg.safety.denyRegex).toBe('new-deny');
    });

    it('should handle empty values', async () => {
      const response = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .send({ confirmRegex: '', denyRegex: '' });

      expect(response.status).toBe(302);
    });
  });

  describe('GET /setup/local', () => {
    it('should return local configuration page', async () => {
      const response = await request(app)
        .get('/setup/local')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toContain('<title>Local Configuration</title>');
    });
  });

  describe('POST /setup/local', () => {
    it('should save local configuration', async () => {
      const response = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .send({ hostname: 'test-host' });

      expect(response.status).toBe(200);
      expect(response.text).toBe('Local configuration saved');

      const cfgPath = path.join('config/test', 'test.json');
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      expect(cfg.local.hostname).toBe('test-host');
    });

    it('should validate hostname', async () => {
      const response = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .send({ hostname: '' });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid hostname');
    });

    it('should validate hostname format', async () => {
      const response = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .send({ hostname: 'invalid@host' });

      expect(response.status).toBe(422);
      expect(response.text).toBe('Invalid hostname format');
    });

    it('should validate baseUrl if provided', async () => {
      const response = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .send({ hostname: 'test-host', 'llm.baseUrl': 'invalid-url' });

      expect(response.status).toBe(422);
      expect(response.text).toBe('Invalid baseUrl');
    });

    it('should accept valid baseUrl', async () => {
      const response = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .send({ hostname: 'test-host', 'llm.baseUrl': 'https://api.example.com' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /setup/ssh', () => {
    it('should return SSH configuration page', async () => {
      const response = await request(app)
        .get('/setup/ssh')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toContain('<title>SSH Configuration</title>');
      expect(response.text).toContain('name="hostname"');
    });
  });

  describe('POST /setup/ssh', () => {
    it('should save SSH configuration', async () => {
      const response = await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .send({
          hostname: 'test-ssh',
          username: 'testuser',
          port: '22'
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('SSH configuration saved');

      const cfgPath = path.join('config/test', 'test.json');
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      expect(cfg.ssh.hosts[0].name).toBe('test-ssh');
      expect(cfg.ssh.hosts[0].username).toBe('testuser');
      expect(cfg.ssh.hosts[0].port).toBe(22);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .send({ hostname: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Missing required fields');
    });

    it('should handle edit mode', async () => {
      // First create a host
      await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .send({
          hostname: 'test-ssh',
          username: 'testuser',
          port: '22'
        });

      // Then edit it
      const response = await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .send({
          edit: 'test-ssh',
          hostname: 'test-ssh',
          username: 'newuser',
          port: '2222'
        });

      expect(response.status).toBe(200);
      const cfgPath = path.join('config/test', 'test.json');
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      expect(cfg.ssh.hosts[0].username).toBe('newuser');
      expect(cfg.ssh.hosts[0].port).toBe(2222);
    });
  });
});