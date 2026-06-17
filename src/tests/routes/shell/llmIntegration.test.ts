import request from 'supertest';
import express from 'express';
const shellRoutes = require('../../../routes/shell').default;

jest.mock('../../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));
jest.mock('../../../engines/llmEngine');

const app = express();
app.use(express.json());
// Mount the shell router at root; it exposes /llm/plan-exec
app.use('/', shellRoutes);

describe('LLM Integration Routes', () => {
  test('POST /llm/plan-exec should require input', async () => {
    const res = await request(app).post('/llm/plan-exec').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('input required');
  });

  test('POST /llm/plan-exec should return plan without execution', async () => {
    const { planCommand } = require('../../../engines/llmEngine');
    planCommand.mockResolvedValue({
      command: 'ls -la',
      explanation: 'List files',
      needsApproval: true
    });

    const res = await request(app)
      .post('/llm/plan-exec')
      .send({ input: 'show files' });
    
    expect(res.status).toBe(200);
    expect(res.body.executed).toBe(false);
    expect(res.body.needsApproval).toBe(true);
  });

  test('POST /llm/plan-exec should auto-execute when allowed', async () => {
    const { planCommand } = require('../../../engines/llmEngine');
    planCommand.mockResolvedValue({
      command: 'echo test',
      explanation: 'Echo test',
      needsApproval: false
    });

    const res = await request(app)
      .post('/llm/plan-exec')
      .send({ input: 'echo test', autoExecute: true });
    
    expect(res.status).toBe(200);
    expect(res.body.executed).toBe(true);
  });
});
