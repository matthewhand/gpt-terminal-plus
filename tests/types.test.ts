import {
  ServerConfig,
  ExecuteRequest,
  ExecuteResponse,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  FileOperation,
  SystemInfo,
  SessionInfo
} from '../src/types';

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

  describe('ExecuteRequest', () => {
    it('should validate command execution request', () => {
      const request: ExecuteRequest = {
        command: 'ls -la',
        workingDirectory: '/home/user'
      };
      
      expect(request.command).toBe('ls -la');
      expect(request.workingDirectory).toBe('/home/user');
    });

    it('should support optional environment variables', () => {
      const request: ExecuteRequest = {
        command: 'echo $TEST_VAR',
        environment: {
          TEST_VAR: 'test_value'
        }
      };
      
      expect(request.environment?.TEST_VAR).toBe('test_value');
    });
  });

  describe('ExecuteResponse', () => {
    it('should validate successful execution response', () => {
      const response: ExecuteResponse = {
        success: true,
        stdout: 'Command output',
        stderr: '',
        exitCode: 0,
        executionTime: 1500
      };
      
      expect(response.success).toBe(true);
      expect(response.exitCode).toBe(0);
      expect(response.executionTime).toBe(1500);
    });

    it('should validate error execution response', () => {
      const response: ExecuteResponse = {
        success: false,
        stdout: '',
        stderr: 'Command not found',
        exitCode: 127,
        error: 'Command execution failed'
      };
      
      expect(response.success).toBe(false);
      expect(response.exitCode).toBe(127);
      expect(response.error).toBe('Command execution failed');
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

  describe('SessionInfo', () => {
    it('should validate session information', () => {
      const session: SessionInfo = {
        id: 'session-123',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        lastActivity: new Date('2024-01-01T01:00:00Z'),
        status: 'active'
      };
      
      expect(session.id).toBe('session-123');
      expect(session.status).toBe('active');
      expect(session.createdAt).toBeInstanceOf(Date);
    });
  });
});