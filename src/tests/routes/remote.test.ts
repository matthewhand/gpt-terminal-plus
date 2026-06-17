import request from 'supertest';
import express from 'express';
import remoteRoutes from '../../routes/remote';

jest.mock('../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));
jest.mock('../../engines/remoteEngine');

const app = express();
app.use(express.json());
app.use('/remote', remoteRoutes);

describe('Remote Routes', () => {
  test('POST /remote/ssh should create SSH session', async () => {
    const { createSSHSession } = require('../../engines/remoteEngine');
    createSSHSession.mockResolvedValue({ id: 'ssh-123', type: 'ssh' });

    const res = await request(app)
      .post('/remote/ssh')
      .send({ host: 'test.com', user: 'admin' });
    
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('ssh');
  });

  test('POST /remote/ssm should create SSM session', async () => {
    const { createSSMSession } = require('../../engines/remoteEngine');
    createSSMSession.mockResolvedValue({ id: 'ssm-123', type: 'ssm' });

    const res = await request(app)
      .post('/remote/ssm')
      .send({ instanceId: 'i-1234567890abcdef0' });
    
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('ssm');
  });

  test('GET /remote/list should return sessions', async () => {
    const { listRemoteSessions } = require('../../engines/remoteEngine');
    listRemoteSessions.mockReturnValue([]);

    const res = await request(app).get('/remote/list');
    expect(res.status).toBe(200);
    expect(res.body.sessions).toBeDefined();
  });
});