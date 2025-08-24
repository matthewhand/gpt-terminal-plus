import request from 'supertest';
import express from 'express';
import sessionRoutes from '../../routes/shell/session';
import llmRoutes from '../../routes/llm';

jest.mock('../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));
jest.mock('../../middlewares/commandValidator', () => ({
  validateCommand: (req: any, res: any, next: any) => next()
}));

const app = express();
app.use(express.json());
app.use('/session', sessionRoutes);
app.use('/llm', llmRoutes);

describe('End-to-End Integration', () => {
  test('should create session, execute command, and cleanup', async () => {
    // Create session
    const createRes = await request(app)
      .post('/session/start')
      .send({ shell: 'bash' });
    
    expect(createRes.status).toBe(200);
    const sessionId = createRes.body.id;

    // Execute command in session
    const execRes = await request(app)
      .post(`/session/${sessionId}/exec`)
      .send({ command: 'echo hello' });
    
    expect(execRes.status).toBe(200);
    expect(execRes.body.stdout).toContain('hello');

    // List sessions
    const listRes = await request(app).get('/session/list');
    expect(listRes.status).toBe(200);
    expect(listRes.body.sessions.length).toBeGreaterThan(0);

    // Stop session
    const stopRes = await request(app).post(`/session/${sessionId}/stop`);
    expect(stopRes.status).toBe(200);
    expect(stopRes.body.success).toBe(true);
  });

  test('should handle session not found gracefully', async () => {
    const res = await request(app)
      .post('/session/invalid-id/exec')
      .send({ command: 'echo test' });
    
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Session not found');
  });

  test('should enforce all circuit breakers in sequence', async () => {
    // Test input length limit
    const longRes = await request(app)
      .post('/session/exec')
      .send({ command: 'x'.repeat(15000) });
    
    expect(longRes.status).toBe(400);
    expect(longRes.body.truncated).toBe(true);

    // Test normal execution
    const normalRes = await request(app)
      .post('/session/exec')
      .send({ command: 'echo normal' });
    
    expect(normalRes.status).toBe(200);
    expect(normalRes.body.stdout).toContain('normal');
  });
});