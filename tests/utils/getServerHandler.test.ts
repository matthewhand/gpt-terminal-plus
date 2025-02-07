import { Request } from 'express';
import { getServerHandler } from '../../src/utils/getServerHandler';

describe('getServerHandler', () => {
  it('should return the server handler from the request', () => {
    const mockServerHandler = { someProperty: 'someValue' };
    const mockRequest = { server: mockServerHandler } as unknown as Request;

    const result = getServerHandler(mockRequest);
    expect(result).toBe(mockServerHandler);
  });

  it('should throw an error if the server handler is not found', () => {
    const mockRequest = {} as Request;

    expect(() => getServerHandler(mockRequest)).toThrowError('Server handler not found on request object');
  });
});