import request from 'supertest';
import express from 'express';
import filesRoutes from '../../routes/files';

jest.mock('../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));
jest.mock('../../engines/fileEngine');

const app = express();
app.use(express.json());
app.use('/files', filesRoutes);

describe('Files Routes', () => {
  test('POST /files/op should execute file operation', async () => {
    const { executeFileOperation } = require('../../engines/fileEngine');
    executeFileOperation.mockResolvedValue({ success: true });

    const res = await request(app)
      .post('/files/op')
      .send({ type: 'read', path: './test.txt' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /files/op should handle path not allowed', async () => {
    const { executeFileOperation } = require('../../engines/fileEngine');
    executeFileOperation.mockRejectedValue(new Error('Path not allowed'));

    const res = await request(app)
      .post('/files/op')
      .send({ type: 'read', path: '/etc/passwd' });
    
    expect(res.status).toBe(403);
  });
});