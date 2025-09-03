import { getSystemInfo } from '../../../src/common/getSystemInfo';

describe('common/getSystemInfo (unit)', () => {
  it('throws when executionFunction is not a function', async () => {
    // @ts-expect-error intentional misuse for runtime validation
    await expect(getSystemInfo(null)).rejects.toThrow(
      'Execution function must be provided and must be a function.'
    );
    // @ts-expect-error intentional misuse for runtime validation
    await expect(getSystemInfo(123)).rejects.toThrow(
      'Execution function must be provided and must be a function.'
    );
  });

  it('returns result when executionFunction resolves', async () => {
    const result = await getSystemInfo(async () => 'SYSINFO_OK');
    expect(result).toBe('SYSINFO_OK');
  });

  it('wraps and rethrows errors from executionFunction', async () => {
    await expect(
      getSystemInfo(async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('Failed to retrieve system information: boom');
  });
});

