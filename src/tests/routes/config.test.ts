import request from 'supertest';
import express from 'express';
import configRoutes from '../../routes/config';

jest.mock('../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));

const app = express();
app.use(express.json());
app.use('/config', configRoutes);

describe('Config Routes', () => {
  test('GET /config/schema should return schema', async () => {
    const res = await request(app).get('/config/schema');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  test('GET /config/override should return current config', async () => {
    const res = await request(app).get('/config/override');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  test('POST /config/override should update config', async () => {
    const res = await request(app)
      .post('/config/override')
      .send({ testKey: 'testValue' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});