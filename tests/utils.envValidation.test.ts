import { validateEnvironmentVariables } from '../src/utils/envValidation';

// Mock the debug logger to capture messages for assertions
jest.mock('debug', () => {
  const fn = jest.fn();
  const factory = () => fn;
  // Expose the underlying function for tests that want to inspect calls
  // (TypeScript will treat this as any when imported via require)
  (factory as any).__fn = fn;
  return factory;
});

describe('utils/envValidation', () => {
  const old = { ...process.env };
  afterEach(() => {
    jest.clearAllMocks();
    process.env = { ...old };
  });

  it('does not throw when variables are missing', () => {
    delete process.env.API_TOKEN;
    expect(() => validateEnvironmentVariables()).not.toThrow();
  });

  it('logs each required var either as set or missing', () => {
    const debugFactory: any = require('debug');
    const logger = debugFactory.__fn as jest.Mock;

    // Intentionally set some and omit others
    process.env.API_TOKEN = 'abc';
    process.env.NODE_CONFIG_DIR = 'config';
    delete process.env.HTTPS_ENABLED;
    process.env.CORS_ORIGIN = 'http://localhost';
    process.env.DEFAULT_MODEL = 'gpt-oss:20b';

    validateEnvironmentVariables();

    // Expect at least one message about missing var
    expect(logger.mock.calls.some(c => /is not set/.test(c[0]))).toBe(true);
    // Expect redacted log for set variables
    expect(logger.mock.calls.some(c => /Environment variable API_TOKEN/.test(c[0]))).toBe(true);
  });

  it('warns when HTTPS is enabled but key/cert are missing', () => {
    const debugFactory: any = require('debug');
    const logger = debugFactory.__fn as jest.Mock;

    process.env.HTTPS_ENABLED = 'true';
    delete process.env.HTTPS_KEY_PATH;
    delete process.env.HTTPS_CERT_PATH;

    validateEnvironmentVariables();

    expect(
      logger.mock.calls.some(c =>
        /HTTPS is enabled but HTTPS_KEY_PATH or HTTPS_CERT_PATH is not set/.test(c[0])
      )
    ).toBe(true);
  });
});
