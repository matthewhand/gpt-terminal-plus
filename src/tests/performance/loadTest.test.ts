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

describe('Performance Tests', () => {
  test('should handle concurrent session creation', async () => {
    const promises = Array.from({ length: 10 }, () =>
      request(app).post('/session/start').send({ shell: 'bash' })
    );
    
    const results = await Promise.all(promises);
    results.forEach(res => {
      expect(res.status).toBe(200);
      expect(res.body.id).toMatch(/^sess-/);
    });
  });

  test('should handle concurrent command execution', async () => {
    const promises = Array.from({ length: 5 }, (_, i) =>
      request(app)
        .post('/session/exec')
        .send({ command: `echo test${i}` })
    );
    
    const results = await Promise.all(promises);
    results.forEach((res, i) => {
      expect(res.status).toBe(200);
      expect(res.body.stdout).toContain(`test${i}`);
    });
  });

  test('should maintain performance under load', async () => {
    const start = Date.now();
    
    const promises = Array.from({ length: 20 }, () =>
      request(app)
        .post('/session/exec')
        .send({ command: 'echo performance' })
    );
    
    await Promise.all(promises);
    const duration = Date.now() - start;
    
    // Should complete within reasonable time
    expect(duration).toBeLessThan(5000);
  });
});