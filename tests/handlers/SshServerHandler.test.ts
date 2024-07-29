import { SshServerHandler } from '../../src/handlers/SshServerHandler';
import { Client, ConnectConfig, ClientChannel } from 'ssh2';
import { ServerConfig } from '../../src/types/ServerConfig';

jest.mock('ssh2');

describe('SshServerHandler', () => {
  let sshServerHandler: SshServerHandler;
  let mockClient: jest.Mocked<Client>;
  const serverConfig: ServerConfig = {
    host: 'localhost',
    protocol: 'ssh',
    username: 'user',
    privateKeyPath: '/mock/private/key',
    shell: 'bash',
  };

  beforeEach(() => {
    mockClient = new Client() as jest.Mocked<Client>;
    sshServerHandler = new SshServerHandler(serverConfig);
    sshServerHandler['client'] = mockClient;
  });

  it('should initialize SSH client', () => {
    const result = sshServerHandler.initializeSSHClient();
    expect(result).toBeInstanceOf(Client);
  });

  it('should connect to the server', async () => {
    mockClient.connect.mockImplementation((config: ConnectConfig) => {
      expect(config.host).toBe('localhost');
      return mockClient;
    });
    await sshServerHandler.connect();
    expect(mockClient.connect).toHaveBeenCalledTimes(1);
  });

  it('should execute a simple command and return global state', async () => {
    mockClient.exec.mockImplementation((command: string, callback: (err: Error | undefined, channel: ClientChannel) => void) => {
      const mockStream = {
        on: jest.fn((event, handler) => {
          if (event === 'data') {
            handler('hello world\n');
          }
          if (event === 'close') {
            handler(0); // Simulate successful command execution
          }
          return mockStream;
        }),
      } as unknown as ClientChannel;
      callback(undefined, mockStream);
      return mockClient;
    });

    const result = await sshServerHandler.executeCommand('echo \'hello world\'', 5000);
    expect(result.stdout.trim()).toBe('hello world');
    expect(result.stderr).toBe('');
  });
});
