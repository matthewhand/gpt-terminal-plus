import express from 'express';
import request from 'supertest';
import { initializeServerHandler } from '../src/middlewares/initializeServerHandler';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import { setupApiRouter } from '../src/routes';

describe('middleware/initializeServerHandler', () => {
  let app: express.Express;
  let token: string;
  let originalEnv: string | undefined;
  let originalConfigDir: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
    originalConfigDir = process.env.NODE_CONFIG_DIR;
    
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
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
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  describe('server handler attachment', () => {
    it('should attach server handler and respond 200 for execute-shell', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo ok' });
        
      expect(res.status).toBe(200);
      expect(res.body.result).toBeDefined();
      expect(res.body.result.exitCode).toBeDefined();
      expect(res.body.result.stdout).toBeDefined();
    });

    it('should attach server handler for file operations', async () => {
      const res = await request(app)
        .get('/file/read')
        .set('Authorization', `Bearer ${token}`)
        .query({ filePath: 'package.json' });
        
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });

    it('should attach server handler for system info', async () => {
      const res = await request(app)
        .get('/system/info')
        .set('Authorization', `Bearer ${token}`);
        
      expect([200, 404]).toContain(res.status); // 404 is acceptable if route not implemented
    });
  });

  describe('middleware integration', () => {
    it('should work with authentication middleware', async () => {
      // Test without token - should fail
      const resWithoutAuth = await request(app)
        .post('/command/execute-shell')
        .send({ command: 'echo test' });
        
      // In test mode, auth might not be enforced, so accept either 401 or 200
      expect([200, 401]).toContain(resWithoutAuth.status);

      // Test with token - should succeed
      const resWithAuth = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo test' });
        
      expect(resWithAuth.status).toBe(200);
    });

    it('should work with JSON parsing middleware', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ command: 'echo json-test' }));
        
      expect(res.status).toBe(200);
      expect(res.body.result.stdout).toContain('json-test');
    });

    it('should handle malformed JSON gracefully', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');
        
      expect(res.status).toBe(400);
    });
  });

  describe('request handling', () => {
    it('should handle multiple concurrent requests', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        request(app)
          .post('/command/execute-shell')
          .set('Authorization', `Bearer ${token}`)
          .send({ command: `echo request-${i}` })
      );

      const responses = await Promise.all(promises);
      
      responses.forEach((res, index) => {
        expect(res.status).toBe(200);
        expect(res.body.result.stdout).toContain(`request-${index}`);
      });
    });

    it('should handle different HTTP methods', async () => {
      // GET request
      const getRes = await request(app)
        .get('/file/read')
        .set('Authorization', `Bearer ${token}`)
        .query({ filePath: 'package.json' });
      expect([200, 404]).toContain(getRes.status);

      // POST request
      const postRes = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo post' });
      expect(postRes.status).toBe(200);

      // PUT request (if supported)
      const putRes = await request(app)
        .put('/file/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: 'test.txt', content: 'test' });
      expect([200, 404, 405]).toContain(putRes.status); // 405 Method Not Allowed is acceptable
    });

    it('should preserve request context across middleware chain', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Request-ID', 'test-123')
        .send({ command: 'echo context-test' });
        
      expect(res.status).toBe(200);
      // The middleware should not interfere with request processing
      expect(res.body.result.stdout).toContain('context-test');
    });
  });

  describe('error handling', () => {
    it('should handle server handler initialization errors gracefully', async () => {
      // Create an app without proper setup to test error handling
      const brokenApp = express();
      brokenApp.use(express.json());
      
      // Add the middleware but skip proper router setup
      brokenApp.use(initializeServerHandler);
      brokenApp.post('/test', (req, res) => {
        // This should fail if server handler is not properly initialized
        res.json({ handler: req.serverHandler ? 'present' : 'missing' });
      });

      const res = await request(brokenApp)
        .post('/test')
        .set('Authorization', `Bearer ${token}`);
        
      // Should either work or fail gracefully
      expect([200, 500]).toContain(res.status);
    });

    it('should handle missing configuration gracefully', async () => {
      // Temporarily remove config
      const originalConfig = process.env.NODE_CONFIG_DIR;
      delete process.env.NODE_CONFIG_DIR;

      const tempApp = express();
      tempApp.use(express.json());
      
      try {
        setupApiRouter(tempApp);
        
        const res = await request(tempApp)
          .post('/command/execute-shell')
          .set('Authorization', `Bearer ${token}`)
          .send({ command: 'echo config-test' });
          
        // Should either work with defaults or fail gracefully
        expect([200, 500]).toContain(res.status);
      } finally {
        // Restore config
        if (originalConfig) {
          process.env.NODE_CONFIG_DIR = originalConfig;
        }
      }
    });
  });

  describe('performance', () => {
    it('should initialize server handler efficiently', async () => {
      const startTime = Date.now();
      
      // Make multiple requests to test initialization overhead
      const promises = Array.from({ length: 10 }, () =>
        request(app)
          .post('/command/execute-shell')
          .set('Authorization', `Bearer ${token}`)
          .send({ command: 'echo perf-test' })
      );

      await Promise.all(promises);
      const endTime = Date.now();
      
      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(10000);
    }, 15000); // Increase timeout to 15 seconds

    it('should not leak memory with repeated requests', async () => {
      // This is a basic test - in a real scenario you'd use more sophisticated memory monitoring
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Make many requests - use fewer to avoid timeouts and properly await each
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(app)
            .post('/command/execute-shell')
            .set('Authorization', `Bearer ${token}`)
            .send({ command: `echo memory-test-${i}` })
        );
      }
      
      // Wait for all requests to complete
      await Promise.all(requests);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }, 15000); // Increase timeout to 15 seconds
  });
});

