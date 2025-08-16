import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

// Mock AWS SSM client
jest.mock('@aws-sdk/client-ssm', () => {
  return {
    SSMClient: class { async send(cmd: any) {
      if (cmd.constructor.name === 'SendCommandCommand') {
        return { Command: { CommandId: 'abc' } } as any;
      }
      if (cmd.constructor.name === 'GetCommandInvocationCommand') {
        return { Status: 'Success', ResponseCode: 0, StandardOutputContent: 'ssm hello\n', StandardErrorContent: '' } as any;
      }
      return {} as any;
    }},
    SendCommandCommand: class { constructor(public input: any){} },
    GetCommandInvocationCommand: class { constructor(public input: any){} }
  };
});

// Mock plan
jest.mock('../src/llm', () => {
  const original = jest.requireActual('../src/llm');
  return {
    ...original,
    chatForServer: async () => ({
      model: 'gpt-oss:20b',
      provider: 'ollama',
      choices: [ { index: 0, message: { role: 'assistant', content: JSON.stringify({ commands: [ { cmd: 'echo ssm hello', explain: 'greet' } ] }) } } ]
    })
  };
});

describe('execute-llm SSM non-stream success (mocked)', () => {
  let app: express.Express;
  let token: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setupApiRouter(app);
    await request(app).post('/setup/ssm').set('Authorization', `Bearer ${token}`).type('form')
      .send({ edit: 'i-1234567890abcdef0', instanceId: 'i-1234567890abcdef0', region: 'us-west-2', hostname: 'DemoSSM' });
    await request(app).post('/server/set').set('Authorization', `Bearer ${token}`).send({ server: 'GAMINGPC.WORKGROUP', getSystemInfo: false });
  });

  it('returns non-stream results with exitCode 0', async () => {
    const res = await request(app)
      .post('/command/execute-llm')
      .set('Authorization', `Bearer ${token}`)
      .send({ instructions: 'echo ssm hello' });
    expect(res.status).toBe(200);
    expect(res.body.results[0].exitCode).toBe(0);
    expect(res.body.results[0].stdout).toContain('ssm hello');
  });
});

