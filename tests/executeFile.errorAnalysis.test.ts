import request from 'supertest';
import express, { Router } from 'express';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';
import * as routesMod from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  } else {
    const router = Router();
    const setup = anyRoutes.setupRoutes || anyRoutes.default;
    if (typeof setup === 'function') setup(router);
    app.use('/', router);
  }
  return app;
}

describe('execute-file endpoint deprecation and removal', () => {
  let app: express.Express;
  let token: string;
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    token = getOrGenerateApiToken();
  });

  afterAll(() => {
    if (originalEnv !== undefined) {
      process.env.NODE_ENV = originalEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  });

  beforeEach(() => {
    app = makeApp();
  });

  describe('endpoint removal verification', () => {
    it('should reject requests to removed execute-file endpoint', async () => {
      const res = await request(app)
        .post('/command/execute-file')
        .set('Authorization', `Bearer ${token}`)
        .send({ filename: 'script.sh' });

      expect([404, 400, 405]).toContain(res.status);
    });

    it('should reject different HTTP methods on execute-file endpoint', async () => {
      const methods = ['get', 'put', 'delete', 'patch'] as const;
      
      for (const method of methods) {
        const res = await request(app)[method]('/command/execute-file')
          .set('Authorization', `Bearer ${token}`)
          .send({ filename: 'script.sh' });

        expect([404, 405, 501]).toContain(res.status);
      }
    });

    it('should reject execute-file requests with various payloads', async () => {
      const payloads = [
        { filename: 'script.sh' },
        { filename: 'test.py', args: ['arg1', 'arg2'] },
        { filename: '/path/to/script.sh', timeout: 5000 },
        { filename: 'script.js', env: { NODE_ENV: 'test' } },
        {} // Empty payload
      ];

      for (const payload of payloads) {
        const res = await request(app)
          .post('/command/execute-file')
          .set('Authorization', `Bearer ${token}`)
          .send(payload);

        expect([404, 400, 405]).toContain(res.status);
      }
    });
  });

  describe('alternative endpoint availability', () => {
    it('should confirm execute-code endpoint is available as alternative', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: 'echo "test"', 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result).toBeDefined();
    });

    it('should confirm execute-shell endpoint is available as alternative', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          command: 'echo test' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result).toBeDefined();
    });

    it('should demonstrate file execution via execute-code', async () => {
      // Simulate what execute-file used to do via execute-code
      const scriptContent = `#!/bin/bash
echo "Script executed successfully"
echo "Current directory: $(pwd)"
echo "Arguments: $@"`;

      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: scriptContent, 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.stdout).toContain('Script executed successfully');
      expect(res.body.result.exitCode).toBe(0);
    });
  });

  describe('error response format consistency', () => {
    it('should return consistent error format for removed endpoint', async () => {
      const res = await request(app)
        .post('/command/execute-file')
        .set('Authorization', `Bearer ${token}`)
        .send({ filename: 'script.sh' });

      expect([404, 400, 405]).toContain(res.status);
      
      if (res.body) {
        // If there's a response body, it should be properly formatted
        expect(typeof res.body).toBe('object');
        
        // Common error response patterns
        const hasErrorField = 'error' in res.body;
        const hasMessageField = 'message' in res.body;
        const hasStatusField = 'status' in res.body;
        
        expect(hasErrorField || hasMessageField || hasStatusField).toBe(true);
      }
    });

    it('should handle authentication properly even for removed endpoint', async () => {
      // Test without authentication
      const resWithoutAuth = await request(app)
        .post('/command/execute-file')
        .send({ filename: 'script.sh' });

      expect([401, 404]).toContain(resWithoutAuth.status);

      // Test with invalid token
      const resWithInvalidAuth = await request(app)
        .post('/command/execute-file')
        .set('Authorization', 'Bearer invalid-token')
        .send({ filename: 'script.sh' });

      expect([401, 403, 404]).toContain(resWithInvalidAuth.status);
    });
  });

  describe('security considerations', () => {
    it('should not expose system information in error responses', async () => {
      const res = await request(app)
        .post('/command/execute-file')
        .set('Authorization', `Bearer ${token}`)
        .send({ filename: '../../../etc/passwd' });

      expect([404, 400, 405]).toContain(res.status);
      
      if (res.body && typeof res.body === 'object') {
        const responseText = JSON.stringify(res.body).toLowerCase();
        
        // Should not expose sensitive paths or system info
        expect(responseText).not.toContain('/etc/passwd');
        expect(responseText).not.toContain('root:');
        expect(responseText).not.toContain('system');
      }
    });

    it('should handle malicious filenames safely', async () => {
      const maliciousFilenames = [
        '../../../etc/passwd',
        '$(rm -rf /)',
        '; cat /etc/shadow',
        '`whoami`',
        '${HOME}/.ssh/id_rsa',
        'file with spaces.sh',
        'file"with"quotes.sh',
        "file'with'quotes.sh"
      ];

      for (const filename of maliciousFilenames) {
        const res = await request(app)
          .post('/command/execute-file')
          .set('Authorization', `Bearer ${token}`)
          .send({ filename });

        expect([404, 400, 405]).toContain(res.status);
        
        // Should not execute or process the malicious content
        if (res.body) {
          const responseText = JSON.stringify(res.body);
          expect(responseText).not.toContain('root:');
          expect(responseText).not.toContain('BEGIN RSA PRIVATE KEY');
        }
      }
    });
  });

  describe('migration guidance', () => {
    it('should demonstrate equivalent functionality with execute-code', async () => {
      // Show how to achieve file execution through execute-code
      const testCases = [
        {
          description: 'Simple shell script',
          code: 'echo "Hello from shell script"',
          language: 'bash'
        },
        {
          description: 'Python script',
          code: 'print("Hello from Python script")',
          language: 'python'
        },
        {
          description: 'JavaScript/Node script',
          code: 'console.log("Hello from Node script");',
          language: 'javascript'
        }
      ];

      for (const testCase of testCases) {
        const res = await request(app)
          .post('/command/execute-code')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            code: testCase.code, 
            language: testCase.language 
          });

        expect(res.status).toBe(200);
        expect(res.body.result.stdout).toContain('Hello from');
        expect(res.body.result.exitCode).toBe(0);
      }
    });

    it('should demonstrate file reading and execution pattern', async () => {
      // Demonstrate how to read a file and execute its contents
      const readAndExecutePattern = `
        if [ -f "package.json" ]; then
          echo "File exists and can be read"
          head -5 package.json
        else
          echo "File not found or not accessible"
        fi
      `;

      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: readAndExecutePattern, 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.stdout).toContain('File');
    });
  });

  describe('documentation and discoverability', () => {
    it('should verify available endpoints are discoverable', async () => {
      // Test that the main command endpoints are available
      const availableEndpoints = [
        '/command/execute-code',
        '/command/execute-shell',
        '/command/execute-llm'
      ];

      for (const endpoint of availableEndpoints) {
        const res = await request(app)
          .post(endpoint)
          .set('Authorization', `Bearer ${token}`)
          .send({}); // Empty payload to test endpoint existence

        // Should not return 404 (endpoint exists)
        expect(res.status).not.toBe(404);
        // May return 400 for bad request, which is fine
        expect([200, 400, 422]).toContain(res.status);
      }
    });

    it('should handle OPTIONS requests for CORS preflight', async () => {
      const res = await request(app)
        .options('/command/execute-file')
        .set('Origin', 'http://localhost:3000');

      // Should handle OPTIONS even for removed endpoints
      expect([200, 204, 404, 405]).toContain(res.status);
    });
  });

  describe('performance and reliability', () => {
    it('should respond quickly to requests for removed endpoint', async () => {
      const startTime = Date.now();
      
      const res = await request(app)
        .post('/command/execute-file')
        .set('Authorization', `Bearer ${token}`)
        .send({ filename: 'test.sh' });

      const endTime = Date.now();
      
      expect([404, 400, 405]).toContain(res.status);
      expect(endTime - startTime).toBeLessThan(1000); // Should respond quickly
    });

    it('should handle multiple concurrent requests to removed endpoint', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        request(app)
          .post('/command/execute-file')
          .set('Authorization', `Bearer ${token}`)
          .send({ filename: `script${i}.sh` })
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(res => {
        expect([404, 400, 405]).toContain(res.status);
      });
    });
  });
});
