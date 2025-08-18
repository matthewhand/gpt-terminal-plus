import { Request, Response } from 'express';
import { executeLlm } from '../../../src/routes/command/executeLlm';
import * as GlobalStateHelper from '../../../src/utils/GlobalStateHelper';
import { ServerManager } from '../../../src/managers/ServerManager';
import * as llm from '../../../src/llm';
import * as getServerHandler from '../../../src/utils/getServerHandler';
import * as errorAdvisor from '../../../src/llm/errorAdvisor';
import * as safety from '../../../src/utils/safety';

// Mock all dependencies
jest.mock('../../../src/utils/GlobalStateHelper');
jest.mock('../../../src/managers/ServerManager');
jest.mock('../../../src/llm');
jest.mock('../../../src/utils/getServerHandler');
jest.mock('../../../src/llm/errorAdvisor');
jest.mock('../../../src/utils/safety');

const mockGlobalStateHelper = GlobalStateHelper as jest.Mocked<typeof GlobalStateHelper>;
const mockServerManager = ServerManager as jest.Mocked<typeof ServerManager>;
const mockLlm = llm as jest.Mocked<typeof llm>;
const mockGetServerHandler = getServerHandler as jest.Mocked<typeof getServerHandler>;
const mockErrorAdvisor = errorAdvisor as jest.Mocked<typeof errorAdvisor>;
const mockSafety = safety as jest.Mocked<typeof safety>;

