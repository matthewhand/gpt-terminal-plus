import { detectSystemExecutors } from '../../utils/executorDetect';

describe('detectSystemExecutors', () => {
  it('returns executor availability map', () => {
    const result = detectSystemExecutors();
    expect(result).toHaveProperty('bash');
    expect(result).toHaveProperty('python3');
    Object.values(result).forEach(executor => {
      expect(executor).toHaveProperty('available');
    });
  });

  it('handles repeated invocations without throwing', () => {
    expect(() => {
      detectSystemExecutors();
      detectSystemExecutors();
    }).not.toThrow();
  });
});
