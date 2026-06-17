import { getOrGenerateApiToken } from '../../src/common/apiToken';

describe('getOrGenerateApiToken', () => {
  const originalEnv = process.env;
  const originalLog = console.log;

  beforeEach(() => {
    jest.resetModules(); // Clear cache to ensure clean environment
    process.env = { ...originalEnv }; // Copy environment variables
    console.log = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv; // Restore original environment
    console.log = originalLog; // Restore console
  });

  it('should return the existing API_TOKEN if it exists', () => {
    process.env.API_TOKEN = 'existing_token';
    const token = getOrGenerateApiToken();
    expect(token).toBe('existing_token');
  });

  it('should generate a new API_TOKEN if it does not exist', () => {
    delete process.env.API_TOKEN;
    const token = getOrGenerateApiToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    // crypto.randomBytes(16).toString('hex') => 32 lowercase hex chars
    expect(token).toMatch(/^[a-f0-9]{32}$/);
    // logs once on first generation with the token value
    expect(console.log).toHaveBeenCalledTimes(1);
    expect((console.log as jest.Mock).mock.calls[0][0]).toContain('API_TOKEN not found. Generated new token:');
  });

  it('should generate a new API_TOKEN only once if called multiple times without API_TOKEN set', () => {
    delete process.env.API_TOKEN;
    const token1 = getOrGenerateApiToken();
    const token2 = getOrGenerateApiToken();
    expect(token1).toBe(token2); // Ensure the same token is returned
    // Should not log again on subsequent calls
    expect((console.log as jest.Mock).mock.calls.length).toBe(1);
  });
});
