import { Request, Response, NextFunction } from 'express';
import { checkAuthToken } from '../../src/middlewares/checkAuthToken';

jest.mock('../../src/common/apiToken', () => ({
  getOrGenerateApiToken: jest.fn()
}));

jest.mock('../../src/config/convictConfig', () => ({
  convictConfig: jest.fn()
}));

describe('checkAuthToken middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {
      path: '/test',
      ip: '192.168.1.1',
      headers: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    statusSpy = mockResponse.status as jest.SpyInstance;
    jsonSpy = mockResponse.json as jest.SpyInstance;
    mockNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('health check bypass', () => {
    it('should allow health check without token', () => {
      mockRequest.path = '/health';

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusSpy).not.toHaveBeenCalled();
    });
  });

  describe('private network access', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      process.env.DISABLE_PRIVATE_NETWORK_ACCESS = 'false';
    });

    it('should allow private network access without token in development', () => {
      mockRequest.ip = '192.168.1.1';

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusSpy).not.toHaveBeenCalled();
    });

    it('should allow localhost access without token', () => {
      mockRequest.ip = '127.0.0.1';

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow IPv6 localhost access', () => {
      mockRequest.ip = '::1';

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow IPv4-mapped IPv6 private access', () => {
      mockRequest.ip = '::ffff:192.168.1.1';

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should not allow private network access in production', () => {
      process.env.NODE_ENV = 'production';
      mockRequest.ip = '192.168.1.1';
      mockRequest.headers = { authorization: 'Bearer invalid' };

      const { getOrGenerateApiToken } = require('../../src/common/apiToken');
      getOrGenerateApiToken.mockReturnValue('valid-token');

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusSpy).toHaveBeenCalledWith(403);
    });

    it('should not allow private network access when disabled', () => {
      process.env.DISABLE_PRIVATE_NETWORK_ACCESS = 'true';
      mockRequest.ip = '192.168.1.1';

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusSpy).toHaveBeenCalledWith(401);
    });
  });

  describe('token validation', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      const { getOrGenerateApiToken } = require('../../src/common/apiToken');
      getOrGenerateApiToken.mockReturnValue('valid-token');
    });

    it('should return 401 for missing authorization header', () => {
      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for malformed authorization header', () => {
      mockRequest.headers = { authorization: 'InvalidFormat' };

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should validate correct token', () => {
      mockRequest.headers = { authorization: 'Bearer valid-token' };

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusSpy).not.toHaveBeenCalled();
    });

    it('should return 403 for invalid token', () => {
      mockRequest.headers = { authorization: 'Bearer invalid-token' };

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(statusSpy).toHaveBeenCalledWith(403);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Forbidden' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should use overridden token from config', () => {
      const { convictConfig } = require('../../src/config/convictConfig');
      convictConfig.mockReturnValue({
        get: jest.fn().mockReturnValue('overridden-token')
      });
      mockRequest.headers = { authorization: 'Bearer overridden-token' };

      checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    describe('route-specific error responses', () => {
      it('should return 401 for chat routes with invalid token', () => {
        mockRequest.path = '/chat/completions';
        mockRequest.headers = { authorization: 'Bearer invalid-token' };

        checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(jsonSpy).toHaveBeenCalledWith({ error: 'Unauthorized' });
      });

      it('should return 401 for server routes with invalid token', () => {
        mockRequest.path = '/server/list';
        mockRequest.headers = { authorization: 'Bearer invalid-token' };

        checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(statusSpy).toHaveBeenCalledWith(401);
      });

      it('should return 401 for model routes with invalid token', () => {
        mockRequest.path = '/model/select';
        mockRequest.headers = { authorization: 'Bearer invalid-token' };

        checkAuthToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(statusSpy).toHaveBeenCalledWith(401);
      });
    });
  });
});