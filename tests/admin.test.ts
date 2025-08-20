import request from 'supertest';
import express from 'express';
import { mountAdmin } from '../src/admin';

const app = express();
app.use(express.json());
mountAdmin(app);

describe('AdminJS Integration', () => {
  test('admin login page loads', async () => {
    const res = await request(app)
      .get('/admin/login');
    
    expect(res.status).toBe(200);
    expect(res.text).toContain('AdminJS');
  });

  test('admin requires authentication', async () => {
    const res = await request(app)
      .get('/admin');
    
    expect(res.status).toBe(302); // Redirect to login
  });

  test('admin authenticates with correct credentials', async () => {
    const res = await request(app)
      .post('/admin/login')
      .send({
        email: 'admin@gpt-terminal-plus.local',
        password: 'admin123'
      });
    
    expect(res.status).toBe(302); // Redirect after login
  });

  test('admin rejects incorrect credentials', async () => {
    const res = await request(app)
      .post('/admin/login')
      .send({
        email: 'wrong@email.com',
        password: 'wrongpass'
      });
    
    expect(res.status).toBe(302); // Redirect back to login
    expect(res.headers.location).toContain('login');
  });
});