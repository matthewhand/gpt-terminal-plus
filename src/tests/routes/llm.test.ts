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
  test('POST /llm/plan should require input', async () => {
    const res = await request(app).post('/llm/plan').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('input required');
  });

  test('POST /llm/plan should return 429 on budget exceeded', async () => {
    const { planCommand } = require('../../engines/llmEngine');
    planCommand.mockRejectedValue(new Error('LLM budget exceeded'));
    
    const res = await request(app)
      .post('/llm/plan')
      .send({ input: 'test command' });
    
    expect(res.status).toBe(429);
  });
});