describe('ExecuteLlm Handler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockServerHandler: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
      on: jest.fn()
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      write: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis()
    };

    mockServerHandler = {
      executeCommand: jest.fn(),
      presentWorkingDirectory: jest.fn().mockResolvedValue('/home/user')
    };

    // Default mocks
    mockGlobalStateHelper.getSelectedServer.mockReturnValue('localhost');
    mockGlobalStateHelper.getSelectedModel.mockReturnValue('gpt-4');
    mockServerManager.getServerConfig.mockReturnValue({
      protocol: 'local',
      hostname: 'localhost'
    });
    mockGetServerHandler.getServerHandler.mockReturnValue(mockServerHandler);
    mockSafety.evaluateCommandSafety.mockReturnValue({
      hardDeny: false,
      needsConfirm: false,
      reasons: []
    });
  });

  describe('input validation', () => {
    it('should return 400 for missing instructions', async () => {
      mockRequest.body = {};

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'instructions is required'
      });
    });

    it('should return 400 for empty instructions', async () => {
      mockRequest.body = { instructions: '' };

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'instructions is required'
      });
    });

    it('should return 400 for non-string instructions', async () => {
      mockRequest.body = { instructions: 123 };

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'instructions is required'
      });
    });

    it('should accept valid instructions', async () => {
      mockRequest.body = { 
        instructions: 'list files',
        dryRun: true
      };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: {
            role: 'assistant',
            content: '{"commands":[{"cmd":"ls -la","explain":"List files"}]}'
          }
        }]
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('server configuration validation', () => {
    it('should return 500 for missing server config', async () => {
      mockRequest.body = { instructions: 'test command' };
      mockServerManager.getServerConfig.mockReturnValue(undefined);

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Selected server not found in config'
      });
    });

    it('should handle local server protocol', async () => {
      mockRequest.body = { 
        instructions: 'test command',
        dryRun: true
      };

      mockServerManager.getServerConfig.mockReturnValue({
        protocol: 'local',
        hostname: 'localhost'
      });

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: { role: 'assistant', content: '{"commands":[]}' }
        }]
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should reject SSH without proper LLM config', async () => {
      mockRequest.body = { instructions: 'test command' };

      mockServerManager.getServerConfig.mockReturnValue({
        protocol: 'ssh',
        hostname: 'remote-host'
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(501);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'execute-llm requires per-server LLM config (ollama) for SSH hosts'
      });
    });

    it('should accept SSH with proper LLM config', async () => {
      mockRequest.body = { 
        instructions: 'test command',
        dryRun: true
      };

      mockServerManager.getServerConfig.mockReturnValue({
        protocol: 'ssh',
        hostname: 'remote-host',
        llm: {
          provider: 'ollama',
          baseUrl: 'http://localhost:11434'
        }
      });

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'ollama',
        choices: [{ index: 0,
          message: { role: 'assistant', content: '{"commands":[]}' }
        }]
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should reject SSM streaming', async () => {
      mockRequest.body = { 
        instructions: 'test command',
        stream: true
      };

      mockServerManager.getServerConfig.mockReturnValue({
        protocol: 'ssm',
        hostname: 'ssm-instance'
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(501);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'execute-llm streaming is not supported for SSM protocol'
      });
    });
  });

  describe('LLM interaction', () => {
    beforeEach(() => {
      mockRequest.body = { instructions: 'list files' };
    });

    it('should call LLM with proper system and user messages', async () => {
      mockRequest.body = { 
        instructions: 'list files',
        dryRun: true
      };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: { role: 'assistant', content: '{"commands":[]}' }
        }]
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockLlm.chatForServer).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          model: 'gpt-4',
          messages: [
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('translate natural language instructions')
            }),
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('list files')
            })
          ]
        })
      );
    });

    it('should use custom model when provided', async () => {
      mockRequest.body = { 
        instructions: 'test',
        model: 'custom-model',
        dryRun: true
      };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0, message: { role: 'assistant', content: '{"commands":[]}' } }]
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockLlm.chatForServer).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          model: 'custom-model'
        })
      );
    });

    it('should handle LLM errors in non-streaming mode', async () => {
      mockLlm.chatForServer.mockRejectedValue(new Error('LLM service unavailable'));

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'execute-llm failed',
        message: 'LLM service unavailable'
      });
    });

    it('should handle LLM errors in streaming mode', async () => {
      mockRequest.body = { 
        instructions: 'test',
        stream: true
      };

      mockLlm.chatForServer.mockRejectedValue(new Error('LLM error'));

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('event: error')
      );
      expect(mockResponse.end).toHaveBeenCalled();
    });
  });

  describe('command parsing and safety', () => {
    it('should parse valid JSON commands', async () => {
      mockRequest.body = { 
        instructions: 'list files',
        dryRun: true
      };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: {
            content: '{"commands":[{"cmd":"ls -la","explain":"List all files"}]}'
          }
        }]
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          plan: expect.objectContaining({
            commands: [
              { cmd: 'ls -la', explain: 'List all files' }
            ]
          })
        })
      );
    });

    it('should handle malformed JSON gracefully', async () => {
      mockRequest.body = { 
        instructions: 'test',
        dryRun: true
      };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: { role: 'assistant', content: 'invalid json response' }
        }]
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          plan: expect.objectContaining({
            commands: []
          })
        })
      );
    });

    it('should block commands with hard deny', async () => {
      mockRequest.body = { instructions: 'delete everything' };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: {
            content: '{"commands":[{"cmd":"rm -rf /","explain":"Delete everything"}]}'
          }
        }]
      });

      mockSafety.evaluateCommandSafety.mockReturnValue({
        hardDeny: true,
        needsConfirm: false,
        reasons: ['Destructive command']
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Plan blocked by policy (deny)'
        })
      );
    });

    it('should require confirmation for risky commands', async () => {
      mockRequest.body = { instructions: 'install package' };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: {
            content: '{"commands":[{"cmd":"sudo apt install package","explain":"Install package"}]}'
          }
        }]
      });

      mockSafety.evaluateCommandSafety.mockReturnValue({
        hardDeny: false,
        needsConfirm: true,
        reasons: ['Requires sudo']
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Confirmation required to proceed'
        })
      );
    });

    it('should proceed with confirmation flag', async () => {
      mockRequest.body = { 
        instructions: 'install package',
        confirm: true
      };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: {
            content: '{"commands":[{"cmd":"sudo apt install package","explain":"Install package"}]}'
          }
        }]
      });

      mockSafety.evaluateCommandSafety.mockReturnValue({
        hardDeny: false,
        needsConfirm: true,
        reasons: ['Requires sudo']
      });

      mockServerHandler.executeCommand.mockResolvedValue({
        stdout: 'Package installed',
        stderr: '',
        exitCode: 0
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockServerHandler.executeCommand).toHaveBeenCalledWith('sudo apt install package');
    });
  });

  describe('command execution', () => {
    beforeEach(() => {
      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: {
            content: '{"commands":[{"cmd":"echo hello","explain":"Say hello"}]}'
          }
        }]
      });
    });

    it('should execute commands successfully', async () => {
      mockRequest.body = { instructions: 'say hello' };

      mockServerHandler.executeCommand.mockResolvedValue({
        stdout: 'hello',
        stderr: '',
        exitCode: 0
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockServerHandler.executeCommand).toHaveBeenCalledWith('echo hello');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          results: expect.arrayContaining([
            expect.objectContaining({
              cmd: 'echo hello',
              stdout: 'hello',
              exitCode: 0
            })
          ])
        })
      );
    });

    it('should handle command execution errors', async () => {
      mockRequest.body = { instructions: 'failing command' };

      mockServerHandler.executeCommand.mockRejectedValue(new Error('Command failed'));

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'execute-llm failed',
          message: 'Command failed'
        })
      );
    });

    it('should stop execution on first failure', async () => {
      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: {
            content: '{"commands":[{"cmd":"echo first","explain":"First"},{"cmd":"echo second","explain":"Second"}]}'
          }
        }]
      });

      mockRequest.body = { instructions: 'run commands' };

      mockServerHandler.executeCommand
        .mockResolvedValueOnce({
          stdout: '',
          stderr: 'error',
          exitCode: 1
        })
        .mockResolvedValueOnce({
          stdout: 'second',
          stderr: '',
          exitCode: 0
        });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockServerHandler.executeCommand).toHaveBeenCalledTimes(1);
      expect(mockServerHandler.executeCommand).toHaveBeenCalledWith('echo first');
    });

    it('should analyze errors for failed commands', async () => {
      mockRequest.body = { instructions: 'failing command' };

      mockServerHandler.executeCommand.mockResolvedValue({
        stdout: '',
        stderr: 'command not found',
        exitCode: 127
      });

      mockErrorAdvisor.analyzeError.mockResolvedValue({
        analysis: 'Command not found error',
        suggestions: ['Check if command is installed']
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockErrorAdvisor.analyzeError).toHaveBeenCalledWith({
        kind: 'command',
        input: 'echo hello',
        stdout: '',
        stderr: 'command not found',
        exitCode: 127
      });
    });
  });

  describe('streaming mode', () => {
    beforeEach(() => {
      mockRequest.body = { 
        instructions: 'test command',
        stream: true
      };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: {
            content: '{"commands":[{"cmd":"echo test","explain":"Test command"}]}'
          }
        }]
      });
    });

    it('should set up streaming headers', async () => {
      mockRequest.body.dryRun = true;

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
    });

    it('should send plan event in streaming mode', async () => {
      mockRequest.body.dryRun = true;

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('event: plan')
      );
      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('event: done')
      );
    });

    it('should send step events during execution', async () => {
      mockServerHandler.executeCommand.mockResolvedValue({
        stdout: 'test output',
        stderr: '',
        exitCode: 0
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('event: step')
      );
      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('"status":"start"')
      );
      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('"status":"complete"')
      );
    });

    it('should handle policy blocks in streaming mode', async () => {
      mockSafety.evaluateCommandSafety.mockReturnValue({
        hardDeny: true,
        needsConfirm: false,
        reasons: ['Blocked']
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('event: policy')
      );
      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('"blocked":true')
      );
    });

    it('should handle execution errors in streaming mode', async () => {
      mockServerHandler.executeCommand.mockRejectedValue(new Error('Execution failed'));

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.write).toHaveBeenCalledWith(
        expect.stringContaining('event: error')
      );
    });

    it('should set up heartbeat in streaming mode', async () => {
      // Mock process.env for heartbeat
      const originalEnv = process.env.SSE_HEARTBEAT_MS;
      process.env.SSE_HEARTBEAT_MS = '100';

      mockRequest.body.dryRun = true;

      await executeLlm(mockRequest as Request, mockResponse as Response);

      // Restore env
      if (originalEnv !== undefined) {
        process.env.SSE_HEARTBEAT_MS = originalEnv;
      } else {
        delete process.env.SSE_HEARTBEAT_MS;
      }

      expect(mockResponse.write).toHaveBeenCalledWith(': connected\n\n');
    });
  });

  describe('dry run mode', () => {
    it('should return plan without execution in dry run', async () => {
      mockRequest.body = { 
        instructions: 'test command',
        dryRun: true
      };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: {
            content: '{"commands":[{"cmd":"echo test","explain":"Test"}]}'
          }
        }]
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockServerHandler.executeCommand).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          plan: expect.objectContaining({
            commands: [{ cmd: 'echo test', explain: 'Test' }]
          }),
          results: []
        })
      );
    });

    it('should return empty results for no commands in dry run', async () => {
      mockRequest.body = { 
        instructions: 'unclear request',
        dryRun: true
      };

      mockLlm.chatForServer.mockResolvedValue({
        provider: 'openai',
        choices: [{ index: 0,
          message: { role: 'assistant', content: '{"commands":[]}' }
        }]
      });

      await executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          plan: expect.objectContaining({
            commands: []
          }),
          results: []
        })
      );
    });
  });
});
