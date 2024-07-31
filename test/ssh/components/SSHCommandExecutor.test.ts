import { SSHCommandExecutor } from '../../../src/handlers/ssh/components/SSHCommandExecutor';
import { Client, ConnectConfig } from 'ssh2';

jest.mock('ssh2', () => {
  const mockClient = {
    on: jest.fn().mockReturnThis(),
    connect: jest.fn(),
    exec: jest.fn(),
    end: jest.fn(),
  };
  return {
    Client: jest.fn(() => mockClient),
  };
});

describe('SSHCommandExecutor', () => {
  let executor: SSHCommandExecutor;
  const mockClient = new Client();
  const config: ConnectConfig = { host: 'localhost', username: 'user', password: 'pass' };

  beforeEach(() => {
    jest.clearAllMocks();
    executor = new SSHCommandExecutor();
  });

  it('should execute a command successfully', async () => {
    const mockStream = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          setTimeout(() => callback(0, null), 100); // Simulate command execution
        }
        return mockStream;
      }),
      stderr: {
        on: jest.fn(),
      },
    };

    (mockClient.exec as jest.Mock).mockImplementation((cmd, cb) => cb(null, mockStream));

    const result = await executor.execute(config, 'ls');
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
    expect(mockClient.connect).toHaveBeenCalledWith(config);
  });

  it('should handle execution errors', async () => {
    (mockClient.exec as jest.Mock).mockImplementation((cmd, cb) => cb(new Error('Execution failed'), null));

    await expect(executor.execute(config, 'ls')).rejects.toThrow('Execution failed');
  });

  it('should handle connection errors', async () => {
    (mockClient.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'error') {
        callback(new Error('Connection failed'));
      }
      return mockClient;
    });

    await expect(executor.execute(config, 'ls')).rejects.toThrow('Connection failed');
  });

  it('should time out if command takes too long', async () => {
    const mockStream = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'close') {
          setTimeout(() => callback(0, null), 11000); // Simulate delay
        }
        return mockStream;
      }),
      stderr: {
        on: jest.fn(),
      },
    };

    executor = new SSHCommandExecutor(500); // Set a shorter timeout for the test
    (mockClient.exec as jest.Mock).mockImplementation((cmd, cb) => cb(null, mockStream));

    const result = await executor.execute(config, 'sleep 2');
    expect(result.stderr).toContain('Execution timed out');
  });
});
