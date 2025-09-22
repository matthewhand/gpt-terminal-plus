import { ServerConfig } from '../src/types/ServerConfig';
import { SystemInfo } from '../src/types/SystemInfo';
import { CommandRequest, ExecutionResult } from '../src/types/api';
import { FileOperation } from '../src/engines/fileEngine';
import { ChatMessage, ChatRequest, ChatResponse } from '../src/llm/types';
import { getSystemInfo as getLocalSystemInfo } from '../src/handlers/local/actions/getSystemInfo';
import { executeFileOperation } from '../src/engines/fileEngine';
import path from 'path';
import fs from 'fs/promises';

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

    it('supports write/read/list/delete/mkdir within allowed paths', async () => {
      const baseDir = path.join(process.cwd(), 'tmp-types-test');
      const filePath = path.join(baseDir, 'note.txt');

      // mkdir
      await expect(executeFileOperation({ type: 'mkdir', path: baseDir, recursive: true })).resolves.toEqual({ success: true });

      // write
      await expect(
        executeFileOperation({ type: 'write', path: filePath, content: 'hello' })
      ).resolves.toEqual({ success: true });

      // read
      await expect(executeFileOperation({ type: 'read', path: filePath })).resolves.toEqual({ content: 'hello', success: true });

      // list
      const listed = await executeFileOperation({ type: 'list', path: baseDir });
      expect(listed.success).toBe(true);
      expect(Array.isArray(listed.files)).toBe(true);
      expect(listed.files.find((e: any) => e.name === 'note.txt')?.isDirectory).toBe(false);

      // delete
      await expect(executeFileOperation({ type: 'delete', path: filePath })).resolves.toEqual({ success: true });

      // cleanup
      await fs.rmdir(baseDir).catch(() => void 0);
    });
  });

  describe('SystemInfo', () => {
    it('matches runtime contract from getSystemInfo()', async () => {
      const info: SystemInfo = await getLocalSystemInfo();
      expect(typeof info.type).toBe('string');
      expect(typeof info.platform).toBe('string');
      expect(typeof info.architecture).toBe('string');
      expect(typeof info.totalMemory).toBe('number');
      expect(typeof info.freeMemory).toBe('number');
      expect(typeof info.uptime).toBe('number');
      expect(typeof info.currentFolder).toBe('string');
      expect(info.totalMemory).toBeGreaterThan(0);
      expect(info.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  // Note: Session types are validated through dedicated session driver tests

  describe('Barrel Exports from src/types.ts', () => {
    it('should re-export ServerConfig type correctly', () => {
      const { ServerConfig } = require('@src/types');
      expect(typeof ServerConfig).toBe('function'); // Type constructor
      const config: ServerConfig = {
        hostname: 'test',
        protocol: 'local',
        llm: { provider: 'test', baseUrl: 'http://test' }
      };
      expect(config).toBeDefined();
    });

    it('should re-export CommandRequest and ExecutionResult types', () => {
      const { CommandRequest, ExecutionResult } = require('@src/types');
      expect(typeof CommandRequest).toBe('function');
      expect(typeof ExecutionResult).toBe('function');
      
      const request: CommandRequest = { command: 'test' };
      const result: ExecutionResult = { success: true, stdout: '', stderr: '', exitCode: 0, error: false };
      expect(request).toBeDefined();
      expect(result).toBeDefined();
    });

    it('should re-export Chat types without errors', () => {
      const { ChatMessage, ChatRequest, ChatResponse } = require('@src/types');
      expect(typeof ChatMessage).toBe('function');
      expect(typeof ChatRequest).toBe('function');
      expect(typeof ChatResponse).toBe('function');
    });

    it('should re-export FileOperation type', () => {
      const { FileOperation } = require('@src/types');
      expect(typeof FileOperation).toBe('function');
      const op: FileOperation = { type: 'read', path: '/test' };
      expect(op).toBeDefined();
    });

    it('should re-export SystemInfo type', () => {
      const { SystemInfo } = require('@src/types');
      expect(typeof SystemInfo).toBe('function');
    });
  });
});
