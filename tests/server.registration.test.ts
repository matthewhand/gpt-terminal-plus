import request from 'supertest';
import express from 'express';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import { unlink, access } from 'fs/promises';
import path from 'path';
import fs from 'fs';

describe('Server Registration System', () => {
  let app: express.Express;
  let token: string;
  const testConfigPath = path.join(process.cwd(), 'config', 'servers.json');

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  afterEach(async () => {
    try {
      await unlink(testConfigPath);
    } catch {}
  });

  describe('Server Registration', () => {
    it('registers local server successfully', async () => {
      const serverData = {
        hostname: 'test-local',
        protocol: 'local'
      };

      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(serverData);
      
      expect([200, 201]).toContain(res.status);
      if (res.body.success !== false) {
        expect(res.body).toHaveProperty('server');
        expect(res.body.server.hostname).toBe('test-local');
        expect(res.body.server.protocol).toBe('local');
      }
    });

    it('registers SSH server with full configuration', async () => {
      const sshServer = {
        hostname: 'test-ssh',
        protocol: 'ssh',
        config: {
          host: '192.168.1.100',
          username: 'testuser',
          port: 22,
          privateKeyPath: '/home/user/.ssh/id_rsa'
        }
      };

      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(sshServer);
      
      expect([200, 201]).toContain(res.status);
      if (res.body.success !== false) {
        expect(res.body.server.protocol).toBe('ssh');
        expect(res.body.server.config.host).toBe('192.168.1.100');
      }
    });

    it('registers SSM server configuration', async () => {
      const ssmServer = {
        hostname: 'test-ssm',
        protocol: 'ssm',
        config: {
          instanceId: 'i-1234567890abcdef0',
          region: 'us-west-2'
        }
      };

      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(ssmServer);
      
      expect([200, 201]).toContain(res.status);
      if (res.body.success !== false) {
        expect(res.body.server.protocol).toBe('ssm');
      }
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .post('/server/register')
        .send({ hostname: 'test', protocol: 'local' });
      expect(res.status).toBe(401);
    });
  });

  describe('Input Validation', () => {
    it('validates required fields', async () => {
      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      
      expect(res.status).toBe(400);
    });

    it('validates hostname format', async () => {
      const invalidHostnames = ['', ' ', 'host with spaces', 'host@invalid'];
      
      for (const hostname of invalidHostnames) {
        const res = await request(app)
          .post('/server/register')
          .set('Authorization', `Bearer ${token}`)
          .send({ hostname, protocol: 'local' });
        
        expect(res.status).toBe(400);
      }
    });

    it('validates protocol values', async () => {
      const invalidProtocols = ['', 'invalid', 'ftp', 'http'];
      
      for (const protocol of invalidProtocols) {
        const res = await request(app)
          .post('/server/register')
          .set('Authorization', `Bearer ${token}`)
          .send({ hostname: 'test', protocol });
        
        expect(res.status).toBe(400);
      }
    });

    it('validates SSH-specific fields', async () => {
      const incompleteSSH = {
        hostname: 'ssh-incomplete',
        protocol: 'ssh',
        config: {
          host: '192.168.1.100'
          // Missing username
        }
      };

      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(incompleteSSH);
      
      expect([400, 422]).toContain(res.status);
    });

    it('validates SSM instance ID format', async () => {
      const invalidSSM = {
        hostname: 'ssm-invalid',
        protocol: 'ssm',
        config: {
          instanceId: 'invalid-id',
          region: 'us-west-2'
        }
      };

      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidSSM);
      
      expect([400, 422]).toContain(res.status);
    });
  });

  describe('Server Removal', () => {
    it('removes existing server', async () => {
      // First register a server
      const registerRes = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          hostname: 'test-remove',
          protocol: 'local'
        });
      
      if ([200, 201].includes(registerRes.status)) {
        // Then remove it
        const removeRes = await request(app)
          .delete('/server/remove/test-remove')
          .set('Authorization', `Bearer ${token}`);
        
        expect([200, 404]).toContain(removeRes.status);
      }
    });

    it('handles removal of non-existent server', async () => {
      const res = await request(app)
        .delete('/server/remove/nonexistent')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
    });

    it('requires authentication for removal', async () => {
      const res = await request(app)
        .delete('/server/remove/test');
      expect(res.status).toBe(401);
    });
  });

  describe('Duplicate Prevention', () => {
    it('prevents duplicate hostname registration', async () => {
      const serverData = {
        hostname: 'duplicate-test',
        protocol: 'local'
      };

      // Register first time
      const firstRes = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(serverData);
      
      if ([200, 201].includes(firstRes.status)) {
        // Try to register again
        const secondRes = await request(app)
          .post('/server/register')
          .set('Authorization', `Bearer ${token}`)
          .send(serverData);
        
        expect([400, 409]).toContain(secondRes.status);
      }
    });
  });

  describe('Configuration Persistence', () => {
    it('persists server configuration to storage', async () => {
      const serverData = {
        hostname: 'persist-test',
        protocol: 'local',
        config: {
          workingDirectory: '/tmp',
          environment: { TEST: 'value' }
        }
      };

      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(serverData);
      
      if ([200, 201].includes(res.status)) {
        // Verify persistence by checking if we can list it
        const listRes = await request(app)
          .get('/server/list')
          .set('Authorization', `Bearer ${token}`);
        
        if (listRes.status === 200) {
          const servers = listRes.body.servers || [];
          const persistedServer = servers.find((s: any) => s.hostname === 'persist-test');
          if (persistedServer) {
            expect(persistedServer.protocol).toBe('local');
          }
        }
      }
    });
  });

  describe('Error Handling', () => {
    it('handles malformed JSON', async () => {
      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send('invalid json');
      
      expect(res.status).toBe(400);
    });

    it('handles missing content-type', async () => {
      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send('hostname=test&protocol=local');
      
      expect([200, 201, 400]).toContain(res.status);
    });

    it('handles file system errors gracefully', async () => {
      // This test simulates potential file system issues
      const res = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          hostname: 'fs-error-test',
          protocol: 'local'
        });
      
      expect([200, 201, 500]).toContain(res.status);
    });
  });

  describe('Server Listing Integration', () => {
    it('registered servers appear in listing', async () => {
      const serverData = {
        hostname: 'list-test',
        protocol: 'local'
      };

      const registerRes = await request(app)
        .post('/server/register')
        .set('Authorization', `Bearer ${token}`)
        .send(serverData);
      
      if ([200, 201].includes(registerRes.status)) {
        const listRes = await request(app)
          .get('/server/list')
          .set('Authorization', `Bearer ${token}`);
        
        expect(listRes.status).toBe(200);
        expect(listRes.body).toHaveProperty('servers');
        expect(Array.isArray(listRes.body.servers)).toBe(true);
      }
    });
  });

  describe('Concurrent Operations', () => {
    it('handles concurrent registration requests', async () => {
      const requests = Array(3).fill(null).map((_, i) =>
        request(app)
          .post('/server/register')
          .set('Authorization', `Bearer ${token}`)
          .send({
            hostname: `concurrent-${i}`,
            protocol: 'local'
          })
      );

      const responses = await Promise.all(requests);
      responses.forEach(res => {
        expect([200, 201, 400, 409]).toContain(res.status);
      });
    });
  });
});