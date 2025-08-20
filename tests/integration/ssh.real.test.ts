import request from 'supertest';
import { makeProdApp } from '../utils/testApp';
import { getOrGenerateApiToken } from '../../src/common/apiToken';

const token = getOrGenerateApiToken();

describe('SSH Integration Tests (Real)', () => {
  let app: any;

  beforeAll(async () => {
    app = await makeProdApp();
  });

  test('registers worker1 SSH server', async () => {
    const res = await request(app)
      .post('/server/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hostname: 'worker1',
        protocol: 'ssh',
        config: {
          host: 'worker1',
          username: process.env.USER || 'chatgpt',
          port: 22
        }
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('executes command on worker1 via SSH', async () => {
    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker1')
      .send({
        command: 'hostname && echo "SSH integration test successful"'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.result.success).toBe(true);
    expect(res.body.result.stdout).toContain('worker1');
    expect(res.body.result.stdout).toContain('SSH integration test successful');
  });

  test('creates and reads file on worker1', async () => {
    const testContent = `Integration test file created at ${new Date().toISOString()}`;
    
    // Create file
    const createRes = await request(app)
      .post('/file/create')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker1')
      .send({
        filePath: '/tmp/integration-test.txt',
        content: testContent
      });
    
    expect(createRes.status).toBe(200);
    
    // Read file back
    const readRes = await request(app)
      .post('/file/read')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker1')
      .send({
        filePath: '/tmp/integration-test.txt'
      });
    
    expect(readRes.status).toBe(200);
    expect(readRes.body.content).toBe(testContent);
  });

  test('lists files on worker1', async () => {
    const res = await request(app)
      .post('/file/list')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker1')
      .send({
        directory: '/tmp'
      });
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.some((item: any) => 
      item.name === 'integration-test.txt'
    )).toBe(true);
  });

  test('executes command on worker2', async () => {
    // Register worker2
    await request(app)
      .post('/server/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hostname: 'worker2',
        protocol: 'ssh',
        config: {
          host: 'worker2',
          username: process.env.USER || 'chatgpt',
          port: 22
        }
      });

    const res = await request(app)
      .post('/command/execute-shell')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Selected-Server', 'worker2')
      .send({
        command: 'hostname && uptime'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.result.success).toBe(true);
    expect(res.body.result.stdout).toContain('worker2');
  });

  afterAll(async () => {
    // Cleanup test files
    try {
      await request(app)
        .post('/command/execute-shell')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Selected-Server', 'worker1')
        .send({
          command: 'rm -f /tmp/integration-test.txt'
        });
    } catch {}
  });
});