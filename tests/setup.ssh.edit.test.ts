import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import fs from 'fs';

describe('Setup UI SSH edit', () => {
  let app: express.Express;
  let token: string;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setupApiRouter(app);
  });

  it('edits existing SSH host llm settings', async () => {
    const res = await request(app)
      .post('/setup/ssh')
      .set('Authorization', `Bearer ${token}`)
      .type('form')
      .send({ edit: 'ssh-bash.example.com', hostname: 'ssh-bash.example.com', port: '22', username: 'chatgpt', privateKeyPath: '/home/chatgpt/.ssh/id_rsa', 'llm.provider': 'ollama', 'llm.baseUrl': 'http://sshhost:11434' });
    expect([200,302]).toContain(res.status);
    const raw = fs.readFileSync('config/test/test.json','utf8');
    expect(raw).toContain('ssh-bash.example.com');
    expect(raw).toContain('ollama');
    expect(raw).toContain('sshhost');
  });
});

