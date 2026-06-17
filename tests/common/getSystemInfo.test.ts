import { getSystemInfo } from '../../src/common/getSystemInfo';
import Debug from 'debug';

const debug = Debug('test:getSystemInfo');

describe('getSystemInfo', () => {
  describe('successful execution', () => {
    it('should return the result of the execution function', async () => {
      const mockSystemInfo = {
        type: 'Linux',
        platform: 'linux',
        architecture: 'x64',
        totalMemory: 8192,
        freeMemory: 4096,
        uptime: 12345,
        currentFolder: '/home/user'
      };
      const mockExecutionFunction = jest.fn().mockResolvedValue(mockSystemInfo);
      
      const result = await getSystemInfo(mockExecutionFunction);
      
      expect(result).toEqual(mockSystemInfo);
      expect(mockExecutionFunction).toHaveBeenCalledTimes(1);
      expect(mockExecutionFunction).toHaveBeenCalledWith();
    });

    it('should handle string return values from execution function', async () => {
      const mockExecutionFunction = jest.fn().mockResolvedValue('Mock System Info String');
      
      const result = await getSystemInfo(mockExecutionFunction);
      
      expect(result).toBe('Mock System Info String');
      expect(typeof result).toBe('string');
    });

    it('should handle complex object return values', async () => {
      const complexSystemInfo = {
        type: 'Windows',
        platform: 'win32',
        architecture: 'x64',
        totalMemory: 16384,
        freeMemory: 8192,
        uptime: 54321,
        currentFolder: 'C:\\Users\\test',
        additionalInfo: {
          version: '10.0.19041',
          hostname: 'test-machine'
        }
      };
      const mockExecutionFunction = jest.fn().mockResolvedValue(complexSystemInfo);
      
      const result = await getSystemInfo(mockExecutionFunction);
      
      expect(result).toEqual(complexSystemInfo);
      expect(result.additionalInfo).toBeDefined();
      expect(result.additionalInfo.version).toBe('10.0.19041');
    });
  });

  describe('input validation', () => {
    it('should throw an error if the execution function is not provided', async () => {
      await expect(getSystemInfo(null as any))
        .rejects
        .toThrow('Execution function must be provided and must be a function.');
    });

    it('should throw an error if the execution function is undefined', async () => {
      await expect(getSystemInfo(undefined as any))
        .rejects
        .toThrow('Execution function must be provided and must be a function.');
    });

    it('should throw an error if the execution function is not a function', async () => {
      await expect(getSystemInfo('not a function' as any))
        .rejects
        .toThrow('Execution function must be provided and must be a function.');
    });

    it('should throw an error if the execution function is an object', async () => {
      await expect(getSystemInfo({} as any))
        .rejects
        .toThrow('Execution function must be provided and must be a function.');
    });

    it('should throw an error if the execution function is a number', async () => {
      await expect(getSystemInfo(123 as any))
        .rejects
        .toThrow('Execution function must be provided and must be a function.');
    });
  });

  describe('error handling', () => {
    it('should throw an error if the execution function fails', async () => {
      const mockExecutionFunction = jest.fn().mockRejectedValue(new Error('Execution failed'));
      
      await expect(getSystemInfo(mockExecutionFunction))
        .rejects
        .toThrow('Failed to retrieve system information: Execution failed');
      expect(mockExecutionFunction).toHaveBeenCalledTimes(1);
    });

    it('should handle execution function throwing non-Error objects', async () => {
      const mockExecutionFunction = jest.fn().mockRejectedValue('String error');
      
      await expect(getSystemInfo(mockExecutionFunction))
        .rejects
        .toThrow('Failed to retrieve system information: String error');
    });

    it('should handle execution function throwing null', async () => {
      const mockExecutionFunction = jest.fn().mockRejectedValue(null);
      
      await expect(getSystemInfo(mockExecutionFunction))
        .rejects
        .toThrow('Failed to retrieve system information: null');
    });

    it('should preserve original error stack trace', async () => {
      const originalError = new Error('Original execution error');
      originalError.stack = 'Original stack trace';
      const mockExecutionFunction = jest.fn().mockRejectedValue(originalError);
      
      try {
        await getSystemInfo(mockExecutionFunction);
        fail('Expected function to throw');
      } catch (error) {
        expect(error.message).toContain('Failed to retrieve system information: Original execution error');
        expect(mockExecutionFunction).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('performance and reliability', () => {
    it('should handle slow execution functions within reasonable time', async () => {
      const mockExecutionFunction = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('Slow result'), 100))
      );
      
      const startTime = Date.now();
      const result = await getSystemInfo(mockExecutionFunction);
      const endTime = Date.now();
      
      expect(result).toBe('Slow result');
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
      expect(endTime - startTime).toBeLessThan(200); // Should not take too long
    });

    it('should handle multiple concurrent calls correctly', async () => {
      let callCount = 0;
      const mockExecutionFunction = jest.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve(`Result ${callCount}`);
      });
      
      const promises = [
        getSystemInfo(mockExecutionFunction),
        getSystemInfo(mockExecutionFunction),
        getSystemInfo(mockExecutionFunction)
      ];
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      expect(results[0]).toBe('Result 1');
      expect(results[1]).toBe('Result 2');
      expect(results[2]).toBe('Result 3');
      expect(mockExecutionFunction).toHaveBeenCalledTimes(3);
    });
  });
});