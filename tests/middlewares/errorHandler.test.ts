import { Request, Response, NextFunction } from 'express';
import { errorHandler, GPTActionError } from '../../src/middlewares/errorHandler';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/test',
      headers: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('validation errors', () => {
    it('should handle ValidationError with 400 status', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      (error as any).details = { field: 'username', message: 'Required' };

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        type: 'validation',
        details: { field: 'username', message: 'Required' }
      });
    });

    it('should handle ValidationError without details', () => {
      const error = new Error('Invalid input');
      error.name = 'ValidationError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid input',
        type: 'validation',
        details: undefined
      });
    });
  });

  describe('authentication errors', () => {
    it('should handle UnauthorizedError with 401 status', () => {
      const error = new Error('Authentication required');
      error.name = 'UnauthorizedError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Authentication required',
        type: 'authentication'
      });
    });

    it('should handle UnauthorizedError with empty message', () => {
      const error = new Error('');
      error.name = 'UnauthorizedError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
        type: 'authentication'
      });
    });
  });

  describe('authorization errors', () => {
    it('should handle ForbiddenError with 403 status', () => {
      const error = new Error('Access denied');
      error.name = 'ForbiddenError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Access denied',
        type: 'authorization'
      });
    });
  });

  describe('not found errors', () => {
    it('should handle NotFoundError with 404 status', () => {
      const error = new Error('Resource not found');
      error.name = 'NotFoundError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Resource not found',
        type: 'not_found'
      });
    });
  });

  describe('server errors', () => {
    it('should handle generic errors with 500 status', () => {
      const error = new Error('Something went wrong');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Something went wrong',
        type: 'server_error'
      });
    });

    it('should handle errors without message', () => {
      const error = new Error();

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
        type: 'server_error'
      });
    });

    it('should handle unknown error types', () => {
      const error = new Error('Custom error');
      error.name = 'CustomError';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Custom error',
        type: 'server_error'
      });
    });
  });

  describe('error object variations', () => {
    it('should handle non-Error objects', () => {
      const error = 'String error';

      errorHandler(error as any, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
        type: 'server_error'
      });
    });

    it('should handle null errors', () => {
      const error = null;

      errorHandler(error as any, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unknown error occurred',
        type: 'server_error'
      });
    });

    it('should handle undefined errors', () => {
      const error = undefined;

      errorHandler(error as any, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unknown error occurred',
        type: 'server_error'
      });
    });

    it('should handle errors with custom properties', () => {
      const error = new Error('Custom error');
      (error as any).statusCode = 418;
      (error as any).customProperty = 'custom value';

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Custom error',
        type: 'server_error'
      });
    });
  });

  describe('GPTActionError interface', () => {
    it('should create proper GPTActionError structure', () => {
      const error = new Error('Test error');
      error.name = 'ValidationError';
      (error as any).details = { test: 'data' };

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      const expectedError: GPTActionError = {
        message: 'Test error',
        type: 'validation',
        details: { test: 'data' }
      };

      expect(mockResponse.json).toHaveBeenCalledWith(expectedError);
    });

    it('should handle all error types correctly', () => {
      const errorTypes = [
        { name: 'ValidationError', expectedType: 'validation', expectedStatus: 400 },
        { name: 'UnauthorizedError', expectedType: 'authentication', expectedStatus: 401 },
        { name: 'ForbiddenError', expectedType: 'authorization', expectedStatus: 403 },
        { name: 'NotFoundError', expectedType: 'not_found', expectedStatus: 404 },
        { name: 'GenericError', expectedType: 'server_error', expectedStatus: 500 }
      ];

      errorTypes.forEach(({ name, expectedType, expectedStatus }) => {
        jest.clearAllMocks();
        
        const error = new Error(`${name} message`);
        error.name = name;

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: `${name} message`,
          type: expectedType
        });
      });
    });
  });

  describe('middleware behavior', () => {
    it('should not call next function', () => {
      const error = new Error('Test error');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should always send a response', () => {
      const error = new Error('Test error');

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle multiple error properties', () => {
      const error = new Error('Complex error');
      error.name = 'ValidationError';
      (error as any).details = { 
        field1: 'error1', 
        field2: 'error2',
        nested: { deep: 'value' }
      };

      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Complex error',
        type: 'validation',
        details: { 
          field1: 'error1', 
          field2: 'error2',
          nested: { deep: 'value' }
        }
      });
    });
  });
});
