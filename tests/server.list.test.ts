import request from 'supertest';
import app from '../src/app';

describe('GET /server/list', () => {
  it('returns 200 and a list (array)', async () => {
    const res = await request(app).get('/server/list');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('servers');
    expect(Array.isArray(res.body.servers)).toBe(true);
  });
});
