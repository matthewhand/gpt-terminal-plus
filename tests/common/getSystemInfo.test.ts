import { getSystemInfo } from '../../src/common/getSystemInfo';
import Debug from 'debug';

const debug = Debug('test:getSystemInfo');

describe('getSystemInfo', () => {
  it('should return the result of the execution function', async () => {
    const mockExecutionFunction = jest.fn().mockResolvedValue('Mock System Info');
    const result = await getSystemInfo(mockExecutionFunction);
    expect(result).toBe('Mock System Info');
    expect(mockExecutionFunction).toHaveBeenCalled();
  });

  it('should throw an error if the execution function is not provided', async () => {
    await expect(getSystemInfo(null as any)).rejects.toThrow('Execution function must be provided and must be a function.');
  });

  it('should throw an error if the execution function is not a function', async () => {
    await expect(getSystemInfo('not a function' as any)).rejects.toThrow('Execution function must be provided and must be a function.');
  });

  it('should throw an error if the execution function fails', async () => {
    const mockExecutionFunction = jest.fn().mockRejectedValue(new Error('Execution failed'));
    await expect(getSystemInfo(mockExecutionFunction)).rejects.toThrow('Failed to retrieve system information: Execution failed');
    expect(mockExecutionFunction).toHaveBeenCalled();
  });
});