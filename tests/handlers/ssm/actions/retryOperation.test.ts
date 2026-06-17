import { retryOperation } from '../../../../src/handlers/ssm/actions/retryOperation';

describe('retryOperation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return result on first successful attempt', async () => {
    const operation = jest.fn().mockResolvedValue('success');
    const result = await retryOperation(operation, 3, 100);
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and succeed on second attempt', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success');
    const promise = retryOperation(operation, 3, 100);
    jest.advanceTimersByTime(100);
    await Promise.resolve(); // flush promises for fake timers
    const result = await promise;
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('should retry up to max retries and throw on all failures', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('persistent fail'));
    const promise = retryOperation(operation, 2, 100);
    // Advance timers for retries
    jest.advanceTimersByTime(100);
    await Promise.resolve();
    jest.runAllTimers();
    await expect(promise).rejects.toThrow('persistent fail');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('should wait specified time between retries', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success');
    const result = await retryOperation(operation, 3, 200);
    // In test, attempts are sync (no delay)
    expect(operation).toHaveBeenCalledTimes(3);
    expect(result).toBe('success');
  });

  it('should handle retries = 1 (no retry)', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('fail'));
    const promise = retryOperation(operation, 1, 100);
    await expect(promise).rejects.toThrow('fail');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should handle retries = 0 (edge case, but should attempt once)', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('fail'));
    const promise = retryOperation(operation, 0, 100);
    await expect(promise).rejects.toThrow('fail');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should handle operation throwing non-Error', async () => {
    const operation = jest.fn().mockRejectedValue('string error');
    const promise = retryOperation(operation, 1, 100);
    await expect(promise).rejects.toBe('string error');
  });

  it('should succeed after multiple failures', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValueOnce('success');
    const promise = retryOperation(operation, 5, 50);
    jest.advanceTimersByTime(50);
    await Promise.resolve();
    jest.runAllTimers();
    jest.advanceTimersByTime(50);
    await Promise.resolve();
    jest.runAllTimers();
    const result = await promise;
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });
});