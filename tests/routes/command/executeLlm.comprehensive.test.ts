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
        model: 'gpt-4',
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
  });
});

