import { SsmServerHandler } from '../../../src/handlers/ssm/SsmServerHandler';
import { SSMClient, SendCommandCommand, GetCommandInvocationCommand } from '@aws-sdk/client-ssm';

// Mock AWS SDK
jest.mock('@aws-sdk/client-ssm');
jest.mock('../../../src/handlers/ssm/actions/changeDirectory.ssm');

const MockedSSMClient = SSMClient as jest.MockedClass<typeof SSMClient>;

describe('SSM Server Handler', () => {
  let ssmHandler: SsmServerHandler;
  let mockClient: jest.Mocked<SSMClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock client instance
    mockClient = {
      send: jest.fn()
    } as any;

    // Mock SSMClient constructor to return our mock
    MockedSSMClient.mockImplementation(() => mockClient);

    ssmHandler = new SsmServerHandler({
      protocol: 'ssm',
      hostname: 'test-instance',
      instanceId: 'i-1234567890abcdef0',
      region: 'us-east-1'
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('executeCommand', () => {
    it('should execute command successfully', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Success',
        StandardOutputContent: 'Hello World',
        StandardErrorContent: '',
        ResponseCode: 0
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.executeCommand('echo "Hello World"');

      expect(result).toEqual({
        stdout: 'Hello World',
        stderr: '',
        error: false,
        exitCode: 0,
        success: true,
        output: 'Hello World'
      });

      expect(mockClient.send).toHaveBeenCalledTimes(2);
      expect(mockClient.send).toHaveBeenNthCalledWith(1, expect.any(SendCommandCommand));
      expect(mockClient.send).toHaveBeenNthCalledWith(2, expect.any(GetCommandInvocationCommand));
    });

    it('should handle command execution failure', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Failed',
        StandardOutputContent: '',
        StandardErrorContent: 'Command not found',
        ResponseCode: 1
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.executeCommand('invalid-command');

      expect(result).toEqual({
        stdout: '',
        stderr: 'Command not found',
        error: true,
        exitCode: 1,
        success: false,
        output: ''
      });
    });

    it('should handle command timeout', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'InProgress'
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValue(mockInvocationResponse as any);

      // Mock setTimeout to immediately call the callback and Date.now to advance
      jest.spyOn(global, 'setTimeout').mockImplementation(((callback: any) => {
        callback();
        return {} as any;
      }) as any);
      let now = 0;
      jest.spyOn(Date, 'now').mockImplementation(() => {
        now += 600;
        return now;
      });

      const result = await ssmHandler.executeCommand('sleep 100', 1000);

      expect(result).toEqual({
        stdout: '',
        stderr: 'Command execution timed out',
        error: true,
        exitCode: -1,
        success: false,
        output: ''
      });
    });

    it('should handle AWS SDK errors', async () => {
      mockClient.send.mockRejectedValue(new Error('AWS SDK Error') as any);

      const result = await ssmHandler.executeCommand('echo test');

      expect(result).toEqual({
        stdout: '',
        stderr: 'AWS SDK Error',
        error: true,
        exitCode: -1,
        success: false,
        output: ''
      });
    });

    it('should handle missing command ID in response', async () => {
      const mockSendResponse = {
        Command: {}
      };

      mockClient.send.mockResolvedValueOnce(mockSendResponse as any);

      const result = await ssmHandler.executeCommand('echo test');

      expect(result.stdout).toBe('');
      expect(result.error).toBe(true);
      expect(result.exitCode).toBe(-1);
    });
  });

  describe('executeCode', () => {
    it('should return placeholder result (SSM executeCode not yet implemented)', async () => {
      const result = await ssmHandler.executeCode('print("Hello from Python")', 'python');

      expect(result).toEqual({
        success: false,
        stdout: '',
        stderr: 'Failed to get command ID from AWS response',
        output: '',
        error: true,
        exitCode: -1
      });
    });
  });

  describe('createFile', () => {
    it('should return true (placeholder SSM file creation)', async () => {
      const result = await ssmHandler.createFile('/tmp/test.txt');

      expect(result).toBe(true);
    });
  });

  describe('getSystemInfo', () => {
    it('should return placeholder system info', async () => {
      const result = await ssmHandler.getSystemInfo();

      expect(result).toEqual({
        type: 'SsmServer',
        platform: 'linux',
        architecture: 'x64',
        totalMemory: 16384,
        freeMemory: 8192,
        uptime: 123456,
        currentFolder: '/home/user'
      });
    });
  });

  describe('getFileContent', () => {
    it('should get file content successfully', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Success',
        StandardOutputContent: 'File content here',
        StandardErrorContent: '',
        ResponseCode: 0
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.getFileContent('/tmp/test.txt');

      expect(result).toBe('File content here');
    });

    it('should handle file read errors', async () => {
      mockClient.send.mockRejectedValue(new Error('Permission denied') as any);

      await expect(ssmHandler.getFileContent('/root/secret.txt'))
        .rejects.toThrow('Permission denied');
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockClient.send.mockRejectedValue(new Error('Network error') as any);

      const result = await ssmHandler.executeCommand('echo test');

      expect(result.error).toBe(true);
      expect(result.stderr).toBe('Network error');
      expect(result.exitCode).toBe(-1);
    });

    it('should handle thrown command errors', async () => {
      mockClient.send.mockRejectedValue(new Error('Command failed') as any);

      const result = await ssmHandler.executeCommand('failing-command');

      expect(result.error).toBe(true);
      expect(result.stderr).toBe('Command failed');
    });
  });

  describe('executeCode', () => {
    it('should execute bash code', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Success',
        StandardOutputContent: 'bash output',
        StandardErrorContent: '',
        ResponseCode: 0
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.executeCode('echo "test"', 'bash');
      expect(result.success).toBe(true);
      expect(result.output).toBe('bash output');
    });

    it('should default to sh for unknown language', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Success',
        StandardOutputContent: 'sh output',
        StandardErrorContent: '',
        ResponseCode: 0
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.executeCode('echo "test"', 'unknown');
      expect(result.success).toBe(true);
      expect(result.output).toBe('sh output');
    });
  });

  describe('amendFile', () => {
    it('should append to file successfully', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Success',
        StandardOutputContent: '',
        StandardErrorContent: '',
        ResponseCode: 0
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.amendFile('/tmp/test.txt', 'new content');
      expect(result.success).toBe(true);
    });
  });

  describe('readFile', () => {
    it('should read file via getFileContent', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Success',
        StandardOutputContent: 'file content',
        StandardErrorContent: '',
        ResponseCode: 0
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.readFile('/tmp/test.txt');
      expect(result.success).toBe(true);
      expect(result.output).toBe('file content');
    });
  });

  describe('getFileContent', () => {
    it('should handle invalid filePath', async () => {
      await expect(ssmHandler.getFileContent('')).rejects.toThrow('filePath is required');
    });

    it('should handle non-string filePath', async () => {
      await expect(ssmHandler.getFileContent(null as any)).rejects.toThrow('filePath is required');
    });
  });

  describe('updateFile', () => {
    it('should return true (stub)', async () => {
      const result = await ssmHandler.updateFile('/tmp/test.txt', 'old', 'new');
      expect(result).toBe(true);
    });
  });

  describe('listFiles', () => {
    it('should return mock file list', async () => {
      const result = await ssmHandler.listFiles({ directory: '/tmp' });
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });

    it('should respect limit and offset', async () => {
      const result = await ssmHandler.listFiles({ directory: '/tmp', limit: 5, offset: 2 });
      expect(result.limit).toBe(5);
      expect(result.offset).toBe(2);
    });
  });

  describe('presentWorkingDirectory', () => {
    it('should return mock pwd', async () => {
      const pwd = await ssmHandler.presentWorkingDirectory();
      expect(pwd).toBe('/home/user');
    });
  });

  describe('changeDirectory', () => {
    it('should call changeDirectoryAction and update config on success', async () => {
      const { changeDirectory: changeDirectoryAction } = require('../../../src/handlers/ssm/actions/changeDirectory.ssm');
      changeDirectoryAction.mockResolvedValue(true);

      const result = await ssmHandler.changeDirectory('/new/dir');
      expect(result).toBe(true);
      expect(ssmHandler.serverConfig.directory).toBe('/new/dir');
    });

    it('should not update config on failure', async () => {
      const { changeDirectory: changeDirectoryAction } = require('../../../src/handlers/ssm/actions/changeDirectory.ssm');
      changeDirectoryAction.mockResolvedValue(false);

      const result = await ssmHandler.changeDirectory('/bad/dir');
      expect(result).toBe(false);
      expect(ssmHandler.serverConfig.directory).not.toBe('/bad/dir');
    });
  });

  describe('searchFiles', () => {
    it('should return empty results', async () => {
      const result = await ssmHandler.searchFiles({ query: 'test' });
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('constructor', () => {
    it('should initialize with code property', () => {
      const handler = new SsmServerHandler({
        protocol: 'ssm',
        hostname: 'test',
        instanceId: 'i-123',
        region: 'us-east-1',
        code: true
      });
      expect(handler).toBeInstanceOf(SsmServerHandler);
    });

    it('should handle missing code property', () => {
      const handler = new SsmServerHandler({
        protocol: 'ssm',
        hostname: 'test',
        instanceId: 'i-123',
        region: 'us-east-1'
      });
      expect(handler).toBeInstanceOf(SsmServerHandler);
    });
  });

  describe('setServerConfig', () => {
    it('should update server configuration', () => {
      const newConfig = {
        protocol: 'ssm',
        hostname: 'new-host',
        instanceId: 'i-new',
        region: 'eu-west-1',
        code: false
      };
      ssmHandler.setServerConfig(newConfig);
      expect(ssmHandler.serverConfig.hostname).toBe('new-host');
    });
  });

  describe('configuration', () => {
    it('should create the SSM client with the configured region', async () => {
      mockClient.send.mockRejectedValue(new Error('halt') as any);

      await ssmHandler.executeCommand('echo test');

      expect(MockedSSMClient).toHaveBeenCalledWith({
        region: 'us-east-1'
      });
    });

    it('should handle different regions', async () => {
      const handler = new SsmServerHandler({
        protocol: 'ssm',
        hostname: 'test-instance-2',
        instanceId: 'i-abcdef1234567890',
        region: 'eu-west-1'
      });
      mockClient.send.mockRejectedValue(new Error('halt') as any);

      await handler.executeCommand('echo test');

      expect(MockedSSMClient).toHaveBeenCalledWith({
        region: 'eu-west-1'
      });
    });
  });
});
