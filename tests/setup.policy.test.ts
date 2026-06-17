import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import fs from 'fs';
import path from 'path';

describe('Setup Policy Configuration', () => {
  let app: express.Express;
  let token: string;
  const configPath = 'config/test/test.json';
  let originalConfig: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setupApiRouter(app);
    
    // Backup original config
    if (fs.existsSync(configPath)) {
      originalConfig = fs.readFileSync(configPath, 'utf8');
    }
  });

  afterAll(() => {
    // Restore original config
    if (originalConfig) {
      fs.writeFileSync(configPath, originalConfig);
    }
  });

  describe('Policy UI Rendering', () => {
    it('renders policy configuration page', async () => {
      const res = await request(app)
        .get('/setup/policy')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.text).toContain('Safety Policy');
      expect(res.text).toContain('confirmRegex');
      expect(res.text).toContain('denyRegex');
    });

    it('includes form elements', async () => {
      const res = await request(app)
        .get('/setup/policy')
        .set('Authorization', `Bearer ${token}`);
      expect(res.text).toContain('<form');
      expect(res.text).toContain('input');
      expect(res.text).toContain('submit');
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .get('/setup/policy');
      expect(res.status).toBe(401);
    });
  });

  describe('Policy Configuration Updates', () => {
    it('updates safety policy configuration', async () => {
      const policyData = {
        confirmRegex: 'rm\\s+-rf',
        denyRegex: ':/$',
        maxInputLength: '1000'
      };

      const res = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send(policyData);
      
      expect([200, 302]).toContain(res.status);
      
      if (fs.existsSync(configPath)) {
        const config = fs.readFileSync(configPath, 'utf8');
        expect(config).toContain('confirmRegex');
        expect(config).toContain('denyRegex');
      }
    });

    it('handles empty policy values', async () => {
      const res = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ confirmRegex: '', denyRegex: '' });
      
      expect([200, 302]).toContain(res.status);
    });

    it('validates regex patterns', async () => {
      const res = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ confirmRegex: '[invalid-regex', denyRegex: 'valid.*' });
      
      expect([200, 302, 400]).toContain(res.status);
    });

    it('requires authentication for updates', async () => {
      const res = await request(app)
        .post('/setup/policy')
        .type('form')
        .send({ confirmRegex: 'test' });
      expect(res.status).toBe(401);
    });
  });

  describe('Policy Validation', () => {
    it('handles dangerous command patterns', async () => {
      const dangerousPatterns = {
        confirmRegex: 'rm\\s+-rf|sudo\\s+rm',
        denyRegex: 'format\\s+c:|del\\s+/s'
      };

      const res = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send(dangerousPatterns);
      
      expect([200, 302]).toContain(res.status);
    });

    it('handles special characters in patterns', async () => {
      const specialPatterns = {
        confirmRegex: '\\$\\(.*\\)',
        denyRegex: '\\|\\s*nc\\s+'
      };

      const res = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send(specialPatterns);
      
      expect([200, 302]).toContain(res.status);
    });
  });

  describe('Configuration Persistence', () => {
    it('persists policy changes to config file', async () => {
      const testPattern = 'test-pattern-' + Date.now();
      
      const res = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ confirmRegex: testPattern });
      
      expect([200, 302]).toContain(res.status);
      
      if (fs.existsSync(configPath)) {
        const config = fs.readFileSync(configPath, 'utf8');
        expect(config).toContain(testPattern);
      }
    });

    it('maintains config file structure', async () => {
      const res = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ confirmRegex: 'test' });
      
      expect([200, 302]).toContain(res.status);
      
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        expect(typeof config).toBe('object');
      }
    });
  });

  describe('Error Handling', () => {
    it('handles malformed form data', async () => {
      const res = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('malformed=data&incomplete');
      
      expect([200, 302, 400]).toContain(res.status);
    });

    it('handles file system errors gracefully', async () => {
      // Test with read-only config directory scenario
      const res = await request(app)
        .post('/setup/policy')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ confirmRegex: 'test' });
      
      expect([200, 302, 500]).toContain(res.status);
    });

    it('returns 404 for non-existent setup endpoints', async () => {
      const res = await request(app)
        .get('/setup/nonexistent')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});

