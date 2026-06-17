import request from 'supertest';
import { makeTestApp } from '../utils/testApp';

describe('Public router (/health)', () => {
  it('GET /health returns 200 without authentication', async () => {
    const app = makeTestApp();
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});
