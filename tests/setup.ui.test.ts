import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import fs from 'fs';
import path from 'path';
import path from 'path';

describe('Setup UI Interface', () => {
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

  describe('Setup UI Rendering', () => {
    it('renders main setup interface', async () => {
      const res = await request(app)
        .get('/setup')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.text).toContain('<h1>Setup UI</h1>');
      expect(res.text).toContain('form');
      expect(res.text).toContain('input');
    });

    it('includes navigation elements', async () => {
      const res = await request(app)
        .get('/setup')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.text).toContain('Local');
      expect(res.text).toContain('SSH');
      expect(res.text).toContain('Policy');
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .get('/setup');
      expect(res.status).toBe(401);
    });

    it('includes CSS and JavaScript assets', async () => {
      const res = await request(app)
        .get('/setup')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.text).toMatch(/<style|<link.*css/i);
      expect(res.text).toMatch(/<script/i);
    });
  });

  describe('Local Server Setup', () => {
    it('configures local server successfully', async () => {
      const setupData = {
        hostname: 'test-localhost',
        code: 'true',
        postCommand: 'echo setup complete',
        'llm.provider': 'ollama',
        'llm.baseUrl': 'http://127.0.0.1:11434'
      };

      const res = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send(setupData);
      
      expect([200, 302]).toContain(res.status);
      
      if (fs.existsSync(configPath)) {
        const config = fs.readFileSync(configPath, 'utf8');
        expect(config).toContain('test-localhost');
        expect(config).toContain('ollama');
      }
    });

    it('validates required fields', async () => {
      const res = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({});
      
      expect([400, 422]).toContain(res.status);
    });

    it('handles different LLM providers', async () => {
      const providers = [
        { provider: 'openai', baseUrl: 'https://api.openai.com' },
        { provider: 'lmstudio', baseUrl: 'http://localhost:1234' },
        { provider: 'ollama', baseUrl: 'http://localhost:11434' }
      ];

      for (const llmConfig of providers) {
        const res = await request(app)
          .post('/setup/local')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({
            hostname: `test-${llmConfig.provider}`,
            'llm.provider': llmConfig.provider,
            'llm.baseUrl': llmConfig.baseUrl
          });
        
        expect([200, 302]).toContain(res.status);
      }
    });

    it('requires authentication for setup', async () => {
      const res = await request(app)
        .post('/setup/local')
        .type('form')
        .send({ hostname: 'test' });
      expect(res.status).toBe(401);
    });
  });

  describe('SSH Server Setup', () => {
    it('renders SSH setup form', async () => {
      const res = await request(app)
        .get('/setup/ssh')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.text).toContain('SSH');
      expect(res.text).toContain('hostname');
      expect(res.text).toContain('username');
      expect(res.text).toContain('port');
    });

    it('configures SSH server', async () => {
      const sshData = {
        hostname: 'ssh-server',
        host: '192.168.1.100',
        username: 'testuser',
        port: '22',
        'llm.provider': 'ollama',
        'llm.baseUrl': 'http://192.168.1.100:11434'
      };

      const res = await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send(sshData);
      
      expect([200, 302]).toContain(res.status);
    });

    it('validates SSH configuration', async () => {
      const res = await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ hostname: 'incomplete' });
      
      expect([400, 422]).toContain(res.status);
    });
  });

  describe('Configuration Persistence', () => {
    it('persists configuration to file system', async () => {
      const testHostname = 'persist-test-' + Date.now();
      
      const res = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({
          hostname: testHostname,
          'llm.provider': 'ollama',
          'llm.baseUrl': 'http://localhost:11434'
        });
      
      expect([200, 302]).toContain(res.status);
      
      if (fs.existsSync(configPath)) {
        const config = fs.readFileSync(configPath, 'utf8');
        expect(config).toContain(testHostname);
      }
    });

    it('maintains JSON structure integrity', async () => {
      const res = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({
          hostname: 'json-test',
          'llm.provider': 'ollama'
        });
      
      expect([200, 302]).toContain(res.status);
      
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');
        expect(() => JSON.parse(configContent)).not.toThrow();
      }
    });
  });

  describe('Form Validation', () => {
    it('validates hostname format', async () => {
      const invalidHostnames = ['', ' ', 'host with spaces', 'host@invalid'];
      
      for (const hostname of invalidHostnames) {
        const res = await request(app)
          .post('/setup/local')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ hostname });
        
        expect([400, 422]).toContain(res.status);
      }
    });

    it('validates URL formats', async () => {
      const invalidUrls = ['not-a-url', 'ftp://invalid', 'http://'];
      
      for (const baseUrl of invalidUrls) {
        const res = await request(app)
          .post('/setup/local')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({
            hostname: 'test',
            'llm.baseUrl': baseUrl
          });
        
        expect([400, 422]).toContain(res.status);
      }
    });
  });

  describe('Error Handling', () => {
    it('handles malformed form data', async () => {
      const res = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('malformed=data&incomplete');
      
      expect([200, 302, 400]).toContain(res.status);
    });

    it('handles file system errors gracefully', async () => {
      // Test with potential write permission issues
      const res = await request(app)
        .post('/setup/local')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({
          hostname: 'fs-error-test',
          'llm.provider': 'ollama'
        });
      
      expect([200, 302, 500]).toContain(res.status);
    });

    it('returns 404 for non-existent setup routes', async () => {
      const res = await request(app)
        .get('/setup/nonexistent')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('UI Responsiveness', () => {
    it('includes responsive design elements', async () => {
      const res = await request(app)
        .get('/setup')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.text).toMatch(/viewport|responsive|mobile/i);
    });

    it('handles different content types', async () => {
      const res = await request(app)
        .get('/setup')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'text/html,application/xhtml+xml');
      
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/html/);
    });
  });
});

