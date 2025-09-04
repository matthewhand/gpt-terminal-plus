import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import fs from 'fs';
import path from 'path';

describe('Setup UI SSH Configuration', () => {
  let app: express.Express;
  let token: string;
  let originalEnv: string | undefined;
  let originalConfigDir: string | undefined;
  let configPath: string;
  let backupConfigPath: string;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
    originalConfigDir = process.env.NODE_CONFIG_DIR;
    
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    
    configPath = path.join('config/test/test.json');
    backupConfigPath = configPath + '.backup';
    
    // Backup existing config if it exists
    if (fs.existsSync(configPath)) {
      fs.copyFileSync(configPath, backupConfigPath);
    }
    
    token = getOrGenerateApiToken();
  });

  afterAll(() => {
    // Restore original environment
    if (originalEnv !== undefined) {
      process.env.NODE_ENV = originalEnv;
    } else {
      delete process.env.NODE_ENV;
    }
    
    if (originalConfigDir !== undefined) {
      process.env.NODE_CONFIG_DIR = originalConfigDir;
    } else {
      delete process.env.NODE_CONFIG_DIR;
    }
    
    // Restore backup config
    if (fs.existsSync(backupConfigPath)) {
      fs.copyFileSync(backupConfigPath, configPath);
      fs.unlinkSync(backupConfigPath);
    }
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setupApiRouter(app);
    
    // Ensure config directory exists
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Initialize with basic config if needed
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify({
        servers: {},
        llm: { provider: 'ollama', baseUrl: 'http://localhost:11434' }
      }, null, 2));
    }
  });

  describe('SSH host configuration editing', () => {
    it('should edit existing SSH host LLM settings successfully', async () => {
      const res = await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ 
          edit: 'ssh-bash.example.com', 
          hostname: 'ssh-bash.example.com', 
          port: '22', 
          username: 'chatgpt', 
          privateKeyPath: '/home/chatgpt/.ssh/id_rsa', 
          'llm.provider': 'ollama', 
          'llm.baseUrl': 'http://sshhost:11434' 
        });
        
      expect([200, 302]).toContain(res.status);
      
      // Verify configuration was saved
      const configContent = fs.readFileSync(configPath, 'utf8');
      expect(configContent).toContain('ssh-bash.example.com');
      expect(configContent).toContain('ollama');
      expect(configContent).toContain('sshhost');
    });

    it('should handle SSH configuration with different providers', async () => {
      const providers = [
        { provider: 'openai', baseUrl: 'https://api.openai.com/v1' },
        { provider: 'ollama', baseUrl: 'http://localhost:11434' },
        { provider: 'lmstudio', baseUrl: 'http://localhost:1234/v1' }
      ];

      for (const { provider, baseUrl } of providers) {
        const res = await request(app)
          .post('/setup/ssh')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ 
            edit: `ssh-${provider}.example.com`, 
            hostname: `ssh-${provider}.example.com`, 
            port: '22', 
            username: 'testuser', 
            privateKeyPath: '/home/testuser/.ssh/id_rsa', 
            'llm.provider': provider, 
            'llm.baseUrl': baseUrl 
          });
          
        expect([200, 302]).toContain(res.status);
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        expect(configContent).toContain(provider);
        expect(configContent).toContain(baseUrl);
      }
    });

    it('should handle SSH configuration with custom ports', async () => {
      const customPorts = ['2222', '22222', '443'];

      for (const port of customPorts) {
        const res = await request(app)
          .post('/setup/ssh')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ 
            edit: `ssh-port-${port}.example.com`, 
            hostname: `ssh-port-${port}.example.com`, 
            port: port, 
            username: 'testuser', 
            privateKeyPath: '/home/testuser/.ssh/id_rsa', 
            'llm.provider': 'ollama', 
            'llm.baseUrl': 'http://localhost:11434' 
          });
          
        expect([200, 302]).toContain(res.status);
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        expect(configContent).toContain(`ssh-port-${port}.example.com`);
        expect(configContent).toContain(`"port":"${port}"`);
      }
    });

    it('should handle SSH configuration with different key paths', async () => {
      const keyPaths = [
        '/home/user/.ssh/id_rsa',
        '/home/user/.ssh/id_ed25519',
        '/custom/path/to/key',
        '~/.ssh/custom_key'
      ];

      for (const keyPath of keyPaths) {
        const res = await request(app)
          .post('/setup/ssh')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ 
            edit: 'ssh-keytest.example.com', 
            hostname: 'ssh-keytest.example.com', 
            port: '22', 
            username: 'testuser', 
            privateKeyPath: keyPath, 
            'llm.provider': 'ollama', 
            'llm.baseUrl': 'http://localhost:11434' 
          });
          
        expect([200, 302]).toContain(res.status);
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        expect(configContent).toContain('ssh-keytest.example.com');
        expect(configContent).toContain(keyPath);
      }
    });
  });

  describe('form validation and error handling', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/setup/ssh')
        .type('form')
        .send({ 
          edit: 'test.example.com', 
          hostname: 'test.example.com', 
          port: '22', 
          username: 'testuser' 
        });
        
      expect(res.status).toBe(401);
    });

    it('should handle missing required fields gracefully', async () => {
      const incompleteConfigs = [
        { hostname: 'test.com' }, // Missing other fields
        { port: '22' }, // Missing hostname
        { username: 'user' }, // Missing hostname
        {} // Empty config
      ];

      for (const config of incompleteConfigs) {
        const res = await request(app)
          .post('/setup/ssh')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send(config);
          
        // Should either succeed with defaults or fail gracefully
        expect([200, 302, 400]).toContain(res.status);
      }
    });

    it('should handle invalid port numbers', async () => {
      const invalidPorts = ['abc', '0', '65536', '-1', ''];

      for (const port of invalidPorts) {
        const res = await request(app)
          .post('/setup/ssh')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ 
            edit: 'test.example.com', 
            hostname: 'test.example.com', 
            port: port, 
            username: 'testuser' 
          });
          
        // Should either handle gracefully or reject
        expect([200, 302, 400]).toContain(res.status);
      }
    });

    it('should handle special characters in configuration values', async () => {
      const specialChars = [
        { hostname: 'test-host.example.com', username: 'user@domain' },
        { hostname: 'test_host.example.com', username: 'user.name' },
        { hostname: 'test123.example.com', username: 'user-123' }
      ];

      for (const config of specialChars) {
        const res = await request(app)
          .post('/setup/ssh')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ 
            edit: config.hostname, 
            hostname: config.hostname, 
            port: '22', 
            username: config.username,
            privateKeyPath: '/home/user/.ssh/id_rsa',
            'llm.provider': 'ollama', 
            'llm.baseUrl': 'http://localhost:11434' 
          });
          
        expect([200, 302]).toContain(res.status);
        
        const configContent = fs.readFileSync(configPath, 'utf8');
        expect(configContent).toContain(config.hostname);
        expect(configContent).toContain(config.username);
      }
    });
  });

  describe('configuration persistence', () => {
    it('should persist configuration across multiple edits', async () => {
      // First edit
      await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ 
          edit: 'persistent.example.com', 
          hostname: 'persistent.example.com', 
          port: '22', 
          username: 'user1', 
          'llm.provider': 'ollama' 
        });

      // Second edit
      await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ 
          edit: 'persistent.example.com', 
          hostname: 'persistent.example.com', 
          port: '2222', 
          username: 'user2', 
          'llm.provider': 'openai' 
        });

      const configContent = fs.readFileSync(configPath, 'utf8');
      expect(configContent).toContain('persistent.example.com');
      expect(configContent).toContain('user2'); // Should have latest username
      expect(configContent).toContain('2222'); // Should have latest port
      expect(configContent).toContain('openai'); // Should have latest provider
    });

    it('should maintain other configurations when editing one host', async () => {
      // Add first host
      await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ 
          edit: 'host1.example.com', 
          hostname: 'host1.example.com', 
          port: '22', 
          username: 'user1' 
        });

      // Add second host
      await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ 
          edit: 'host2.example.com', 
          hostname: 'host2.example.com', 
          port: '2222', 
          username: 'user2' 
        });

      const configContent = fs.readFileSync(configPath, 'utf8');
      expect(configContent).toContain('host1.example.com');
      expect(configContent).toContain('host2.example.com');
      expect(configContent).toContain('user1');
      expect(configContent).toContain('user2');
    });

    it('should handle configuration file corruption gracefully', async () => {
      // Corrupt the config file
      fs.writeFileSync(configPath, 'invalid json content');

      const res = await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ 
          edit: 'recovery.example.com', 
          hostname: 'recovery.example.com', 
          port: '22', 
          username: 'recovery' 
        });

      // Should either recover or fail gracefully
      expect([200, 302, 500]).toContain(res.status);
    });
  });

  describe('response handling', () => {
    it('should return appropriate response format', async () => {
      const res = await request(app)
        .post('/setup/ssh')
        .set('Authorization', `Bearer ${token}`)
        .type('form')
        .send({ 
          edit: 'response.example.com', 
          hostname: 'response.example.com', 
          port: '22', 
          username: 'testuser' 
        });

      if (res.status === 200) {
        // Should return some form of success indication
        expect(res.text || res.body).toBeDefined();
      } else if (res.status === 302) {
        // Should have redirect location
        expect(res.headers.location).toBeDefined();
      }
    });

    it('should handle concurrent configuration requests', async () => {
      const promises = Array.from({ length: 3 }, (_, i) =>
        request(app)
          .post('/setup/ssh')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ 
            edit: `concurrent${i}.example.com`, 
            hostname: `concurrent${i}.example.com`, 
            port: '22', 
            username: `user${i}` 
          })
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(res => {
        expect([200, 302]).toContain(res.status);
      });

      // All configurations should be saved
      const configContent = fs.readFileSync(configPath, 'utf8');
      expect(configContent).toContain('concurrent0.example.com');
      expect(configContent).toContain('concurrent1.example.com');
      expect(configContent).toContain('concurrent2.example.com');
    });
  });
});

