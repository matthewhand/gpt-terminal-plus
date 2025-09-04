import { getServerHandler } from '../src/utils/getServerHandler';
import { Request } from 'express';

// Mock server handler types for testing
interface MockServerHandler {
  id?: string | symbol;
  protocol?: string;
  hostname?: string;
  executeCommand?: (command: string) => Promise<any>;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
}

interface MockRequest extends Partial<Request> {
  server?: MockServerHandler | null | undefined | any;
}

describe('Server Handler Utility', () => {
  describe('Error Handling and Validation', () => {
    it('should throw when request object is missing server property', () => {
      const emptyRequest = {} as MockRequest;
      
      expect(() => getServerHandler(emptyRequest as any)).toThrow(/not found/);
    });

    it('should throw when server property is null', () => {
      const requestWithNullServer = { server: null } as MockRequest;
      
      expect(() => getServerHandler(requestWithNullServer as any)).toThrow(
        /Server handler not found/
      );
    });

    it('should throw when server property is undefined', () => {
      const requestWithUndefinedServer = { server: undefined } as MockRequest;
      
      expect(() => getServerHandler(requestWithUndefinedServer as any)).toThrow(
        'Server handler not found on request object'
      );
    });

    it('should throw when server property is falsy', () => {
      const falsyValues = [0, '', false, NaN];
      
      falsyValues.forEach(falsyValue => {
        const request = { server: falsyValue } as MockRequest;
        expect(() => getServerHandler(request as any)).toThrow(
          'Server handler not found on request object'
        );
      });
    });

    it('should throw with descriptive error messages', () => {
      const emptyRequest = {} as MockRequest;
      
      try {
        getServerHandler(emptyRequest as any);
        fail('Expected function to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('not found');
      }
    });
  });

  describe('Successful Handler Retrieval', () => {
    it('should return handler when present and valid', () => {
      const mockHandler: MockServerHandler = {
        id: 'test-handler',
        protocol: 'local',
        hostname: 'localhost'
      };
      const request = { server: mockHandler } as MockRequest;
      
      const result = getServerHandler(request as any);
      expect(result).toBe(mockHandler);
    });

    it('should return the exact same reference without cloning', () => {
      const uniqueSymbol = Symbol('unique-handler');
      const mockHandler: MockServerHandler = {
        id: uniqueSymbol,
        protocol: 'ssh',
        hostname: 'remote.server.com'
      };
      const request = { server: mockHandler } as MockRequest;
      
      const result = getServerHandler(request as any);
      expect(result).toBe(mockHandler);
      expect(result).toEqual(mockHandler);
      expect(result.id).toBe(uniqueSymbol);
    });

    it('should handle complex server handler objects', () => {
      const complexHandler: MockServerHandler = {
        id: 'complex-handler',
        protocol: 'ssm',
        hostname: 'aws-instance',
        executeCommand: jest.fn().mockResolvedValue({ stdout: 'test' }),
        connect: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn().mockResolvedValue(undefined)
      };
      const request = { server: complexHandler } as MockRequest;
      
      const result = getServerHandler(request as any);
      expect(result).toBe(complexHandler);
      expect(result.executeCommand).toBe(complexHandler.executeCommand);
      expect(result.connect).toBe(complexHandler.connect);
      expect(result.disconnect).toBe(complexHandler.disconnect);
    });
  });

  describe('Type Safety and Edge Cases', () => {
    it('should handle server handlers with minimal properties', () => {
      const minimalHandler = { protocol: 'local' };
      const request = { server: minimalHandler } as MockRequest;
      
      const result = getServerHandler(request as any);
      expect(result).toBe(minimalHandler);
      expect(result.protocol).toBe('local');
    });

    it('should handle server handlers with extra properties', () => {
      const handlerWithExtras = {
        id: 'handler-with-extras',
        protocol: 'ssh',
        hostname: 'server.com',
        customProperty: 'custom-value',
        nestedObject: { key: 'value' },
        arrayProperty: [1, 2, 3],
        functionProperty: () => 'test'
      };
      const request = { server: handlerWithExtras } as MockRequest;
      
      const result = getServerHandler(request as any);
      expect(result).toBe(handlerWithExtras);
      expect(result.customProperty).toBe('custom-value');
      expect(result.nestedObject).toEqual({ key: 'value' });
      expect(result.arrayProperty).toEqual([1, 2, 3]);
      expect(typeof result.functionProperty).toBe('function');
    });

    it('should handle server handlers that are primitive-like objects', () => {
      // Edge case: objects that might look primitive but are still valid
      const stringLikeHandler = new String('handler') as any;
      stringLikeHandler.protocol = 'test';
      const request = { server: stringLikeHandler } as MockRequest;
      
      const result = getServerHandler(request as any);
      expect(result).toBe(stringLikeHandler);
    });
  });

  describe('Request Object Variations', () => {
    it('should work with request objects that have additional properties', () => {
      const mockHandler = { id: 'test', protocol: 'local' };
      const requestWithExtras = {
        server: mockHandler,
        method: 'GET',
        url: '/test',
        headers: { 'content-type': 'application/json' },
        body: { test: 'data' }
      } as MockRequest;
      
      const result = getServerHandler(requestWithExtras as any);
      expect(result).toBe(mockHandler);
    });

    it('should handle request objects with server as the only property', () => {
      const mockHandler = { protocol: 'ssh' };
      const minimalRequest = { server: mockHandler };
      
      const result = getServerHandler(minimalRequest as any);
      expect(result).toBe(mockHandler);
    });
  });

  describe('Performance and Efficiency', () => {
    it('should execute quickly for valid inputs', () => {
      const mockHandler = { id: 'perf-test', protocol: 'local' };
      const request = { server: mockHandler } as MockRequest;
      
      const startTime = Date.now();
      const result = getServerHandler(request as any);
      const duration = Date.now() - startTime;
      
      expect(result).toBe(mockHandler);
      expect(duration).toBeLessThan(10); // Should be very fast
    });

    it('should handle multiple consecutive calls efficiently', () => {
      const mockHandler = { id: 'multi-test', protocol: 'local' };
      const request = { server: mockHandler } as MockRequest;
      
      const startTime = Date.now();
      for (let i = 0; i < 1000; i++) {
        getServerHandler(request as any);
      }
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(100); // Should handle many calls quickly
    });
  });

  describe('Memory and Reference Integrity', () => {
    it('should not modify the original handler object', () => {
      const originalHandler = { 
        id: 'original', 
        protocol: 'local',
        mutableProperty: 'initial-value'
      };
      const handlerCopy = { ...originalHandler };
      const request = { server: originalHandler } as MockRequest;
      
      const result = getServerHandler(request as any);
      
      // Modify the result to ensure it doesn't affect the original
      result.mutableProperty = 'modified-value';
      
      expect(originalHandler.mutableProperty).toBe('modified-value'); // Same reference
      expect(result).toBe(originalHandler); // Confirms same reference
    });

    it('should maintain object identity across calls', () => {
      const mockHandler = { id: 'identity-test', protocol: 'ssh' };
      const request = { server: mockHandler } as MockRequest;
      
      const result1 = getServerHandler(request as any);
      const result2 = getServerHandler(request as any);
      
      expect(result1).toBe(result2);
      expect(result1).toBe(mockHandler);
      expect(result2).toBe(mockHandler);
    });

    it('should handle circular references in handler objects', () => {
      const circularHandler: any = { id: 'circular', protocol: 'local' };
      circularHandler.self = circularHandler; // Create circular reference
      const request = { server: circularHandler } as MockRequest;
      
      const result = getServerHandler(request as any);
      expect(result).toBe(circularHandler);
      expect(result.self).toBe(result);
    });
  });
});
