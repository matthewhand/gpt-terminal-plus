import { Request, Response, NextFunction } from 'express';
import { initializeServerHandler } from '../../src/middlewares/initializeServerHandler';

jest.mock('../../src/utils/GlobalStateHelper', () => ({
  getSelectedServer: jest.fn(),
  setSelectedServer: jest.fn()
}));

jest.mock('../../src/managers/serverRegistry', () => ({
  listRegisteredServers: jest.fn()
}));

jest.mock('../../src/managers/ServerManager', () => ({
  ServerManager: {
    getInstance: jest.fn()
  }
}));

describe('initializeServerHandler middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {
      ip: '127.0.0.1'
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    statusSpy = mockResponse.status as jest.SpyInstance;
    jsonSpy = mockResponse.json as jest.SpyInstance;
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('test environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should provision local handler automatically in test mode', () => {
      const { getSelectedServer } = require('../../src/utils/GlobalStateHelper');
      getSelectedServer.mockReturnValue(null);

      initializeServerHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect((mockRequest as any).server).toBeDefined();
      expect((mockRequest as any).serverHandler).toBeDefined();
    });
  });

  describe('production environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should use selected server when available', () => {
      const { getSelectedServer } = require('../../src/utils/GlobalStateHelper');
      const { ServerManager } = require('../../src/managers/ServerManager');

      getSelectedServer.mockReturnValue('localhost');
      const mockManager = { createHandler: jest.fn().mockReturnValue({}) };
      ServerManager.getInstance.mockReturnValue(mockManager);

      initializeServerHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockManager.createHandler).toHaveBeenCalledWith('localhost');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should auto-select localhost when no server selected', () => {
      const { getSelectedServer, setSelectedServer } = require('../../src/utils/GlobalStateHelper');
      const { listRegisteredServers } = require('../../src/managers/serverRegistry');
      const { ServerManager } = require('../../src/managers/ServerManager');

      getSelectedServer.mockReturnValue(null);
      listRegisteredServers.mockReturnValue([
        { hostname: 'localhost', protocol: 'local', directory: '.' },
        { hostname: 'remote', protocol: 'ssh' }
      ]);
      const mockManager = { createHandler: jest.fn().mockReturnValue({}) };
      ServerManager.getInstance.mockReturnValue(mockManager);

      initializeServerHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(setSelectedServer).toHaveBeenCalledWith('localhost');
      expect(mockManager.createHandler).toHaveBeenCalledWith('localhost');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should fallback to any localhost server', () => {
      const { getSelectedServer, setSelectedServer } = require('../../src/utils/GlobalStateHelper');
      const { listRegisteredServers } = require('../../src/managers/serverRegistry');
      const { ServerManager } = require('../../src/managers/ServerManager');

      getSelectedServer.mockReturnValue(null);
      listRegisteredServers.mockReturnValue([
        { hostname: 'localhost', protocol: 'local' },
        { hostname: 'remote', protocol: 'ssh' }
      ]);
      const mockManager = { createHandler: jest.fn().mockReturnValue({}) };
      ServerManager.getInstance.mockReturnValue(mockManager);

      initializeServerHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(setSelectedServer).toHaveBeenCalledWith('localhost');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 when no server available', () => {
      const { getSelectedServer } = require('../../src/utils/GlobalStateHelper');
      const { listRegisteredServers } = require('../../src/managers/serverRegistry');

      getSelectedServer.mockReturnValue(null);
      listRegisteredServers.mockReturnValue([]);

      initializeServerHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'No server selected and no localhost server available' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle server registry errors gracefully', () => {
      const { getSelectedServer } = require('../../src/utils/GlobalStateHelper');
      const { listRegisteredServers } = require('../../src/managers/serverRegistry');

      getSelectedServer.mockReturnValue(null);
      listRegisteredServers.mockImplementation(() => { throw new Error('Registry error'); });

      initializeServerHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'No server selected' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle ServerManager errors', () => {
      const { getSelectedServer } = require('../../src/utils/GlobalStateHelper');
      const { ServerManager } = require('../../src/managers/ServerManager');

      getSelectedServer.mockReturnValue('localhost');
      const mockManager = { createHandler: jest.fn().mockImplementation(() => { throw new Error('Handler error'); }) };
      ServerManager.getInstance.mockReturnValue(mockManager);

      initializeServerHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Failed to initialize server handler', details: 'Handler error' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});