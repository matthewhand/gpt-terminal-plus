import { SsmServerHandler } from '../../../src/handlers/ssm/SsmServerHandler';
import { SSMClient, SendCommandCommand, GetCommandInvocationCommand } from '@aws-sdk/client-ssm';

// Mock AWS SDK
jest.mock('@aws-sdk/client-ssm');

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
        exitCode: 0
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
        exitCode: 1
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
        stderr: 'SSM command timeout',
        error: true,
        exitCode: 124
      });
    });

    it('should handle AWS SDK errors', async () => {
      mockClient.send.mockRejectedValue(new Error('AWS SDK Error') as any);

      const result = await ssmHandler.executeCommand('echo test');

      expect(result).toEqual({
        stdout: '',
        stderr: 'Error: AWS SDK Error',
        error: true,
        exitCode: 1
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
      expect(result.exitCode).toBe(1);
    });
  });

  describe('executeCode', () => {
    it('should return placeholder result (SSM executeCode not yet implemented)', async () => {
      const result = await ssmHandler.executeCode('print("Hello from Python")', 'python');

      expect(result).toEqual({
        stdout: 'SSM code executed',
        stderr: '',
        error: false,
        exitCode: 0
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
      expect(result.stderr).toBe('Error: Network error');
      expect(result.exitCode).toBe(1);
    });

    it('should handle thrown command errors', async () => {
      mockClient.send.mockRejectedValue(new Error('Command failed') as any);

      const result = await ssmHandler.executeCommand('failing-command');

      expect(result.error).toBe(true);
      expect(result.stderr).toBe('Error: Command failed');
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
