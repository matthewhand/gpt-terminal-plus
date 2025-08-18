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
        success: true,
        output: 'Hello World',
        error: '',
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
        success: false,
        output: '',
        error: 'Command not found',
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

      // Mock setTimeout to immediately call the callback
      jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        callback();
        return {} as any;
      });

      const result = await ssmHandler.executeCommand('sleep 100', 1000);

      expect(result).toEqual({
        success: false,
        output: '',
        error: 'Command execution timed out',
        exitCode: -1
      });

      // Restore setTimeout
      jest.restoreAllMocks();
    });

    it('should handle AWS SDK errors', async () => {
      mockClient.send.mockRejectedValue(new Error('AWS SDK Error') as any);

      const result = await ssmHandler.executeCommand('echo test');

      expect(result).toEqual({
        success: false,
        output: '',
        error: 'AWS SDK Error',
        exitCode: -1
      });
    });

    it('should handle missing command ID in response', async () => {
      const mockSendResponse = {
        Command: {}
      };

      mockClient.send.mockResolvedValueOnce(mockSendResponse as any);

      const result = await ssmHandler.executeCommand('echo test');

      expect(result).toEqual({
        success: false,
        output: '',
        error: 'Failed to get command ID from AWS response',
        exitCode: -1
      });
    });
  });

  describe('executeCode', () => {
    it('should execute Python code successfully', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Success',
        StandardOutputContent: 'Hello from Python',
        StandardErrorContent: '',
        ResponseCode: 0
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.executeCode('print("Hello from Python")', 'python');

      expect(result).toEqual({
        success: true,
        output: 'Hello from Python',
        error: '',
        exitCode: 0
      });
    });

    it('should handle code execution errors', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Failed',
        StandardOutputContent: '',
        StandardErrorContent: 'SyntaxError: invalid syntax',
        ResponseCode: 1
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.executeCode('print(', 'python');

      expect(result).toEqual({
        success: false,
        output: '',
        error: 'SyntaxError: invalid syntax',
        exitCode: 1
      });
    });
  });

  describe('createFile', () => {
    it('should create file successfully', async () => {
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

      const result = await ssmHandler.createFile('/tmp/test.txt');

      expect(result).toEqual({
        success: true,
        output: '',
        error: '',
        exitCode: 0
      });
    });

    it('should handle file creation errors', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Failed',
        StandardOutputContent: '',
        StandardErrorContent: 'Permission denied',
        ResponseCode: 1
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.createFile('/root/test.txt');

      expect(result).toEqual({
        success: false,
        output: '',
        error: 'Permission denied',
        exitCode: 1
      });
    });
  });

  describe('getSystemInfo', () => {
    it('should get system info successfully', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      const mockInvocationResponse = {
        Status: 'Success',
        StandardOutputContent: 'Linux ip-10-0-1-100 5.4.0-1043-aws #45-Ubuntu',
        StandardErrorContent: '',
        ResponseCode: 0
      };

      mockClient.send
        .mockResolvedValueOnce(mockSendResponse as any)
        .mockResolvedValueOnce(mockInvocationResponse as any);

      const result = await ssmHandler.getSystemInfo();

      expect(result).toEqual({
        success: true,
        output: 'Linux ip-10-0-1-100 5.4.0-1043-aws #45-Ubuntu',
        error: '',
        exitCode: 0
      });
    });

    it('should handle system info errors', async () => {
      mockClient.send.mockRejectedValue(new Error('System info unavailable') as any);

      const result = await ssmHandler.getSystemInfo();

      expect(result).toEqual({
        success: false,
        output: '',
        error: 'System info unavailable',
        exitCode: -1
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

      expect(result).toEqual({
        success: true,
        output: 'File content here',
        error: '',
        exitCode: 0
      });
    });

    it('should handle file read errors', async () => {
      mockClient.send.mockRejectedValue(new Error('Permission denied') as any);

      const result = await ssmHandler.getFileContent('/root/secret.txt');

      expect(result).toEqual({
        success: false,
        output: '',
        error: 'Permission denied',
        exitCode: -1
      });
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockClient.send.mockRejectedValue(new Error('Network error') as any);

      const result = await ssmHandler.executeCommand('echo test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
      expect(result.exitCode).toBe(-1);
    });

    it('should handle timeout errors', async () => {
      mockClient.send.mockRejectedValue(new Error('Command failed') as any);

      const result = await ssmHandler.executeCommand('failing-command');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Command failed');
    });
  });

  describe('configuration', () => {
    it('should use correct instance ID and region', () => {
      expect(MockedSSMClient).toHaveBeenCalledWith({
        region: 'us-east-1'
      });
    });

    it('should handle different regions', () => {
      const handler = new SsmServerHandler({
        protocol: 'ssm',
        hostname: 'test-instance-2',
        instanceId: 'i-abcdef1234567890',
        region: 'eu-west-1'
      });

      expect(MockedSSMClient).toHaveBeenCalledWith({
        region: 'eu-west-1'
      });
    });
  });
});
