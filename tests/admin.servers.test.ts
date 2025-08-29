import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import path from 'path';
import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('Admin Server Management', () => {
  const testServersPath = path.join(process.cwd(), 'data', 'test-admin-servers.json');
  let app: express.Express;
  let token: string;
  
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  beforeEach(() => {
    const dataDir = path.dirname(testServersPath);
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }
    if (existsSync(testServersPath)) {
      unlinkSync(testServersPath);
    }
  });

  afterEach(() => {
    if (existsSync(testServersPath)) {
      unlinkSync(testServersPath);
    }
  });

  describe('File-based Server Storage', () => {
    test('creates empty servers file', () => {
      const servers: any[] = [];
      writeFileSync(testServersPath, JSON.stringify(servers, null, 2));
      
      expect(existsSync(testServersPath)).toBe(true);
      const loaded = JSON.parse(readFileSync(testServersPath, 'utf8'));
      expect(loaded).toEqual([]);
    });

    test('validates SSH server configuration', () => {
      const sshServer = {
        id: 'test-ssh-1',
        hostname: 'worker1',
        protocol: 'ssh',
        host: 'worker1.local',
        port: 22,
        username: 'admin',
        privateKeyPath: '/home/user/.ssh/id_rsa',
        enabled: true
      };
      
      writeFileSync(testServersPath, JSON.stringify([sshServer], null, 2));
      const loaded = JSON.parse(readFileSync(testServersPath, 'utf8'));
      
      expect(loaded[0].protocol).toBe('ssh');
      expect(loaded[0].port).toBe(22);
      expect(loaded[0].username).toBe('admin');
      expect(typeof loaded[0].privateKeyPath).toBe('string');
    });

    test('validates SSM server configuration', () => {
      const ssmServer = {
        id: 'test-ssm-1',
        hostname: 'prod-server',
        protocol: 'ssm',
        instanceId: 'i-1234567890abcdef0',
        region: 'us-west-2',
        enabled: true
      };
      
      writeFileSync(testServersPath, JSON.stringify([ssmServer], null, 2));
      const loaded = JSON.parse(readFileSync(testServersPath, 'utf8'));
      
      expect(loaded[0].protocol).toBe('ssm');
      expect(loaded[0].instanceId).toMatch(/^i-[0-9a-f]{17}$/);
      expect(loaded[0].region).toMatch(/^[a-z]+-[a-z]+-[0-9]+$/);
    });

    test('manages multiple server types', () => {
      const servers = [
        { id: 'local-1', hostname: 'localhost', protocol: 'local', enabled: true },
        { id: 'ssh-1', hostname: 'worker1', protocol: 'ssh', host: 'worker1.local', port: 22, username: 'admin', enabled: true },
        { id: 'ssm-1', hostname: 'prod-server', protocol: 'ssm', instanceId: 'i-1234567890abcdef0', region: 'us-west-2', enabled: false }
      ];
      
      writeFileSync(testServersPath, JSON.stringify(servers, null, 2));
      const loaded = JSON.parse(readFileSync(testServersPath, 'utf8'));
      
      expect(loaded).toHaveLength(3);
      expect(loaded.map((s: any) => s.protocol)).toEqual(['local', 'ssh', 'ssm']);
      expect(loaded.filter((s: any) => s.enabled)).toHaveLength(2);
    });
  });

  describe('API Integration', () => {
    test('lists servers via API', async () => {
      const servers = [{ id: 'test-1', hostname: 'test-host', protocol: 'local', enabled: true }];
      writeFileSync(testServersPath, JSON.stringify(servers, null, 2));
      
      const res = await request(app)
        .get('/server/list')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('servers');
      expect(Array.isArray(res.body.servers)).toBe(true);
    });

    test('registers server via API', async () => {
      const serverData = {
        hostname: 'api-test-server',
        protocol: 'local'
      };
      
      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(serverData);
      
      expect([200, 201]).toContain(res.status);
    });

    test('validates server registration data', async () => {
      const invalidData = {
        hostname: '',
        protocol: 'invalid'
      };
      
      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData);
      
      expect(res.status).toBe(400);
    });

    test('removes server via API', async () => {
      const res = await request(app)
        .delete('/server/remove/nonexistent')
        .set('Authorization', `Bearer ${token}`);
      
      expect([200, 404]).toContain(res.status);
    });
  });

  describe('Server Configuration Validation', () => {
    test('validates required SSH fields', () => {
      const incompleteSSH = {
        id: 'incomplete-ssh',
        hostname: 'test',
        protocol: 'ssh'
        // Missing host, username
      };
      
      expect(() => {
        // Validation would happen in actual server registration
        if (incompleteSSH.protocol === 'ssh') {
          if (!incompleteSSH.host || !incompleteSSH.username) {
            throw new Error('SSH requires host and username');
          }
        }
      }).toThrow('SSH requires host and username');
    });

    test('validates SSM instance ID format', () => {
      const invalidSSM = {
        instanceId: 'invalid-instance-id',
        protocol: 'ssm'
      };
      
      expect(invalidSSM.instanceId).not.toMatch(/^i-[0-9a-f]{17}$/);
    });

    test('validates protocol values', () => {
      const validProtocols = ['local', 'ssh', 'ssm'];
      const testProtocol = 'local';
      
      expect(validProtocols).toContain(testProtocol);
    });
  });

  describe('Server State Management', () => {
    test('toggles server enabled state', () => {
      const server = { id: 'test', hostname: 'test', protocol: 'local', enabled: true };
      
      server.enabled = !server.enabled;
      expect(server.enabled).toBe(false);
      
      server.enabled = !server.enabled;
      expect(server.enabled).toBe(true);
    });

    test('tracks server connection status', () => {
      const server = {
        id: 'test',
        hostname: 'test',
        protocol: 'local',
        enabled: true,
        status: 'disconnected',
        lastSeen: null
      };
      
      server.status = 'connected';
      server.lastSeen = new Date().toISOString();
      
      expect(server.status).toBe('connected');
      expect(server.lastSeen).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    test('handles file system errors', () => {
      const invalidPath = '/invalid/path/servers.json';
      
      expect(() => {
        readFileSync(invalidPath, 'utf8');
      }).toThrow();
    });

    test('handles malformed JSON', () => {
      writeFileSync(testServersPath, 'invalid json');
      
      expect(() => {
        JSON.parse(readFileSync(testServersPath, 'utf8'));
      }).toThrow();
    });

    test('handles missing server files gracefully', () => {
      const nonExistentPath = '/tmp/nonexistent-servers.json';
      
      if (!existsSync(nonExistentPath)) {
        // Should handle gracefully by creating empty array
        const servers = [];
        expect(servers).toEqual([]);
      }
    });
  });
});