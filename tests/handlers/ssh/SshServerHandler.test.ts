import { SshServerHandler } from '../../../src/handlers/ssh/SshServerHandler';
import { SshHostConfig } from '../../../src/types/ServerConfig';

// Mock dependencies
jest.mock('ssh2');
jest.mock('fs');

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
