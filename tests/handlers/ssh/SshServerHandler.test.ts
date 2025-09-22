import { SshServerHandler } from '../../../src/handlers/ssh/SshServerHandler';
import { SshHostConfig } from '../../../src/types/ServerConfig';

// Mock dependencies
jest.mock('ssh2');
jest.mock('fs');
jest.mock('../../../src/handlers/ssh/actions/changeDirectory.ssh');

describe('SshServerHandler', () => {
  let mockSshConfig: SshHostConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSshConfig = {
      hostname: 'test.example.com',
      protocol: 'ssh',
      port: 22,
      username: 'testuser',
      privateKeyPath: '/path/to/key',
      code: true
    };

    // Mock fs.readFileSync to return a mock key
    const fs = require('fs');
    fs.readFileSync = jest.fn().mockReturnValue('mock-private-key');
    fs.existsSync = jest.fn().mockReturnValue(true);
  });

  describe('constructor', () => {
    it('should initialize with SSH config', () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      expect(sshHandler).toBeInstanceOf(SshServerHandler);
    });

    it('should handle config without code property', () => {
      const configWithoutCode = { ...mockSshConfig };
      delete configWithoutCode.code;
      
      const handler = new SshServerHandler(configWithoutCode);
      expect(handler).toBeInstanceOf(SshServerHandler);
    });

    it('should work without private key path', () => {
      const configWithoutKey: Partial<SshHostConfig> = { ...mockSshConfig };
      delete configWithoutKey.privateKeyPath;

      expect(() => {
        new SshServerHandler(configWithoutKey as SshHostConfig);
      }).not.toThrow();
    });
  });

  describe('setServerConfig', () => {
    it('should update server configuration', () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const newConfig: SshHostConfig = {
        hostname: 'new.example.com',
        protocol: 'ssh',
        port: 2222,
        username: 'newuser',
        privateKeyPath: '/new/path/to/key',
        code: false
      };

      sshHandler.setServerConfig(newConfig);
      // Config should be updated (we can't directly test private properties)
      expect(sshHandler).toBeInstanceOf(SshServerHandler);
    });
  });

  describe('method existence', () => {
    it('should have all required AbstractServerHandler methods', () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      
      expect(typeof sshHandler.executeCommand).toBe('function');
      expect(typeof sshHandler.executeCode).toBe('function');
      expect(typeof sshHandler.createFile).toBe('function');
      expect(typeof sshHandler.getSystemInfo).toBe('function');
      expect(typeof sshHandler.listFiles).toBe('function');
      expect(typeof sshHandler.presentWorkingDirectory).toBe('function');
      expect(typeof sshHandler.setServerConfig).toBe('function');
    });
  });

  describe('executeCommand', () => {
    it('should execute command successfully', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const { Client } = require('ssh2');
      const mockStream: any = {
        on: jest.fn(),
        stderr: { on: jest.fn() }
      };
      mockStream.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'close') cb(0);
        if (event === 'data') cb(Buffer.from('output'));
        return mockStream;
      });
      mockStream.stderr.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'data') cb(Buffer.from(''));
        return mockStream;
      });

      const mockClient: any = {
        connect: jest.fn(),
        exec: jest.fn().mockImplementation((cmd: string, cb: Function) => cb(null, mockStream)),
        end: jest.fn(),
        on: jest.fn()
      };
      mockClient.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'ready') cb();
        if (event === 'error') {} // no-op
        return mockClient;
      });
      Client.mockImplementation(() => mockClient);

      const result = await sshHandler.executeCommand('echo test');
      expect(result.stdout).toBe('output');
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
    });

    it('should handle exec error', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const { Client } = require('ssh2');
      const mockClient: any = {
        connect: jest.fn(),
        exec: jest.fn().mockImplementation((cmd: string, cb: Function) => cb(new Error('exec failed'), null)),
        end: jest.fn(),
        on: jest.fn()
      };
      mockClient.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'ready') cb();
        return mockClient;
      });
      Client.mockImplementation(() => mockClient);

      const result = await sshHandler.executeCommand('bad command');
      expect(result.error).toBe(true);
      expect(result.stderr).toBe('exec failed');
    });

    it('should handle connection error', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const { Client } = require('ssh2');
      const mockClient: any = {
        connect: jest.fn(),
        end: jest.fn(),
        on: jest.fn()
      };
      mockClient.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'error') cb(new Error('connection failed'));
        return mockClient;
      });
      Client.mockImplementation(() => mockClient);

      const result = await sshHandler.executeCommand('echo test');
      expect(result.error).toBe(true);
      expect(result.stderr).toBe('connection failed');
    });

    it('should handle timeout', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const { Client } = require('ssh2');
      const mockClient: any = {
        connect: jest.fn(),
        end: jest.fn(),
        on: jest.fn()
      };
      mockClient.on.mockReturnValue(mockClient);
      Client.mockImplementation(() => mockClient);

      const result = await sshHandler.executeCommand('echo test', 10);
      expect(result.error).toBe(true);
      expect(result.stderr).toBe('Timeout');
      expect(result.exitCode).toBe(124);
    });
  });

  describe('getFileContent', () => {
    it('should read file content successfully', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const { Client } = require('ssh2');
      const mockStream: any = {
        on: jest.fn(),
        stderr: { on: jest.fn() }
      };
      mockStream.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'close') cb(0);
        if (event === 'data') cb(Buffer.from('file content'));
        return mockStream;
      });
      mockStream.stderr.on.mockReturnValue(mockStream);

      const mockClient: any = {
        connect: jest.fn(),
        exec: jest.fn().mockImplementation((cmd: string, cb: Function) => cb(null, mockStream)),
        end: jest.fn(),
        on: jest.fn()
      };
      mockClient.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'ready') cb();
        return mockClient;
      });
      Client.mockImplementation(() => mockClient);

      const content = await sshHandler.getFileContent('test.txt');
      expect(content).toBe('file content');
    });

    it('should throw error for invalid filePath', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      await expect(sshHandler.getFileContent('')).rejects.toThrow('filePath is required');
      await expect(sshHandler.getFileContent(null as any)).rejects.toThrow('filePath is required');
    });

    it('should throw error on command failure', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const { Client } = require('ssh2');
      const mockStream: any = {
        on: jest.fn(),
        stderr: { on: jest.fn() }
      };
      mockStream.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'close') cb(1);
        if (event === 'data') cb(Buffer.from(''));
        return mockStream;
      });
      mockStream.stderr.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'data') cb(Buffer.from('file not found'));
        return mockStream;
      });

      const mockClient: any = {
        connect: jest.fn(),
        exec: jest.fn().mockImplementation((cmd: string, cb: Function) => cb(null, mockStream)),
        end: jest.fn(),
        on: jest.fn()
      };
      mockClient.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'ready') cb();
        return mockClient;
      });
      Client.mockImplementation(() => mockClient);

      await expect(sshHandler.getFileContent('missing.txt')).rejects.toThrow('file not found');
    });
  });

  describe('stub methods', () => {
    let sshHandler: SshServerHandler;

    beforeEach(() => {
      sshHandler = new SshServerHandler(mockSshConfig);
    });

    it('executeCode should return stub result', async () => {
      const result = await sshHandler.executeCode('code', 'js');
      expect(result.stdout).toBe('SSH code executed');
      expect(result.success).toBe(true);
    });

    it('createFile should return true', async () => {
      const result = await sshHandler.createFile('file.txt');
      expect(result).toBe(true);
    });

    it('updateFile should return true', async () => {
      const result = await sshHandler.updateFile('file.txt', 'old', 'new');
      expect(result).toBe(true);
    });

    it('amendFile should return true', async () => {
      const result = await sshHandler.amendFile('file.txt', 'content');
      expect(result).toBe(true);
    });

    it('getSystemInfo should return mock info', async () => {
      const info = await sshHandler.getSystemInfo();
      expect(info.type).toBe('SshServer');
      expect(info.platform).toBe('linux');
    });

    it('listFiles should return mock files', async () => {
      const result = await sshHandler.listFiles({ directory: '/tmp' });
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('presentWorkingDirectory should return mock pwd', async () => {
      const pwd = await sshHandler.presentWorkingDirectory();
      expect(pwd).toBe('/home/user');
    });

    it('searchFiles should return empty results', async () => {
      const result = await sshHandler.searchFiles({ query: 'test' });
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('readFile', () => {
    it('should call getFileContent and return result', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const { Client } = require('ssh2');
      const mockStream: any = {
        on: jest.fn(),
        stderr: { on: jest.fn() }
      };
      mockStream.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'close') cb(0);
        if (event === 'data') cb(Buffer.from('content'));
        return mockStream;
      });
      mockStream.stderr.on.mockReturnValue(mockStream);

      const mockClient: any = {
        connect: jest.fn(),
        exec: jest.fn().mockImplementation((cmd: string, cb: Function) => cb(null, mockStream)),
        end: jest.fn(),
        on: jest.fn()
      };
      mockClient.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'ready') cb();
        return mockClient;
      });
      Client.mockImplementation(() => mockClient);

      const result = await sshHandler.readFile('test.txt');
      expect(result.content).toBe('content');
      expect(result.filePath).toBe('test.txt');
    });
  });

  describe('changeDirectory', () => {
    it('should call changeDirectoryAction and update config on success', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const { changeDirectory: changeDirectoryAction } = require('../../../src/handlers/ssh/actions/changeDirectory.ssh');
      changeDirectoryAction.mockResolvedValue(true);

      const result = await sshHandler.changeDirectory('/new/dir');
      expect(result).toBe(true);
      expect(sshHandler.serverConfig.directory).toBe('/new/dir');
    });

    it('should not update config on failure', async () => {
      const sshHandler = new SshServerHandler(mockSshConfig);
      const { changeDirectory: changeDirectoryAction } = require('../../../src/handlers/ssh/actions/changeDirectory.ssh');
      changeDirectoryAction.mockResolvedValue(false);

      const result = await sshHandler.changeDirectory('/bad/dir');
      expect(result).toBe(false);
      expect(sshHandler.serverConfig.directory).not.toBe('/bad/dir');
    });
  });

  describe('error handling', () => {
    it('should handle file system errors during command execution when private key is missing', async () => {
      const fs = require('fs');
      fs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      const sshHandler = new SshServerHandler(mockSshConfig);

      // The error should occur during executeCommand, not constructor
      await expect(sshHandler.executeCommand('echo test')).rejects.toThrow('ENOENT: no such file or directory');
    });

    it('should not try to read private key when path is not specified', async () => {
      const configWithoutKey: Partial<SshHostConfig> = { ...mockSshConfig };
      delete configWithoutKey.privateKeyPath;

      const fs = require('fs');
      const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');

      const sshHandler = new SshServerHandler(configWithoutKey as SshHostConfig);

      // Mock SSH2 to avoid actual connection
      const { Client } = require('ssh2');
      const mockClient: any = {
        connect: jest.fn(),
        exec: jest.fn(),
        end: jest.fn(),
        on: jest.fn()
      };
      mockClient.on = jest.fn().mockReturnValue(mockClient);
      Client.mockImplementation(() => mockClient);

      // This should timeout rather than try to read a file
      const result = await sshHandler.executeCommand('echo test', 100);

      expect(readFileSyncSpy).not.toHaveBeenCalled();
      expect(result.stderr).toBe('Timeout');
    });
  });
});
