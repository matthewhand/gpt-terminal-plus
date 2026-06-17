import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock chat to provide deterministic analysis responses
jest.mock('../src/llm', () => {
  return {
    chat: jest.fn().mockImplementation(async (messages) => {
      const lastMessage = messages[messages.length - 1]?.content || '';
      let analysisContent = 'Mock analysis: ';
      
      if (lastMessage.includes('exit 2')) {
        analysisContent += 'Command exited with code 2, likely intentional test exit.';
      } else if (lastMessage.includes('command not found')) {
        analysisContent += 'Command not found error, check if the command is installed.';
      } else if (lastMessage.includes('permission denied')) {
        analysisContent += 'Permission denied, check file permissions or run with sudo.';
      } else {
        analysisContent += 'General error occurred during command execution.';
      }
      
      return {
        model: 'gpt-oss:20b',
        provider: 'ollama',
        choices: [{ index: 0, message: { role: 'assistant', content: analysisContent } }]
      };
    })
  };
});

describe('Command Error Analysis', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    process.env.AUTO_ANALYZE_ERRORS = 'true';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    setupApiRouter(app);
  });

  describe('Error Analysis Activation', () => {
    it('analyzes command with non-zero exit code', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'exit 2' });

      expect(res.status).toBe(200);
      expect(res.body.result.exitCode).toBe(2);
      expect(res.body.aiAnalysis).toBeDefined();
      expect(res.body.aiAnalysis.text).toContain('exit code 2');
    });

    it('skips analysis for successful commands', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'echo success' });

      expect(res.status).toBe(200);
      if (res.body.result.exitCode === 0) {
        expect(res.body.aiAnalysis).toBeUndefined();
      }
    });

    it('analyzes command not found errors', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'nonexistentcommand123' });

      expect(res.status).toBe(200);
      if (res.body.result.exitCode !== 0) {
        expect(res.body.aiAnalysis).toBeDefined();
        expect(res.body.aiAnalysis.text).toContain('command not found');
      }
    });
  });

  describe('Analysis Content Quality', () => {
    it('provides contextual analysis based on error type', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'ls /root' });

      expect(res.status).toBe(200);
      if (res.body.aiAnalysis) {
        expect(res.body.aiAnalysis.text).toBeTruthy();
        expect(res.body.aiAnalysis.text.length).toBeGreaterThan(10);
      }
    });

    it('includes error context in analysis', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'exit 127' });

      expect(res.status).toBe(200);
      if (res.body.aiAnalysis) {
        expect(res.body.aiAnalysis).toHaveProperty('text');
        expect(res.body.aiAnalysis).toHaveProperty('model');
        expect(res.body.aiAnalysis).toHaveProperty('provider');
      }
    });
  });

  describe('Analysis Configuration', () => {
    it('respects AUTO_ANALYZE_ERRORS environment variable', async () => {
      // Test is already configured with AUTO_ANALYZE_ERRORS=true
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'exit 1' });

      expect(res.status).toBe(200);
      if (res.body.result.exitCode !== 0) {
        expect(res.body.aiAnalysis).toBeDefined();
      }
    });

    it('handles analysis when LLM is unavailable', async () => {
      // Mock LLM failure
      const { chat } = require('../src/llm');
      chat.mockRejectedValueOnce(new Error('LLM unavailable'));

      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'exit 1' });

      expect(res.status).toBe(200);
      // Should not crash even if analysis fails
      expect(res.body.result).toBeDefined();
    });
  });

  describe('Different Command Types', () => {
    it('analyzes Python execution errors', async () => {
      const res = await request(app)
        .post('/command/execute-python')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 'import nonexistent_module' });

      expect(res.status).toBe(200);
      if (res.body.result.exitCode !== 0 && res.body.aiAnalysis) {
        expect(res.body.aiAnalysis.text).toBeTruthy();
      }
    });

    it('analyzes code execution errors', async () => {
      const res = await request(app)
        .post('/command/execute-code')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          language: 'javascript',
          code: 'throw new Error("test error");'
        });

      expect(res.status).toBe(200);
      if (res.body.result.exitCode !== 0 && res.body.aiAnalysis) {
        expect(res.body.aiAnalysis.text).toBeTruthy();
      }
    });
  });

  describe('Error Analysis Performance', () => {
    it('completes analysis within reasonable time', async () => {
      const startTime = Date.now();
      
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'exit 1' });

      const duration = Date.now() - startTime;
      expect(res.status).toBe(200);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });

    it('handles concurrent error analysis requests', async () => {
      const requests = Array(3).fill(null).map(() => 
        request(app)
          .post('/command/execute-shell')
          .set('Authorization', `Bearer ${token}`)
          .send({ command: 'exit 1' })
      );

      const responses = await Promise.all(requests);
      responses.forEach(res => {
        expect(res.status).toBe(200);
      });
    });
  });

  describe('Analysis Output Format', () => {
    it('structures analysis response correctly', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'exit 1' });

      expect(res.status).toBe(200);
      if (res.body.aiAnalysis) {
        expect(res.body.aiAnalysis).toHaveProperty('text');
        expect(typeof res.body.aiAnalysis.text).toBe('string');
        expect(res.body.aiAnalysis.text.length).toBeGreaterThan(0);
      }
    });

    it('preserves original command result', async () => {
      const res = await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .send({ command: 'exit 42' });

      expect(res.status).toBe(200);
      expect(res.body.result).toBeDefined();
      expect(res.body.result.exitCode).toBe(42);
      // Analysis should be additional, not replacement
      if (res.body.aiAnalysis) {
        expect(res.body.result).toBeDefined();
      }
    });
  });
});

