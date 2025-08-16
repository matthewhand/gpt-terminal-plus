import express from 'express';
import request from 'supertest';
import setupMiddlewares from '../src/middlewares/setupMiddlewares';

describe('middlewares/setupMiddlewares', () => {
  it('parses urlencoded forms and sets CORS', async () => {
    const app = express();
    setupMiddlewares(app);
    app.post('/echo', (req, res) => res.json(req.body));

    const res = await request(app)
      .post('/echo')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('foo=bar&baz=qux');
    expect(res.status).toBe(200);
    expect(res.body.foo).toBe('bar');
    expect(res.body.baz).toBe('qux');
  });
});

