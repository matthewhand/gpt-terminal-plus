import request from 'supertest';
import express from 'express';
import sessionRoutes from '../../routes/shell/session';
import filesRoutes from '../../routes/files';
import { rateLimiter } from '../../middlewares/rateLimiter';

jest.mock('../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));

const app = express();
app.use(express.json());
app.use('/session', sessionRoutes);
app.use('/files', filesRoutes);

describe('Security Integration Tests', () => {
  test('should block dangerous commands', async () => {
    const res = await request(app)
      .post('/session/exec')
      .send({ command: 'rm -rf /' });
    
    expect(res.status).toBe(403);
    expect(res.body.message).toContain('blocked');
  });

  test('should enforce rate limiting', async () => {
    const limitedApp = express();
    limitedApp.use(express.json());
    limitedApp.use(rateLimiter(2, 60000));
    limitedApp.use('/test', (req, res) => res.json({ ok: true }));

    // First two requests should pass
    await request(limitedApp).get('/test').expect(200);
    await request(limitedApp).get('/test').expect(200);
    
    // Third should be rate limited
    await request(limitedApp).get('/test').expect(429);
  });

  test('should validate file operation paths', async () => {
    const res = await request(app)
      .post('/files/op')
      .send({ type: 'read', path: '/etc/passwd' });
    
    expect(res.status).toBe(403);
  });

  test('should sanitize command injection attempts', async () => {
    const res = await request(app)
      .post('/session/exec')
      .send({ command: 'echo test; rm -rf /' });
    
    expect(res.status).toBe(403);
  });
});