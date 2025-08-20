import { analyzeError, ErrorContext } from '../../src/llm/errorAdvisor';
import * as llmIndex from '../../src/llm/index';
import * as models from '../../src/common/models';
import * as globalStateHelper from '../../src/utils/GlobalStateHelper';

// Mock dependencies
jest.mock('../../src/llm/index');
jest.mock('../../src/common/models');
jest.mock('../../src/utils/GlobalStateHelper');

const mockChat = llmIndex.chat as jest.MockedFunction<typeof llmIndex.chat>;
const mockGetSupportedModels = models.getSupportedModels as jest.MockedFunction<typeof models.getSupportedModels>;
const mockGetSelectedModel = globalStateHelper.getSelectedModel as jest.MockedFunction<typeof globalStateHelper.getSelectedModel>;

describe('Error Advisor', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.clearAllMocks();
    
    // Default mocks
    mockGetSupportedModels.mockReturnValue(['gpt-oss:20b', 'llama3.1', 'gpt-4']);
    mockGetSelectedModel.mockReturnValue('llama3.1');
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('analyzeError', () => {
    describe('environment variable control', () => {
      it('should return undefined when AUTO_ANALYZE_ERRORS is false', async () => {
        process.env.AUTO_ANALYZE_ERRORS = 'false';
        
        const context: ErrorContext = {
          kind: 'command',
          input: 'rm nonexistent',
          stderr: 'No such file or directory',
          exitCode: 1
        };

        const result = await analyzeError(context);
        expect(result).toBeUndefined();
        expect(mockChat).not.toHaveBeenCalled();
      });

      it('should analyze errors when AUTO_ANALYZE_ERRORS is not false', async () => {
        process.env.AUTO_ANALYZE_ERRORS = 'true';
        
        mockChat.mockResolvedValue({
          choices: [{
            message: {
              content: 'The file does not exist. Try checking the path.'
            }
          }]
        } as any);

        const context: ErrorContext = {
          kind: 'command',
          input: 'rm nonexistent',
          stderr: 'No such file or directory',
          exitCode: 1
        };

        const result = await analyzeError(context);
        expect(result).toBeDefined();
        expect(result?.text).toBe('The file does not exist. Try checking the path.');
        expect(mockChat).toHaveBeenCalled();
      });

      it('should analyze errors by default when AUTO_ANALYZE_ERRORS is not set', async () => {
        delete process.env.AUTO_ANALYZE_ERRORS;
        
        mockChat.mockResolvedValue({
          choices: [{
            message: {
              content: 'Analysis result'
            }
          }]
        } as any);

        const context: ErrorContext = {
          kind: 'command',
          input: 'test command',
          stderr: 'error',
          exitCode: 1
        };

        const result = await analyzeError(context);
        expect(result).toBeDefined();
        expect(mockChat).toHaveBeenCalled();
      });
    });

    describe('model selection', () => {
      beforeEach(() => {
        process.env.AUTO_ANALYZE_ERRORS = 'true';
      });

      it('should prefer gpt-oss:20b when available', async () => {
        mockGetSupportedModels.mockReturnValue(['gpt-oss:20b', 'llama3.1', 'gpt-4']);
        
        mockChat.mockResolvedValue({
          choices: [{
            message: {
              content: 'Analysis with preferred model'
            }
          }]
        } as any);

        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stderr: 'error',
          exitCode: 1
        };

        const result = await analyzeError(context);
        
        expect(mockChat).toHaveBeenCalledWith(
          expect.objectContaining({
            model: 'gpt-oss:20b'
          })
        );
        expect(result?.model).toBe('gpt-oss:20b');
      });

      it('should fall back to selected model when gpt-oss:20b is not available', async () => {
        mockGetSupportedModels.mockReturnValue(['llama3.1', 'gpt-4']);
        mockGetSelectedModel.mockReturnValue('gpt-4');
        
        mockChat.mockResolvedValue({
          choices: [{
            message: {
              content: 'Analysis with fallback model'
            }
          }]
        } as any);

        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stderr: 'error',
          exitCode: 1
        };

        const result = await analyzeError(context);
        
        expect(mockChat).toHaveBeenCalledWith(
          expect.objectContaining({
            model: 'gpt-4'
          })
        );
        expect(result?.model).toBe('gpt-4');
      });
    });

    describe('context handling', () => {
      beforeEach(() => {
        process.env.AUTO_ANALYZE_ERRORS = 'true';
        mockChat.mockResolvedValue({
          choices: [{
            message: {
              content: 'Analysis result'
            }
          }]
        } as any);
      });

      it('should handle command context', async () => {
        const context: ErrorContext = {
          kind: 'command',
          input: 'ls /nonexistent',
          stderr: 'No such file or directory',
          exitCode: 2,
          cwd: '/home/user'
        };

        await analyzeError(context);

        expect(mockChat).toHaveBeenCalledWith(
          expect.objectContaining({
            messages: expect.arrayContaining([
              expect.objectContaining({
                role: 'user',
                content: expect.stringContaining('"context":"command"')
              })
            ])
          })
        );
      });

      it('should handle code context with language', async () => {
        const context: ErrorContext = {
          kind: 'code',
          input: 'print("hello"',
          language: 'python',
          stderr: 'SyntaxError: unexpected EOF',
          exitCode: 1
        };

        await analyzeError(context);

        expect(mockChat).toHaveBeenCalledWith(
          expect.objectContaining({
            messages: expect.arrayContaining([
              expect.objectContaining({
                role: 'user',
                content: expect.stringContaining('"language":"python"')
              })
            ])
          })
        );
      });

      it('should handle file context', async () => {
        const context: ErrorContext = {
          kind: 'file',
          input: '/path/to/script.sh',
          stderr: 'Permission denied',
          exitCode: 126
        };

        await analyzeError(context);

        expect(mockChat).toHaveBeenCalledWith(
          expect.objectContaining({
            messages: expect.arrayContaining([
              expect.objectContaining({
                role: 'user',
                content: expect.stringContaining('"context":"file"')
              })
            ])
          })
        );
      });

      it('should include all context fields in the analysis request', async () => {
        const context: ErrorContext = {
          kind: 'command',
          input: 'complex command',
          stdout: 'some output',
          stderr: 'error message',
          exitCode: 1,
          cwd: '/working/directory'
        };

        await analyzeError(context);

        const callArgs = mockChat.mock.calls[0][0];
        const userMessage = callArgs.messages.find((m: any) => m.role === 'user');
        expect(userMessage).toBeDefined();
        const content = JSON.parse(userMessage!.content);

        expect(content).toMatchObject({
          task: 'Analyze failure and propose fixes',
          context: 'command',
          input: 'complex command',
          exitCode: 1,
          stderr: 'error message',
          stdout: 'some output',
          cwd: '/working/directory'
        });
      });
    });

    describe('output truncation', () => {
      beforeEach(() => {
        process.env.AUTO_ANALYZE_ERRORS = 'true';
        mockChat.mockResolvedValue({
          choices: [{
            message: {
              content: 'Analysis result'
            }
          }]
        } as any);
      });

      it('should truncate long stderr output', async () => {
        const longStderr = 'error '.repeat(2000); // > 8000 chars
        
        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stderr: longStderr,
          exitCode: 1
        };

        await analyzeError(context);

        const callArgs = mockChat.mock.calls[0][0];
        const userMessage = callArgs.messages.find((m: any) => m.role === 'user');
        expect(userMessage).toBeDefined();
        const content = JSON.parse(userMessage!.content);

        expect(content.stderr).toContain('... (truncated)');
        expect(content.stderr.length).toBeLessThan(longStderr.length);
      });

      it('should truncate long stdout output', async () => {
        const longStdout = 'output '.repeat(500); // > 2000 chars
        
        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stdout: longStdout,
          stderr: 'error',
          exitCode: 1
        };

        await analyzeError(context);

        const callArgs = mockChat.mock.calls[0][0];
        const userMessage = callArgs.messages.find((m: any) => m.role === 'user');
        expect(userMessage).toBeDefined();
        const content = JSON.parse(userMessage!.content);

        expect(content.stdout).toContain('... (truncated)');
        expect(content.stdout.length).toBeLessThan(longStdout.length);
      });

      it('should not truncate short outputs', async () => {
        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stdout: 'short output',
          stderr: 'short error',
          exitCode: 1
        };

        await analyzeError(context);

        const callArgs = mockChat.mock.calls[0][0];
        const userMessage = callArgs.messages.find((m: any) => m.role === 'user');
        expect(userMessage).toBeDefined();
        const content = JSON.parse(userMessage!.content);

        expect(content.stdout).toBe('short output');
        expect(content.stderr).toBe('short error');
        expect(content.stdout).not.toContain('... (truncated)');
        expect(content.stderr).not.toContain('... (truncated)');
      });
    });

    describe('error handling', () => {
      beforeEach(() => {
        process.env.AUTO_ANALYZE_ERRORS = 'true';
      });

      it('should return undefined when chat throws an error', async () => {
        mockChat.mockRejectedValue(new Error('API error'));

        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stderr: 'error',
          exitCode: 1
        };

        const result = await analyzeError(context);
        expect(result).toBeUndefined();
      });

      it('should handle empty response gracefully', async () => {
        mockChat.mockResolvedValue({
          choices: []
        } as any);

        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stderr: 'error',
          exitCode: 1
        };

        const result = await analyzeError(context);
        expect(result?.text).toBe('');
      });

      it('should handle missing message content', async () => {
        mockChat.mockResolvedValue({
          choices: [{
            message: {}
          }]
        } as any);

        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stderr: 'error',
          exitCode: 1
        };

        const result = await analyzeError(context);
        expect(result?.text).toBe('');
      });
    });

    describe('system prompt', () => {
      beforeEach(() => {
        process.env.AUTO_ANALYZE_ERRORS = 'true';
        mockChat.mockResolvedValue({
          choices: [{
            message: {
              content: 'Analysis result'
            }
          }]
        } as any);
      });

      it('should include appropriate system prompt', async () => {
        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stderr: 'error',
          exitCode: 1
        };

        await analyzeError(context);

        const callArgs = mockChat.mock.calls[0][0];
        const systemMessage = callArgs.messages.find((m: any) => m.role === 'system');

        expect(systemMessage).toBeDefined();
        expect(systemMessage!.content).toContain('expert devops and software engineer');
        expect(systemMessage!.content).toContain('Analyze the failure output');
        expect(systemMessage!.content).toContain('actionable fixes');
      });
    });

    describe('edge cases', () => {
      beforeEach(() => {
        process.env.AUTO_ANALYZE_ERRORS = 'true';
      });

      it('should handle undefined stderr and stdout', async () => {
        mockChat.mockResolvedValue({
          choices: [{
            message: {
              content: 'Analysis result'
            }
          }]
        } as any);

        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          exitCode: 1
        };

        const result = await analyzeError(context);
        expect(result).toBeDefined();
        
        const callArgs = mockChat.mock.calls[0][0];
        const userMessage = callArgs.messages.find((m: any) => m.role === 'user');
        expect(userMessage).toBeDefined();
        const content = JSON.parse(userMessage!.content);
        
        expect(content.stderr).toBeUndefined();
        expect(content.stdout).toBeUndefined();
      });

      it('should handle missing exit code', async () => {
        mockChat.mockResolvedValue({
          choices: [{
            message: {
              content: 'Analysis result'
            }
          }]
        } as any);

        const context: ErrorContext = {
          kind: 'command',
          input: 'test',
          stderr: 'error'
        };

        const result = await analyzeError(context);
        expect(result).toBeDefined();
      });
    });
  });
});
