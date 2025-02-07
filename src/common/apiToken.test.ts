import { getOrGenerateApiToken } from './apiToken';

describe('getOrGenerateApiToken', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('should generate a new token if API_TOKEN is not set', () => {
    delete process.env.API_TOKEN;
    const token = getOrGenerateApiToken();
    expect(token).toBeDefined();
    expect(token).toHaveLength(32);
  });

  test('should return existing token if API_TOKEN is set', () => {
    process.env.API_TOKEN = 'preset-token';
    const token = getOrGenerateApiToken();
    expect(token).toBe('preset-token');
  });
});