import { ServerConfig } from '../src/types/ServerConfig';
import { SystemInfo } from '../src/types/SystemInfo';
import { CommandRequest, ExecutionResult } from '../src/types/api';
import { FileOperation } from '../src/engines/fileEngine';
import { ChatMessage, ChatRequest, ChatResponse } from '../src/llm/types';

describe('Type Definitions', () => {
  describe('ServerConfig', () => {
    it('should validate required properties', () => {
      const config: ServerConfig = {
        hostname: 'localhost',
        protocol: 'local',
        llm: {
          provider: 'ollama',
          baseUrl: 'http://localhost:11434'
        }
      };
      
      expect(config.hostname).toBe('localhost');
      expect(config.protocol).toBe('local');
      expect(config.llm.provider).toBe('ollama');
    });

    it('should support SSH protocol configuration', () => {
      const sshConfig: ServerConfig = {
        hostname: 'remote.server.com',
        protocol: 'ssh',
        username: 'user',
        port: 22,
        llm: {
          provider: 'openai',
          baseUrl: 'https://api.openai.com'
        }
      };
      
      expect(sshConfig.protocol).toBe('ssh');
      expect(sshConfig.username).toBe('user');
      expect(sshConfig.port).toBe(22);
    });
  });

  describe('CommandRequest', () => {
    it('should validate command execution request', () => {
      const request: CommandRequest = {
        command: 'ls -la',
        directory: '/home/user'
      };

      expect(request.command).toBe('ls -la');
      expect(request.directory).toBe('/home/user');
    });

    it('should support optional args and timeout', () => {
      const request: CommandRequest = {
        command: 'echo',
        args: ['hello'],
        timeout: 5000
      };

      expect(request.args).toEqual(['hello']);
      expect(request.timeout).toBe(5000);
    });
  });

  describe('ExecutionResult', () => {
    it('should validate successful execution result', () => {
      const response: ExecutionResult = {
        success: true,
        stdout: 'Command output',
        stderr: '',
        exitCode: 0,
        error: false
      };

      expect(response.success).toBe(true);
      expect(response.exitCode).toBe(0);
      expect(response.error).toBe(false);
    });

    it('should validate error execution result', () => {
      const response: ExecutionResult = {
        success: false,
        stdout: '',
        stderr: 'Command not found',
        exitCode: 127,
        error: true,
        truncated: false,
        terminated: false
      };

      expect(response.success).toBe(false);
      expect(response.exitCode).toBe(127);
      expect(response.error).toBe(true);
    });
  });

  describe('ChatMessage', () => {
    it('should validate user message', () => {
      const message: ChatMessage = {
        role: 'user',
        content: 'Hello, how can I help?'
      };
      
      expect(message.role).toBe('user');
      expect(message.content).toBe('Hello, how can I help?');
    });

    it('should validate assistant message', () => {
      const message: ChatMessage = {
        role: 'assistant',
        content: 'I can help you with various tasks.'
      };
      
      expect(message.role).toBe('assistant');
      expect(message.content).toBe('I can help you with various tasks.');
    });
  });

  describe('ChatRequest', () => {
    it('should validate chat request with messages', () => {
      const request: ChatRequest = {
        messages: [
          { role: 'user', content: 'Test message' }
        ],
        model: 'gpt-3.5-turbo'
      };
      
      expect(request.messages).toHaveLength(1);
      expect(request.model).toBe('gpt-3.5-turbo');
    });

    it('should support streaming option', () => {
      const request: ChatRequest = {
        messages: [{ role: 'user', content: 'Test' }],
        stream: true
      };
      
      expect(request.stream).toBe(true);
    });
  });

  describe('FileOperation', () => {
    it('should validate read operation', () => {
      const operation: FileOperation = {
        type: 'read',
        path: '/path/to/file.txt'
      };
      
      expect(operation.type).toBe('read');
      expect(operation.path).toBe('/path/to/file.txt');
    });

    it('should validate write operation with content', () => {
      const operation: FileOperation = {
        type: 'write',
        path: '/path/to/file.txt',
        content: 'File content'
      };
      
      expect(operation.type).toBe('write');
      expect(operation.content).toBe('File content');
    });
  });

  describe('SystemInfo', () => {
    it('should validate system information structure', () => {
      const info: SystemInfo = {
        platform: 'linux',
        arch: 'x64',
        hostname: 'test-server',
        uptime: 86400,
        memory: {
          total: 8589934592,
          free: 4294967296
        }
      };
      
      expect(info.platform).toBe('linux');
      expect(info.arch).toBe('x64');
      expect(info.memory.total).toBe(8589934592);
    });
  });

  // Note: Session types are validated through dedicated session driver tests
});
