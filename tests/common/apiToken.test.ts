import { getOrGenerateApiToken } from '../../src/common/apiToken';

describe('getOrGenerateApiToken', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear cache to ensure clean environment
    process.env = { ...originalEnv }; // Copy environment variables
  });

  afterEach(() => {
    process.env = originalEnv; // Restore original environment
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
    expect(token.length).toBeGreaterThan(0);
  });

  it('should generate a new API_TOKEN only once if called multiple times without API_TOKEN set', () => {
    delete process.env.API_TOKEN;
    const token1 = getOrGenerateApiToken();
    const token2 = getOrGenerateApiToken();
    expect(token1).toBe(token2); // Ensure the same token is returned
  });
});