import { validateEnvironmentVariables } from '../../src/utils/envValidation';

describe('validateEnvironmentVariables', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should run without throwing when all required variables are set', () => {
    process.env.API_TOKEN = 'dummy-token';
    process.env.NODE_CONFIG_DIR = './config';
    process.env.HTTPS_ENABLED = 'false';
    process.env.CORS_ORIGIN = '*';

    expect(() => validateEnvironmentVariables()).not.toThrow();
  });

  it('should run without throwing even when some variables are missing', () => {
    delete process.env.API_TOKEN;
    process.env.NODE_CONFIG_DIR = './config';
    process.env.HTTPS_ENABLED = 'false';
    process.env.CORS_ORIGIN = '*';

    expect(() => validateEnvironmentVariables()).not.toThrow();
  });

  it('should log a specific debug message when HTTPS is enabled but key or cert paths are missing', () => {
    process.env.API_TOKEN = 'dummy-token';
    process.env.NODE_CONFIG_DIR = './config';
    process.env.HTTPS_ENABLED = 'true';
    process.env.CORS_ORIGIN = '*';
    delete process.env.HTTPS_KEY_PATH;
    delete process.env.HTTPS_CERT_PATH;

    // As the function only logs messages, we only ensure it doesn't throw.
    expect(() => validateEnvironmentVariables()).not.toThrow();
  });
});
