import request from 'supertest';
import express from 'express';
import { registerServer } from '../src/routes/server/registerServer';
import { removeServer } from '../src/routes/server/removeServer';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import { unlink } from 'fs/promises';
import path from 'path';

const app = express();
app.use(express.json());
app.post('/server/register', registerServer);
app.delete('/server/:hostname', removeServer);

const token = getOrGenerateApiToken();
const testConfigPath = path.join(process.cwd(), 'config', 'servers.json');

describe('Server Registration', () => {
  afterEach(async () => {
    try {
      await unlink(testConfigPath);
    } catch {}
  });

  test('registers SSH server successfully', async () => {
    const res = await request(app)
      .post('/server/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hostname: 'test-ssh',
        protocol: 'ssh',
        config: {
          host: '192.168.1.100',
          username: 'testuser',
          port: 22
        }
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.server.hostname).toBe('test-ssh');
    expect(res.body.server.protocol).toBe('ssh');
  });

  test('validates required fields', async () => {
    const res = await request(app)
      .post('/server/register')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('hostname and protocol are required');
  });

  test('removes server successfully', async () => {
    // First register
    await request(app)
      .post('/server/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hostname: 'test-remove',
        protocol: 'local'
      });

    // Then remove
    const res = await request(app)
      .delete('/server/test-remove')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.removedServer.hostname).toBe('test-remove');
  });
});