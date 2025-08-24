import request from 'supertest';
import express from 'express';
import sessionRoutes from '../../routes/shell/session';

jest.mock('../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));
jest.mock('../../middlewares/commandValidator', () => ({
  validateCommand: (req: any, res: any, next: any) => next()
}));

const app = express();
app.use(express.json());
app.use('/session', sessionRoutes);

describe('Circuit Breakers Integration', () => {
  test('should truncate long input', async () => {
    const longCommand = 'echo ' + 'x'.repeat(15000);
    const res = await request(app)
      .post('/session/exec')
      .send({ command: longCommand });
    
    expect(res.status).toBe(400);
    expect(res.body.truncated).toBe(true);
    expect(res.body.message).toBe('Input too long');
  });

  test('should handle output truncation', async () => {
    // Command that generates large output
    const res = await request(app)
      .post('/session/exec')
      .send({ command: 'yes | head -n 10000' });
    
    // Should complete normally for reasonable output
    expect(res.status).toBe(200);
  });

  test('should uplift long-running commands to sessions', async () => {
    const res = await request(app)
      .post('/session/exec')
      .send({ command: 'sleep 6' });
    
    expect(res.status).toBe(200);
    expect(res.body.sessionId).toMatch(/^sess-/);
    expect(res.body.terminated).toBe(true);
  }, 10000);
});