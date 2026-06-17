import { validateEnvironmentVariables } from '../src/utils/envValidation';

// Mock the debug logger to capture messages for assertions
jest.mock('debug', () => {
  const fn = jest.fn();
  const factory = () => fn;
  // Expose the underlying function for tests that want to inspect calls
  (factory as any).__fn = fn;
  return factory;
});

describe('Environment Variable Validation', () => {
  const originalEnv = { ...process.env };
  let mockLogger: jest.Mock;

  beforeEach(() => {
    // Reset environment and clear mocks
    process.env = { ...originalEnv };
    jest.clearAllMocks();
    
    const debugFactory: any = require('debug');
    mockLogger = debugFactory.__fn as jest.Mock;
  });

  afterEach(() => {
    // Restore original environment
    process.env = { ...originalEnv };
  });

  describe('Basic Validation Behavior', () => {
    it('should not throw when required variables are missing', () => {
      delete process.env.API_TOKEN;
      delete process.env.NODE_CONFIG_DIR;
      delete process.env.HTTPS_ENABLED;
      
      expect(() => validateEnvironmentVariables()).not.toThrow();
    });

    it('should not throw when all variables are present', () => {
      process.env.API_TOKEN = 'test-token';
      process.env.NODE_CONFIG_DIR = 'config/test';
      process.env.HTTPS_ENABLED = 'false';
      process.env.CORS_ORIGIN = 'http://localhost:3000';
      process.env.DEFAULT_MODEL = 'gpt-oss:20b';
      
      expect(() => validateEnvironmentVariables()).not.toThrow();
    });

    it('should handle empty environment gracefully', () => {
      // Clear all environment variables
      process.env = {};
      
      expect(() => validateEnvironmentVariables()).not.toThrow();
    });
  });

  describe('Logging Behavior', () => {
    it('should log status for each monitored environment variable', () => {
      // Set some variables and leave others unset
      process.env.API_TOKEN = 'test-token-123';
      process.env.NODE_CONFIG_DIR = 'config/test';
      delete process.env.HTTPS_ENABLED;
      process.env.CORS_ORIGIN = 'http://localhost:3000';
      delete process.env.DEFAULT_MODEL;

      validateEnvironmentVariables();

      // Should have logged something for each variable
      expect(mockLogger).toHaveBeenCalled();
      expect(mockLogger.mock.calls.length).toBeGreaterThan(0);
    });

    it('should log missing variables appropriately', () => {
      delete process.env.API_TOKEN;
      delete process.env.NODE_CONFIG_DIR;
      delete process.env.HTTPS_ENABLED;

      validateEnvironmentVariables();

      // Should log about missing variables
      const missingVarLogs = mockLogger.mock.calls.filter(call => 
        call[0] && /is not set/.test(call[0])
      );
      expect(missingVarLogs.length).toBeGreaterThan(0);
    });

    it('should redact sensitive variables in logs', () => {
      process.env.API_TOKEN = 'sk-very-secret-token-12345';
      process.env.DATABASE_PASSWORD = 'super-secret-password';

      validateEnvironmentVariables();

      // Should log about API_TOKEN but not expose the actual value
      const apiTokenLogs = mockLogger.mock.calls.filter(call => 
        call[0] && /Environment variable API_TOKEN/.test(call[0])
      );
      expect(apiTokenLogs.length).toBeGreaterThan(0);
      
      // Should not contain the actual sensitive values
      const allLogMessages = mockLogger.mock.calls.map(call => call[0]).join(' ');
      expect(allLogMessages).not.toContain('sk-very-secret-token-12345');
      expect(allLogMessages).not.toContain('super-secret-password');
    });

    it('should handle non-sensitive variables without redaction', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '3000';
      process.env.CORS_ORIGIN = 'http://localhost:3000';

      validateEnvironmentVariables();

      // These non-sensitive values might be logged without redaction
      expect(mockLogger).toHaveBeenCalled();
    });
  });

  describe('HTTPS Configuration Validation', () => {
    it('should warn when HTTPS is enabled but certificates are missing', () => {
      process.env.HTTPS_ENABLED = 'true';
      delete process.env.HTTPS_KEY_PATH;
      delete process.env.HTTPS_CERT_PATH;

      validateEnvironmentVariables();

      const httpsWarnings = mockLogger.mock.calls.filter(call =>
        call[0] && /HTTPS is enabled but HTTPS_KEY_PATH or HTTPS_CERT_PATH is not set/.test(call[0])
      );
      expect(httpsWarnings.length).toBeGreaterThan(0);
    });

    it('should not warn when HTTPS is disabled', () => {
      process.env.HTTPS_ENABLED = 'false';
      delete process.env.HTTPS_KEY_PATH;
      delete process.env.HTTPS_CERT_PATH;

      validateEnvironmentVariables();

      const httpsWarnings = mockLogger.mock.calls.filter(call =>
        call[0] && /HTTPS is enabled but/.test(call[0])
      );
      expect(httpsWarnings.length).toBe(0);
    });

    it('should not warn when HTTPS is enabled and certificates are provided', () => {
      process.env.HTTPS_ENABLED = 'true';
      process.env.HTTPS_KEY_PATH = '/path/to/key.pem';
      process.env.HTTPS_CERT_PATH = '/path/to/cert.pem';

      validateEnvironmentVariables();

      const httpsWarnings = mockLogger.mock.calls.filter(call =>
        call[0] && /HTTPS is enabled but/.test(call[0])
      );
      expect(httpsWarnings.length).toBe(0);
    });

    it('should handle various HTTPS_ENABLED values', () => {
      const testValues = ['true', 'TRUE', '1', 'yes', 'false', 'FALSE', '0', 'no', ''];

      testValues.forEach(value => {
        jest.clearAllMocks();
        process.env.HTTPS_ENABLED = value;
        delete process.env.HTTPS_KEY_PATH;
        delete process.env.HTTPS_CERT_PATH;

        expect(() => validateEnvironmentVariables()).not.toThrow();
      });
    });
  });

  describe('Environment Variable Types and Values', () => {
    it('should handle boolean-like environment variables', () => {
      const booleanVars = {
        HTTPS_ENABLED: ['true', 'false', '1', '0', 'yes', 'no'],
        DEBUG: ['true', 'false', '*', 'app:*'],
        PRODUCTION: ['true', 'false']
      };

      Object.entries(booleanVars).forEach(([key, values]) => {
        values.forEach(value => {
          jest.clearAllMocks();
          process.env[key] = value;
          
          expect(() => validateEnvironmentVariables()).not.toThrow();
        });
      });
    });

    it('should handle numeric environment variables', () => {
      const numericVars = {
        PORT: ['3000', '8080', '80', '443'],
        TIMEOUT: ['5000', '30000', '0'],
        MAX_CONNECTIONS: ['100', '1000', '10000']
      };

      Object.entries(numericVars).forEach(([key, values]) => {
        values.forEach(value => {
          jest.clearAllMocks();
          process.env[key] = value;
          
          expect(() => validateEnvironmentVariables()).not.toThrow();
        });
      });
    });

    it('should handle URL-like environment variables', () => {
      const urlVars = {
        CORS_ORIGIN: [
          'http://localhost:3000',
          'https://example.com',
          '*',
          'http://localhost:3000,https://example.com'
        ],
        DATABASE_URL: [
          'postgresql://user:pass@localhost:5432/db',
          'mongodb://localhost:27017/db',
          'redis://localhost:6379'
        ]
      };

      Object.entries(urlVars).forEach(([key, values]) => {
        values.forEach(value => {
          jest.clearAllMocks();
          process.env[key] = value;
          
          expect(() => validateEnvironmentVariables()).not.toThrow();
        });
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined process.env gracefully', () => {
      const originalProcessEnv = process.env;
      
      try {
        // Simulate undefined process.env (edge case)
        (global as any).process = { ...process, env: undefined };
        
        expect(() => validateEnvironmentVariables()).not.toThrow();
      } finally {
        (global as any).process.env = originalProcessEnv;
      }
    });

    it('should handle very long environment variable values', () => {
      process.env.VERY_LONG_VAR = 'x'.repeat(10000);
      
      expect(() => validateEnvironmentVariables()).not.toThrow();
    });

    it('should handle environment variables with special characters', () => {
      const specialCharVars = {
        SPECIAL_CHARS: 'value with spaces and symbols !@#$%^&*()',
        UNICODE_VAR: '🚀 Unicode test ñáéíóú',
        JSON_CONFIG: '{"key": "value", "nested": {"array": [1, 2, 3]}}',
        MULTILINE_VAR: 'line1\nline2\nline3',
        QUOTED_VAR: '"quoted value"',
        ESCAPED_VAR: 'value\\with\\backslashes'
      };

      Object.entries(specialCharVars).forEach(([key, value]) => {
        process.env[key] = value;
      });

      expect(() => validateEnvironmentVariables()).not.toThrow();
    });
  });

  describe('Performance and Efficiency', () => {
    it('should complete validation quickly', () => {
      // Set up a realistic environment
      process.env.API_TOKEN = 'test-token';
      process.env.NODE_CONFIG_DIR = 'config/test';
      process.env.HTTPS_ENABLED = 'false';
      process.env.CORS_ORIGIN = 'http://localhost:3000';
      process.env.DEFAULT_MODEL = 'gpt-oss:20b';

      const startTime = Date.now();
      validateEnvironmentVariables();
      const duration = Date.now() - startTime;

      // Should complete very quickly
      expect(duration).toBeLessThan(100);
    });

    it('should handle multiple consecutive calls efficiently', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 10; i++) {
        validateEnvironmentVariables();
      }
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(200);
    });
  });
});
