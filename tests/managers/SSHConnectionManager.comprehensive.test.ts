import { SSHConnectionManager } from '../../src/managers/SSHConnectionManager';
import { SshHostConfig } from '../../src/types/ServerConfig';
import { Client } from 'ssh2';
import fs from 'fs';

// Mock ssh2 Client
jest.mock('ssh2');
jest.mock('fs');

const MockedClient = Client as jest.MockedClass<typeof Client>;
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('SSH Connection Manager', () => {
  let sshManager: SSHConnectionManager;
  let mockClient: jest.Mocked<Client>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock client instance
    mockClient = {
      on: jest.fn().mockReturnThis(),
      connect: jest.fn(),
      exec: jest.fn(),
      end: jest.fn()
    } as any;

    // Mock Client constructor to return our mock
    MockedClient.mockImplementation(() => mockClient);

    sshManager = new SSHConnectionManager();
  });

  describe('constructor', () => {
    it('should create SSH client instance', () => {
      expect(MockedClient).toHaveBeenCalled();
    });
  });

  describe('connect', () => {
    const mockConfig: SshHostConfig = {
      protocol: 'ssh',
      hostname: 'example.com',
      port: 22,
      username: 'testuser',
      privateKeyPath: '/path/to/key'
    };

    beforeEach(() => {
      // Mock fs.readFileSync
      mockedFs.readFileSync.mockReturnValue(Buffer.from('mock-private-key'));
    });

    it('should connect successfully with valid configuration', async () => {
      // Mock successful connection
      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'ready') {
          setTimeout(() => callback(), 0);
        }
        return mockClient;
      });

      const connectPromise = sshManager.connect(mockConfig);

      await expect(connectPromise).resolves.toBeUndefined();

      expect(mockClient.on).toHaveBeenCalledWith('ready', expect.any(Function));
      expect(mockClient.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockClient.connect).toHaveBeenCalledWith({
        host: 'example.com',
        port: 22,
        username: 'testuser',
        privateKey: Buffer.from('mock-private-key')
      });
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('/path/to/key');
    });

    it('should use default port 22 when port is not provided', async () => {
      const configWithoutPort: SshHostConfig = {
        protocol: 'ssh',
        hostname: 'example.com',
        port: undefined as any,
        username: 'testuser',
        privateKeyPath: '/path/to/key'
      };

      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'ready') {
          setTimeout(() => callback(), 0);
        }
        return mockClient;
      });

      await sshManager.connect(configWithoutPort);

      expect(mockClient.connect).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 22
        })
      );
    });

    it('should handle connection errors', async () => {
      const connectionError = new Error('Connection failed');

      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback(connectionError), 0);
        }
        return mockClient;
      });

      await expect(sshManager.connect(mockConfig))
        .rejects.toThrow('Connection failed');
    });

    it('should handle file read errors', async () => {
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(sshManager.connect(mockConfig))
        .rejects.toThrow('File not found');
    });

    it('should handle different port configurations', async () => {
      const customPortConfig: SshHostConfig = {
        ...mockConfig,
        port: 2222
      };

      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'ready') {
          setTimeout(() => callback(), 0);
        }
        return mockClient;
      });

      await sshManager.connect(customPortConfig);

      expect(mockClient.connect).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 2222
        })
      );
    });

    it('should handle different hostnames and usernames', async () => {
      const differentConfig: SshHostConfig = {
        protocol: 'ssh',
        hostname: 'different-host.com',
        port: 22,
        username: 'different-user',
        privateKeyPath: '/different/path/key'
      };

      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'ready') {
          setTimeout(() => callback(), 0);
        }
        return mockClient;
      });

      await sshManager.connect(differentConfig);

      expect(mockClient.connect).toHaveBeenCalledWith({
        host: 'different-host.com',
        port: 22,
        username: 'different-user',
        privateKey: Buffer.from('mock-private-key')
      });
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('/different/path/key');
    });
  });

  describe('executeCommand', () => {
    it('should execute command successfully', async () => {
      const mockStream = {
        on: jest.fn().mockReturnThis(),
        stderr: {
          on: jest.fn().mockReturnThis()
        }
      };

      mockClient.exec.mockImplementation((command, callback) => {
        setTimeout(() => callback(null, mockStream as any), 0);
        return mockClient;
      });

      // Mock stream events
      mockStream.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          setTimeout(() => callback(Buffer.from('command output')), 0);
        } else if (event === 'close') {
          setTimeout(() => callback(0), 10); // Exit code 0
        }
        return mockStream;
      });

      mockStream.stderr.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          setTimeout(() => callback(Buffer.from('')), 0);
        }
        return mockStream.stderr;
      });

      const result = await sshManager.executeCommand('ls -la');

      expect(result).toEqual({
        stdout: 'command output',
        stderr: ''
      });
      expect(mockClient.exec).toHaveBeenCalledWith('ls -la', expect.any(Function));
    });

    it('should handle command with stderr output', async () => {
      const mockStream = {
        on: jest.fn().mockReturnThis(),
        stderr: {
          on: jest.fn().mockReturnThis()
        }
      };

      mockClient.exec.mockImplementation((command, callback) => {
        setTimeout(() => callback(null, mockStream as any), 0);
        return mockClient;
      });

      mockStream.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          setTimeout(() => callback(Buffer.from('stdout content')), 0);
        } else if (event === 'close') {
          setTimeout(() => callback(0), 10);
        }
        return mockStream;
      });

      mockStream.stderr.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          setTimeout(() => callback(Buffer.from('stderr content')), 0);
        }
        return mockStream.stderr;
      });

      const result = await sshManager.executeCommand('command-with-stderr');

      expect(result).toEqual({
        stdout: 'stdout content',
        stderr: 'stderr content'
      });
    });

    it('should handle command execution errors', async () => {
      const execError = new Error('Execution failed');

      mockClient.exec.mockImplementation((command, callback) => {
        setTimeout(() => callback(execError, null), 0);
        return mockClient;
      });

      await expect(sshManager.executeCommand('failing-command'))
        .rejects.toThrow('Execution failed');
    });

    it('should handle non-zero exit codes', async () => {
      const mockStream = {
        on: jest.fn().mockReturnThis(),
        stderr: {
          on: jest.fn().mockReturnThis()
        }
      };

      mockClient.exec.mockImplementation((command, callback) => {
        setTimeout(() => callback(null, mockStream as any), 0);
        return mockClient;
      });

      mockStream.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          setTimeout(() => callback(Buffer.from('error output')), 0);
        } else if (event === 'close') {
          setTimeout(() => callback(1), 10); // Exit code 1
        }
        return mockStream;
      });

      mockStream.stderr.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          setTimeout(() => callback(Buffer.from('command failed')), 0);
        }
        return mockStream.stderr;
      });

      await expect(sshManager.executeCommand('failing-command'))
        .rejects.toThrow('Command failed with exit code 1');
    });

    it('should handle multiple data chunks', async () => {
      const mockStream = {
        on: jest.fn().mockReturnThis(),
        stderr: {
          on: jest.fn().mockReturnThis()
        }
      };

      mockClient.exec.mockImplementation((command, callback) => {
        setTimeout(() => callback(null, mockStream as any), 0);
        return mockClient;
      });

      let dataCallbacks: Function[] = [];
      mockStream.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          dataCallbacks.push(callback);
        } else if (event === 'close') {
          setTimeout(() => {
            // Simulate multiple data chunks
            dataCallbacks.forEach((cb, index) => {
              cb(Buffer.from(`chunk${index + 1} `));
            });
            callback(0);
          }, 0);
        }
        return mockStream;
      });

      mockStream.stderr.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          setTimeout(() => callback(Buffer.from('')), 0);
        }
        return mockStream.stderr;
      });

      const result = await sshManager.executeCommand('multi-chunk-command');

      expect(result.stdout).toContain('chunk1');
    });

    it('should handle empty command output', async () => {
      const mockStream = {
        on: jest.fn().mockReturnThis(),
        stderr: {
          on: jest.fn().mockReturnThis()
        }
      };

      mockClient.exec.mockImplementation((command, callback) => {
        setTimeout(() => callback(null, mockStream as any), 0);
        return mockClient;
      });

      mockStream.on.mockImplementation((event, callback) => {
        if (event === 'close') {
          setTimeout(() => callback(0), 0);
        }
        return mockStream;
      });

      mockStream.stderr.on.mockImplementation(() => mockStream.stderr);

      const result = await sshManager.executeCommand('silent-command');

      expect(result).toEqual({
        stdout: '',
        stderr: ''
      });
    });
  });

  describe('disconnect', () => {
    it('should disconnect from SSH server', () => {
      sshManager.disconnect();

      expect(mockClient.end).toHaveBeenCalled();
    });

    it('should handle multiple disconnect calls', () => {
      sshManager.disconnect();
      sshManager.disconnect();

      expect(mockClient.end).toHaveBeenCalledTimes(2);
    });
  });

  describe('integration scenarios', () => {
    it('should handle full connection lifecycle', async () => {
      const config: SshHostConfig = {
        protocol: 'ssh',
        hostname: 'test.com',
        port: 22,
        username: 'user',
        privateKeyPath: '/key'
      };

      mockedFs.readFileSync.mockReturnValue(Buffer.from('key-content'));

      // Mock successful connection
      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'ready') {
          setTimeout(() => callback(), 0);
        }
        return mockClient;
      });

      // Connect
      await sshManager.connect(config);

      // Mock command execution
      const mockStream = {
        on: jest.fn().mockReturnThis(),
        stderr: { on: jest.fn().mockReturnThis() }
      };

      mockClient.exec.mockImplementation((command, callback) => {
        setTimeout(() => callback(null, mockStream as any), 0);
        return mockClient;
      });

      mockStream.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          setTimeout(() => callback(Buffer.from('test output')), 0);
        } else if (event === 'close') {
          setTimeout(() => callback(0), 10);
        }
        return mockStream;
      });

      mockStream.stderr.on.mockReturnValue(mockStream.stderr);

      // Execute command
      const result = await sshManager.executeCommand('test command');
      expect(result.stdout).toBe('test output');

      // Disconnect
      sshManager.disconnect();
      expect(mockClient.end).toHaveBeenCalled();
    });

    it('should handle connection failure scenarios', async () => {
      const config: SshHostConfig = {
        protocol: 'ssh',
        hostname: 'unreachable.com',
        port: 22,
        username: 'user',
        privateKeyPath: '/nonexistent/key'
      };

      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      await expect(sshManager.connect(config))
        .rejects.toThrow('ENOENT: no such file or directory');
    });
  });
});
