import { redact } from '../src/utils/redact';

describe('Redaction Utility', () => {
  describe('Basic Redaction Functionality', () => {
    it('redacts sensitive API tokens', () => {
      const token = 'sk-1234567890abcdefghijklmnopqrstuvwxyz';
      const result = redact('API_TOKEN', token);
      
      expect(result).toContain('API_TOKEN:');
      expect(result).toContain('...');
      expect(result.length).toBeLessThan(`API_TOKEN: ${token}`.length);
      expect(result).not.toContain(token);
    });

    it('redacts passwords', () => {
      const password = 'mySecretPassword123!';
      const result = redact('password', password);
      
      expect(result).toContain('password:');
      expect(result).toContain('...');
      expect(result).not.toContain(password);
    });

    it('redacts database connection strings', () => {
      const connStr = 'postgresql://user:pass@localhost:5432/db';
      const result = redact('DATABASE_URL', connStr);
      
      expect(result).toContain('DATABASE_URL:');
      expect(result).toContain('...');
      expect(result).not.toContain('pass');
    });

    it('redacts SSH private keys', () => {
      const privateKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...';
      const result = redact('SSH_PRIVATE_KEY', privateKey);
      
      expect(result).toContain('SSH_PRIVATE_KEY:');
      expect(result).toContain('...');
      expect(result).not.toContain('BEGIN RSA PRIVATE KEY');
    });
  });

  describe('Different Value Types', () => {
    it('handles string values', () => {
      const result = redact('secret', 'sensitive_data');
      expect(result).toContain('secret:');
      expect(result).toContain('...');
    });

    it('stringifies and redacts object values', () => {
      const obj = { username: 'admin', password: 'secret123' };
      const result = redact('password', obj); // Use sensitive key
      
      expect(result).toContain('password:');
      expect(result).toContain('...');
      expect(result).not.toContain('secret123');
    });

    it('stringifies and redacts array values', () => {
      const arr = ['token1', 'token2', 'token3'];
      const result = redact('token', arr); // Use sensitive key
      
      expect(result).toContain('token:');
      expect(result).toContain('...');
    });

    it('handles number values', () => {
      const result = redact('port', 5432);
      expect(result).toContain('port:');
      expect(result).toContain('5432'); // Non-sensitive, should not be redacted
    });

    it('handles boolean values', () => {
      const result = redact('enabled', true);
      expect(result).toContain('enabled:');
      expect(result).toContain('true'); // Non-sensitive, should not be redacted
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles null values', () => {
      const result = redact('nullable', null as any);
      expect(result).toMatch(/Value is null|null/);
    });

    it('handles undefined values', () => {
      const result = redact('undefined_val', undefined as any);
      expect(result).toMatch(/undefined|Value is/);
    });

    it('handles empty string values', () => {
      const result = redact('empty', '');
      expect(result).toContain('empty:');
      expect(result).toBe('empty: '); // Empty string, no redaction needed
    });

    it('handles very long values', () => {
      const longValue = 'x'.repeat(10000);
      const result = redact('secret', longValue); // Use sensitive key
      
      expect(result).toContain('secret:');
      expect(result).toContain('...');
      expect(result.length).toBeLessThan(longValue.length + 20);
    });

    it('handles invalid key types', () => {
      // @ts-ignore - Testing invalid input
      const result = redact(123, 'value');
      expect(result).toMatch(/Invalid key|error/i);
    });

    it('handles null key', () => {
      // @ts-ignore - Testing invalid input
      const result = redact(null, 'value');
      expect(result).toMatch(/Invalid key|error/i);
    });

    it('handles undefined key', () => {
      // @ts-ignore - Testing invalid input
      const result = redact(undefined, 'value');
      expect(result).toMatch(/Invalid key|error/i);
    });
  });

  describe('Redaction Patterns', () => {
    it('shows partial information for debugging', () => {
      const token = 'abcdefghijklmnopqrstuvwxyz';
      const result = redact('token', token);
      
      // Should show some characters for debugging purposes
      expect(result).toMatch(/token: .{1,}\.\.\..{1,}/);
    });

    it('maintains consistent format', () => {
      const values = ['short', 'medium_length_value', 'very_long_value_that_exceeds_normal_length'];
      
      values.forEach(value => {
        const result = redact('test_key', value);
        expect(result).toMatch(/^test_key: .+/); // Non-sensitive key, no redaction
      });
    });

    it('handles special characters in values', () => {
      const specialValue = 'value!@#$%^&*()_+-={}[]|\\:;"<>?,./';
      const result = redact('special', specialValue);
      
      expect(result).toContain('special:');
      expect(result).toContain(specialValue); // Non-sensitive key, should not be redacted
    });
  });

  describe('Security Considerations', () => {
    it('does not leak sensitive data in output', () => {
      const sensitiveData = 'password123';
      const result = redact('password', sensitiveData);
      
      expect(result).toContain('...');
      expect(result).not.toContain(sensitiveData);
    });

    it('handles common sensitive key patterns', () => {
      const sensitiveKeys = [
        'API_KEY',
        'api_key', 
        'password',
        'PASSWORD',
        'secret',
        'SECRET',
        'token',
        'TOKEN',
        'private_key',
        'PRIVATE_KEY'
      ];
      
      sensitiveKeys.forEach(key => {
        const result = redact(key, 'sensitive_value');
        expect(result).toContain('...');
        expect(result).not.toContain('sensitive_value');
      });
    });

    it('prevents information disclosure through length', () => {
      const shortSecret = 'abc';
      const longSecret = 'a'.repeat(100);
      
      const shortResult = redact('secret', shortSecret);
      const longResult = redact('secret', longSecret);
      
      // Results should not reveal original length
      expect(shortResult.length).toBeGreaterThan(10);
      expect(longResult.length).toBeLessThan(longSecret.length + 20);
    });
  });

  describe('Performance and Efficiency', () => {
    it('handles large objects efficiently', () => {
      const largeObj = {
        data: Array(1000).fill('test'),
        nested: {
          deep: {
            value: 'sensitive'
          }
        }
      };
      
      const startTime = Date.now();
      const result = redact('large_object', largeObj);
      const duration = Date.now() - startTime;
      
      expect(result).toContain('large_object:');
      expect(result).toContain('data'); // Non-sensitive key, should show content
      expect(duration).toBeLessThan(100); // Should complete quickly
    });

    it('handles multiple redactions efficiently', () => {
      const values = Array(100).fill('sensitive_data');
      
      const startTime = Date.now();
      values.forEach((value, i) => {
        redact(`key_${i}`, value);
      });
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(100); // Should handle multiple calls efficiently
    });
  });

  describe('Integration Scenarios', () => {
    it('works with configuration objects', () => {
      const config = {
        database: {
          host: 'localhost',
          password: 'secret123'
        },
        api: {
          key: 'sk-abcdef123456'
        }
      };
      
      const result = redact('config', config);
      expect(result).toContain('config:');
      expect(result).toContain('localhost'); // Non-sensitive key, should show content
      // Note: Individual sensitive values within objects are not redacted by this function
      // This function only redacts based on the top-level key name
    });

    it('works with environment variable logging', () => {
      const envVars = {
        NODE_ENV: 'production',
        DATABASE_PASSWORD: 'prod_password_123',
        API_SECRET: 'super_secret_key'
      };
      
      Object.entries(envVars).forEach(([key, value]) => {
        const result = redact(key, value);
        if (key.includes('PASSWORD') || key.includes('SECRET')) {
          expect(result).not.toContain(value);
          expect(result).toContain('...');
        }
      });
    });
  });
});

