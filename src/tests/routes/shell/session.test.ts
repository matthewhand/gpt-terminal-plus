import request from 'supertest';
import express from 'express';
import sessionRoutes from '../../../routes/shell/session';

jest.mock('../../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));
jest.mock('../../../middlewares/commandValidator', () => ({
  validateCommand: (req: any, res: any, next: any) => next()
}));

const app = express();
app.use(express.json());
app.use('/session', sessionRoutes);

describe('Shell Session Routes', () => {
  test('POST /session/start should create session', async () => {
    const res = await request(app)
      .post('/session/start')
      .send({ shell: 'bash' });
    
    expect(res.status).toBe(200);
    expect(res.body.id).toMatch(/^sess-/);
    expect(res.body.shell).toBe('bash');
  });

  test('POST /session/exec should validate input length', async () => {
    const longCommand = 'a'.repeat(20000);
    const res = await request(app)
      .post('/session/exec')
      .send({ command: longCommand });
    
    expect(res.status).toBe(400);
    expect(res.body.truncated).toBe(true);
  });

  test('POST /session/exec should execute command', async () => {
    const res = await request(app)
      .post('/session/exec')
      .send({ command: 'echo test' });
    
    expect(res.status).toBe(200);
    expect(res.body.stdout).toContain('test');
  });

  test('GET /session/list should return sessions', async () => {
    const res = await request(app).get('/session/list');
    expect(res.status).toBe(200);
    expect(res.body.sessions).toBeDefined();
  });
});