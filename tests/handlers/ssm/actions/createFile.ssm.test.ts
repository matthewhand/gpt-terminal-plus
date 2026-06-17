import { createFile, generateUniqueDelimiter } from '../../../src/handlers/ssm/actions/createFile.ssm';
import { SSMClient, SendCommandCommand } from '@aws-sdk/client-ssm';

// Mock AWS SDK
jest.mock('@aws-sdk/client-ssm');

const MockedSSMClient = SSMClient as jest.MockedClass<typeof SSMClient>;

describe('createFile.ssm', () => {
  let mockClient: jest.Mocked<SSMClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockClient = {
      send: jest.fn()
    } as any;

    MockedSSMClient.mockImplementation(() => mockClient);
  });

  describe('generateUniqueDelimiter', () => {
    it('should return EOF if not in content', () => {
      const delimiter = generateUniqueDelimiter('some content');
      expect(delimiter).toBe('EOF');
    });

    it('should generate unique delimiter if EOF is in content', () => {
      const content = 'content with EOF in it';
      const delimiter = generateUniqueDelimiter(content);
      expect(delimiter).not.toBe('EOF');
      expect(delimiter.startsWith('EOF_')).toBe(true);
      expect(content.includes(delimiter)).toBe(false);
    });

    it('should handle multiple conflicts', () => {
      let content = 'EOF';
      for (let i = 0; i < 10; i++) {
        const delimiter = generateUniqueDelimiter(content);
        expect(content.includes(delimiter)).toBe(false);
        content += ' ' + delimiter;
      }
    });
  });

  describe('createFile', () => {
    it('should create file with backup enabled by default', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      mockClient.send.mockResolvedValue(mockSendResponse as any);

      const result = await createFile(mockClient, 'i-123', '/tmp/test.txt', 'file content');

      expect(result).toBe(true);
      expect(mockClient.send).toHaveBeenCalledWith(expect.any(SendCommandCommand));
      const command = (mockClient.send as jest.Mock).mock.calls[0][0] as SendCommandCommand;
      expect(command.input.Parameters?.commands?.[0]).toContain('cp /tmp/test.txt /tmp/test.txt.bak');
      expect(command.input.Parameters?.commands?.[0]).toContain("cat <<'EOF' > /tmp/test.txt");
      expect(command.input.Parameters?.commands?.[0]).toContain('file content');
    });

    it('should create file without backup when disabled', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      mockClient.send.mockResolvedValue(mockSendResponse as any);

      const result = await createFile(mockClient, 'i-123', '/tmp/test.txt', 'file content', false);

      expect(result).toBe(true);
      const command = (mockClient.send as jest.Mock).mock.calls[0][0] as SendCommandCommand;
      expect(command.input.Parameters?.commands?.[0]).not.toContain('cp /tmp/test.txt /tmp/test.txt.bak');
    });

    it('should handle content with EOF delimiter', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      mockClient.send.mockResolvedValue(mockSendResponse as any);

      const content = 'content with EOF in it';
      const result = await createFile(mockClient, 'i-123', '/tmp/test.txt', content);

      expect(result).toBe(true);
      const command = (mockClient.send as jest.Mock).mock.calls[0][0] as SendCommandCommand;
      const cmdStr = command.input.Parameters?.commands?.[0] || '';
      const delimiterMatch = cmdStr.match(/cat <<'([^']+)'/);
      expect(delimiterMatch).toBeTruthy();
      const delimiter = delimiterMatch![1];
      expect(delimiter).not.toBe('EOF');
      expect(content.includes(delimiter)).toBe(false);
      expect(cmdStr).toContain(delimiter);
    });

    it('should return false on SSM error', async () => {
      mockClient.send.mockRejectedValue(new Error('SSM error'));

      const result = await createFile(mockClient, 'i-123', '/tmp/test.txt', 'content');

      expect(result).toBe(false);
    });

    it('should return false if no command in response', async () => {
      const mockSendResponse = {};

      mockClient.send.mockResolvedValue(mockSendResponse as any);

      const result = await createFile(mockClient, 'i-123', '/tmp/test.txt', 'content');

      expect(result).toBe(false);
    });

    it('should use correct instance ID and document', async () => {
      const mockSendResponse = {
        Command: {
          CommandId: 'test-command-id'
        }
      };

      mockClient.send.mockResolvedValue(mockSendResponse as any);

      await createFile(mockClient, 'i-456', '/path/file.txt', 'content');

      const command = (mockClient.send as jest.Mock).mock.calls[0][0] as SendCommandCommand;
      expect(command.input.InstanceIds).toEqual(['i-456']);
      expect(command.input.DocumentName).toBe('AWS-RunShellScript');
    });
  });
});