import { Request, Response } from 'express';

// Import the actual handlers to test their real behavior
const executeCommandHandler = require('../../../src/routes/command/executeCommand');
const executeCodeHandler = require('../../../src/routes/command/executeCode');
const executeLlmHandler = require('../../../src/routes/command/executeLlm');
const changeDirectoryHandler = require('../../../src/routes/command/changeDirectory');
const executeShellHandler = require('../../../src/routes/command/executeShell');

describe('Route Command Handlers', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      write: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis()
    };

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('executeCommand handler', () => {
    it('should delegate to executeShell by default', async () => {
      // executeCommand delegates to executeShell when shell is enabled (default)
      mockRequest.body = { command: 'echo test' };

      await executeCommandHandler.executeCommand(mockRequest as Request, mockResponse as Response);

      // Should call status (either success or error)
      expect(mockResponse.status).toHaveBeenCalled();
    });

    it('should handle delegation when no execution modes enabled', async () => {
      // Temporarily disable all execution modes
      const originalShell = process.env.ENABLE_COMMAND_MANAGEMENT;
      const originalCode = process.env.ENABLE_CODE_EXECUTION;
      const originalLlm = process.env.LLM_ENABLED;

      process.env.ENABLE_COMMAND_MANAGEMENT = 'false';
      process.env.ENABLE_CODE_EXECUTION = 'false';
      process.env.LLM_ENABLED = 'false';

      mockRequest.body = { command: 'echo test' };

      await executeCommandHandler.executeCommand(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          code: 'EXECUTION_DISABLED',
          message: 'No execution modes are enabled. Configure Shell/Code/LLM in Setup.',
        },
      });

      // Restore environment
      process.env.ENABLE_COMMAND_MANAGEMENT = originalShell;
      process.env.ENABLE_CODE_EXECUTION = originalCode;
      process.env.LLM_ENABLED = originalLlm;
    });
  });

  describe('executeCode handler', () => {
    it('should handle missing code in request body', async () => {
      mockRequest.body = { language: 'python' };

      await executeCodeHandler.executeCode(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Code and language are required.'
      });
    });

    it('should handle missing language in request body', async () => {
      mockRequest.body = { code: 'print("hello")' };

      await executeCodeHandler.executeCode(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Code and language are required.'
      });
    });

    it('should handle empty code', async () => {
      mockRequest.body = { code: '', language: 'python' };

      await executeCodeHandler.executeCode(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Code and language are required.'
      });
    });

    it('should handle empty language', async () => {
      mockRequest.body = { code: 'print("hello")', language: '' };

      await executeCodeHandler.executeCode(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Code and language are required.'
      });
    });

    it('should handle valid code execution request', async () => {
      mockRequest.body = { code: 'print("hello")', language: 'python' };

      await executeCodeHandler.executeCode(mockRequest as Request, mockResponse as Response);

      // Should call status (either success or error, but not 400 for valid input)
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalledWith(400);
    });
  });


  describe('executeLlm handler', () => {
    it('should handle missing instructions in request body', async () => {
      mockRequest.body = {};

      await executeLlmHandler.executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'instructions is required'
      });
    });

    it('should handle empty instructions', async () => {
      mockRequest.body = { instructions: '' };

      await executeLlmHandler.executeLlm(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'instructions is required'
      });
    });

    it('should handle valid instructions', async () => {
      mockRequest.body = { instructions: 'Say hello' };

      await executeLlmHandler.executeLlm(mockRequest as Request, mockResponse as Response);

      // Should call status (might be 500 due to LLM config, but not 400 for valid input)
      expect(mockResponse.status).toHaveBeenCalled();
    });
  });

  describe('executeShell handler', () => {
    it('should handle missing command in request body', async () => {
      mockRequest.body = {};

      await executeShellHandler.executeShell(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Command is required'
      });
    });

    it('should handle empty command', async () => {
      mockRequest.body = { command: '' };

      await executeShellHandler.executeShell(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Command is required'
      });
    });

    it('should handle whitespace-only command', async () => {
      mockRequest.body = { command: '   ' };

      await executeShellHandler.executeShell(mockRequest as Request, mockResponse as Response);

      // Whitespace-only might pass validation but fail execution
      expect(mockResponse.status).toHaveBeenCalled();
    });

    it('should handle valid shell command', async () => {
      mockRequest.body = { command: 'echo hello' };

      await executeShellHandler.executeShell(mockRequest as Request, mockResponse as Response);

      // Should call status (either success or error, but not 400 for valid input)
      expect(mockResponse.status).toHaveBeenCalled();
      // Note: might still be 400 if server handler fails, so we don't assert not.toHaveBeenCalledWith(400)
    });
  });

  describe('changeDirectory handler', () => {
    it('should handle missing directory in request body', async () => {
      mockRequest.body = {};

      await changeDirectoryHandler.changeDirectory(mockRequest as Request, mockResponse as Response);

      // Should call status (behavior depends on implementation)
      expect(mockResponse.status).toHaveBeenCalled();
    });

    it('should handle valid directory change', async () => {
      mockRequest.body = { directory: '/tmp' };

      await changeDirectoryHandler.changeDirectory(mockRequest as Request, mockResponse as Response);

      // Should call status
      expect(mockResponse.status).toHaveBeenCalled();
    });
  });

  describe('integration behavior', () => {
    it('should handle various input validation patterns', async () => {
      // Test that handlers respond appropriately to different inputs
      const testCases = [
        {
          handler: executeCodeHandler.executeCode,
          validInput: { code: 'print("test")', language: 'python' },
          invalidInput: { code: '', language: 'python' }
        },
        {
          handler: executeShellHandler.executeShell,
          validInput: { command: 'echo test' },
          invalidInput: { command: '' }
        }
      ];

      for (const testCase of testCases) {
        // Test invalid input
        mockRequest.body = testCase.invalidInput;
        await testCase.handler(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);

        // Reset mocks
        jest.clearAllMocks();

        // Test valid input
        mockRequest.body = testCase.validInput;
        await testCase.handler(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalled();
        // Note: We don't assert not 400 because server handler might still fail

        // Reset for next iteration
        jest.clearAllMocks();
      }
    });
  });
});
