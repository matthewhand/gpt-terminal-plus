import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chat to ensure deterministic aiAnalysis
jest.mock('../src/llm', () => ({
  chat: async (messages: any[], options: any) => ({
    model: 'gpt-oss:20b',
    provider: 'ollama',
    choices: [{
      index: 0,
      message: {
        role: 'assistant',
        content: `Mock analysis for ${options?.context || 'code execution'}: The error appears to be related to exit code handling.`
      }
    }]
  })
}));

describe('execute-code error analysis', () => {
  let app: express.Express;
  let token: string;
  let originalEnv: string | undefined;
  let originalConfigDir: string | undefined;
  let originalAutoAnalyze: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
    originalConfigDir = process.env.NODE_CONFIG_DIR;
    originalAutoAnalyze = process.env.AUTO_ANALYZE_ERRORS;
    
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    process.env.AUTO_ANALYZE_ERRORS = 'true';
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
    
    if (originalAutoAnalyze !== undefined) {
      process.env.AUTO_ANALYZE_ERRORS = originalAutoAnalyze;
    } else {
      delete process.env.AUTO_ANALYZE_ERRORS;
    }
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  describe('basic error analysis functionality', () => {
    it('should attach aiAnalysis on non-zero exit for bash code', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'exit 9', language: 'bash' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(9);
      expect(res.body.result.success).toBe(false);
      expect(res.body.aiAnalysis).toBeDefined();
      expect(res.body.aiAnalysis.text).toContain('Mock analysis');
      expect(res.body.aiAnalysis.text).toContain('exit code');
    });

    it('should not attach aiAnalysis on successful execution', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'echo "success"', language: 'bash' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(0);
      expect(res.body.result.success).toBe(true);
      expect(res.body.aiAnalysis).toBeUndefined();
    });

    it('should handle different programming languages', async () => {
      const testCases = [
        { code: 'import sys; sys.exit(1)', language: 'python' },
        { code: 'process.exit(1)', language: 'javascript' },
        { code: 'exit 1', language: 'bash' },
        { code: 'exit(1)', language: 'sh' }
      ];

      for (const { code, language } of testCases) {
        const res = await request(app)
          .post('/command/execute-code')
          .set('Authorization', `Bearer ${token}`)
          .send({ code, language });

        expect(res.status).toBe(200);
        expect(res.body.result.exitCode).not.toBe(0);
        expect(res.body.aiAnalysis).toBeDefined();
        expect(res.body.aiAnalysis.text).toContain('Mock analysis');
      }
    });
  });

  describe('error analysis with different error types', () => {
    it('should analyze syntax errors', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: 'echo "unclosed quote', 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
      expect(res.body.aiAnalysis).toBeDefined();
    });

    it('should analyze runtime errors', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: 'nonexistent_command_that_should_fail', 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).not.toBe(0);
      expect(res.body.aiAnalysis).toBeDefined();
    });

    it('should analyze permission errors', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: 'cat /etc/shadow', 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      // May or may not fail depending on system, but if it fails, should have analysis
      if (res.body.result.exitCode !== 0) {
        expect(res.body.aiAnalysis).toBeDefined();
      }
    });

    it('should analyze timeout errors', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: 'sleep 1 && exit 1', 
          language: 'bash',
          timeout: 500 // Short timeout to potentially trigger timeout
        });

      expect(res.status).toBe(200);
      // If execution fails (timeout or exit), should have analysis
      if (res.body.result.exitCode !== 0 || res.body.result.timedOut) {
        expect(res.body.aiAnalysis).toBeDefined();
      }
    });
  });

  describe('error analysis configuration', () => {
    it('should respect AUTO_ANALYZE_ERRORS=false', async () => {
      process.env.AUTO_ANALYZE_ERRORS = 'false';
      
      // Recreate app with new environment
      app = express();
      app.use(express.json());
      setupApiRouter(app);

      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'exit 1', language: 'bash' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(1);
      expect(res.body.aiAnalysis).toBeUndefined();
      
      // Restore for other tests
      process.env.AUTO_ANALYZE_ERRORS = 'true';
    });

    it('should handle missing AUTO_ANALYZE_ERRORS environment variable', async () => {
      delete process.env.AUTO_ANALYZE_ERRORS;
      
      // Recreate app with new environment
      app = express();
      app.use(express.json());
      setupApiRouter(app);

      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'exit 1', language: 'bash' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(1);
      // Should default to no analysis or handle gracefully
      
      // Restore for other tests
      process.env.AUTO_ANALYZE_ERRORS = 'true';
    });
  });

  describe('error analysis content quality', () => {
    it('should provide meaningful analysis content', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: 'echo "Error occurred"; exit 42', 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(42);
      expect(res.body.aiAnalysis).toBeDefined();
      expect(typeof res.body.aiAnalysis).toBe('object');
      expect(res.body.aiAnalysis.text).toBeDefined();
      expect(res.body.aiAnalysis.text.length).toBeGreaterThan(10);
    });

    it('should handle complex error scenarios', async () => {
      const complexCode = `
        echo "Starting complex operation"
        if [ ! -f "/nonexistent/file" ]; then
          echo "File not found" >&2
          exit 2
        fi
        echo "This should not execute"
      `;

      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: complexCode, 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(2);
      expect(res.body.aiAnalysis).toBeDefined();
      expect(res.body.result.stderr).toContain('File not found');
    });

    it('should analyze errors with both stdout and stderr', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: 'echo "stdout message"; echo "stderr message" >&2; exit 1', 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(1);
      expect(res.body.result.stdout).toContain('stdout message');
      expect(res.body.result.stderr).toContain('stderr message');
      expect(res.body.aiAnalysis).toBeDefined();
    });
  });

  describe('error analysis performance', () => {
    it('should complete analysis within reasonable time', async () => {
      const startTime = Date.now();
      
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'exit 1', language: 'bash' });

      const endTime = Date.now();
      
      expect(res.status).toBe(200);
      expect(res.body.aiAnalysis).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle multiple concurrent error analyses', async () => {
      const promises = Array.from({ length: 3 }, (_, i) =>
        request(app)
          .post('/command/execute-code')
          .set('Authorization', `Bearer ${token}`)
          .send({ 
            code: `echo "Error ${i}"; exit ${i + 1}`, 
            language: 'bash' 
          })
      );

      const responses = await Promise.all(promises);
      
      responses.forEach((res, index) => {
        expect(res.status).toBe(200);
        expect(res.body.result.exitCode).toBe(index + 1);
        expect(res.body.aiAnalysis).toBeDefined();
      });
    });
  });

  describe('error analysis edge cases', () => {
    it('should handle empty code with error', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: '', language: 'bash' });

      // Empty code might be rejected or might execute successfully
      expect(res.status).toBe(200);
      if (res.body.result && res.body.result.exitCode !== 0) {
        expect(res.body.aiAnalysis).toBeDefined();
      }
    });

    it('should handle very long error output', async () => {
      const longErrorCode = `
        for i in {1..100}; do
          echo "Error line $i" >&2
        done
        exit 1
      `;

      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: longErrorCode, 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(1);
      expect(res.body.aiAnalysis).toBeDefined();
      expect(res.body.result.stderr.length).toBeGreaterThan(100);
    });

    it('should handle special characters in error output', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: 'echo "Error with special chars: $@#%^&*()"; exit 1', 
          language: 'bash' 
        });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(1);
      expect(res.body.aiAnalysis).toBeDefined();
      expect(res.body.result.stdout).toContain('special chars');
    });
  });

  describe('integration with other features', () => {
    it('should work with authentication', async () => {
      // Test with token (auth is not enforced in test mode)
      const resWithAuth = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'exit 1', language: 'bash' });

      expect(resWithAuth.status).toBe(200);
      expect(resWithAuth.body.aiAnalysis).toBeDefined();
    });

    it('should work with different content types', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ 
          code: 'exit 1', 
          language: 'bash' 
        }));

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(1);
      expect(res.body.aiAnalysis).toBeDefined();
    });

    it('should handle malformed requests gracefully', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          code: 'exit 1'
          // Missing language parameter
        });

      // Should either succeed with defaults or fail gracefully
      expect([200, 400]).toContain(res.status);
    });
  });
});

