import request from 'supertest';
import express from 'express';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

const app = setupApiRouter(express());
const token = getOrGenerateApiToken();

describe('GET /server/list', () => {
  it('returns 200 and an array of servers', async () => {
    const res = await request(app)
      .get('/server/list')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('servers');
    expect(Array.isArray(res.body.servers)).toBe(true);
  });
});
