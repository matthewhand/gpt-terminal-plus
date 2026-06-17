import request from 'supertest';
import express from 'express';
import llmRoutes from '../../routes/llm';

jest.mock('../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));
jest.mock('../../engines/llmEngine');

const app = express();
app.use(express.json());
app.use('/llm', llmRoutes);

describe('LLM Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /llm/plan', () => {
    test('should require input parameter', async () => {
      const res = await request(app).post('/llm/plan').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('input required');
    });

    test('should reject empty input', async () => {
      const res = await request(app)
        .post('/llm/plan')
        .send({ input: '' });
      expect(res.status).toBe(400);
    });

    test('should return 429 on budget exceeded', async () => {
      const { planCommand } = require('../../engines/llmEngine');
      planCommand.mockRejectedValue(new Error('LLM budget exceeded'));
      
      const res = await request(app)
        .post('/llm/plan')
        .send({ input: 'test command' });
      
      expect(res.status).toBe(429);
    });

    test('should return successful plan', async () => {
      const { planCommand } = require('../../engines/llmEngine');
      planCommand.mockResolvedValue({
        command: 'ls -la',
        explanation: 'List files in detail',
        needsApproval: true,
        cost: 0.01
      });
      
      const res = await request(app)
        .post('/llm/plan')
        .send({ input: 'show me all files' });
      
      expect(res.status).toBe(200);
      expect(res.body.command).toBe('ls -la');
      expect(res.body.explanation).toBeDefined();
      expect(res.body.needsApproval).toBe(true);
    });

    test('should handle different model requests', async () => {
      const { planCommand } = require('../../engines/llmEngine');
      planCommand.mockResolvedValue({
        command: 'echo test',
        explanation: 'Echo command',
        needsApproval: false
      });
      
      const res = await request(app)
        .post('/llm/plan')
        .send({ 
          input: 'echo test',
          model: 'gpt-4',
          engine: 'codex'
        });
      
      expect(res.status).toBe(200);
      expect(planCommand).toHaveBeenCalledWith('echo test');
    });

    test('should handle LLM service errors', async () => {
      const { planCommand } = require('../../engines/llmEngine');
      planCommand.mockRejectedValue(new Error('Service unavailable'));
      
      const res = await request(app)
        .post('/llm/plan')
        .send({ input: 'test command' });
      
      expect(res.status).toBe(500);
      expect(res.body.message).toBeDefined();
    });

    test('should handle timeout errors', async () => {
      const { planCommand } = require('../../engines/llmEngine');
      planCommand.mockRejectedValue(new Error('Request timeout'));
      
      const res = await request(app)
        .post('/llm/plan')
        .send({ input: 'complex analysis task' });
      
      expect(res.status).toBe(500);
    });

    test('should handle long input', async () => {
      const { planCommand } = require('../../engines/llmEngine');
      planCommand.mockResolvedValue({ command: 'echo test', explanation: 'test' });
      
      const longInput = 'a'.repeat(1000);
      const res = await request(app)
        .post('/llm/plan')
        .send({ input: longInput });
      
      expect(res.status).toBe(200);
    });

    test('should handle special characters in input', async () => {
      const { planCommand } = require('../../engines/llmEngine');
      planCommand.mockResolvedValue({
        command: 'echo "test"',
        explanation: 'Safe echo command'
      });
      
      const res = await request(app)
        .post('/llm/plan')
        .send({ input: 'echo "hello world" && rm -rf /' });
      
      expect(res.status).toBe(200);
      expect(res.body.command).not.toContain('rm -rf');
    });
  });
});