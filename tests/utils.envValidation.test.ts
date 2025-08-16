import { validateEnvironmentVariables } from '../src/utils/envValidation';

describe('utils/envValidation', () => {
  const old = { ...process.env };
  afterEach(() => { process.env = { ...old }; });

  it('runs without throwing when vars missing', () => {
    delete process.env.API_TOKEN;
    expect(() => validateEnvironmentVariables()).not.toThrow();
  });

  it('logs with variables set', () => {
    process.env.API_TOKEN = 'abc';
    process.env.NODE_CONFIG_DIR = 'config';
    process.env.HTTPS_ENABLED = 'false';
    process.env.CORS_ORIGIN = 'http://localhost';
    process.env.DEFAULT_MODEL = 'gpt-oss:20b';
    expect(() => validateEnvironmentVariables()).not.toThrow();
  });
});

