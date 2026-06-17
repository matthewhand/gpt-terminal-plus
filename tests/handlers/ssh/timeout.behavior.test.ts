import { SshServerHandler } from '../../../src/handlers/ssh/SshServerHandler';
import { SshHostConfig } from '../../../src/types/ServerConfig';

// Minimal ssh2 mock: emits 'ready' immediately and never closes the stream
jest.mock('ssh2', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        on: function (this: any, event: string, cb: Function) {
          if (event === 'ready') setImmediate(() => cb());
          return this;
        },
        connect: jest.fn(() => {}),
        exec: jest.fn((_cmd: string, cb: Function) => {
          const stream: any = { on: jest.fn(() => stream), stderr: { on: jest.fn() } };
          cb(null, stream);
        }),
        end: jest.fn(),
      } as any;
    })
  };
});

jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('KEY'),
  existsSync: jest.fn().mockReturnValue(true),
}));

describe('SshServerHandler timeouts', () => {
  const baseCfg: SshHostConfig = {
    protocol: 'ssh',
    hostname: 'host',
    username: 'user',
    port: 22,
    code: false,
  } as any;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2025, 0, 1));
    delete process.env.SSH_TIMEOUT;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('terminates long command based on env SSH_TIMEOUT when no param is passed', async () => {
    process.env.SSH_TIMEOUT = '50';
    const handler = new SshServerHandler(baseCfg);
    const p = handler.executeCommand('sleep 10');
    jest.advanceTimersByTime(60);
    const result = await p;
    expect(result.exitCode).toBe(124);
    expect(result.error).toBe(true);
    expect(String(result.stderr)).toMatch(/Timeout/i);
  });

  it('explicit timeout param overrides env default', async () => {
    process.env.SSH_TIMEOUT = '5000';
    const handler = new SshServerHandler(baseCfg);
    const p = handler.executeCommand('sleep 10', 20);
    jest.advanceTimersByTime(25);
    const result = await p;
    expect(result.exitCode).toBe(124);
    expect(String(result.stderr)).toMatch(/Timeout/i);
  });
});

