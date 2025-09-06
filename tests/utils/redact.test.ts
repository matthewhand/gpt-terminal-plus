import { redact } from '../../src/utils/redact';
import Debug from 'debug';

const debug = Debug('test:redact');

describe('redact', () => {
    describe('sensitive key detection', () => {
        it('should redact common sensitive keys', () => {
            const sensitiveKeys = [
                'apiKey', 'password', 'secretToken', 'secret', 'token', 
                'auth', 'authorization', 'credential', 'key', 'privateKey',
                'accessToken', 'refreshToken', 'sessionToken', 'jwt'
            ];

            sensitiveKeys.forEach(key => {
                const result = redact(key, 'sensitive-value');
                expect(result).toContain('...');
                expect(result).not.toContain('sensitive-value');
            });
        });

        it('should redact case-insensitive sensitive keys', () => {
            const variations = [
                'APIKEY', 'ApiKey', 'PASSWORD', 'Password', 
                'SECRET_TOKEN', 'secret_token', 'Auth_Token'
            ];

            variations.forEach(key => {
                const result = redact(key, 'sensitive-value');
                expect(result).toContain('...');
                expect(result).not.toContain('sensitive-value');
            });
        });

        it('should redact keys containing sensitive substrings', () => {
            const keysWithSensitiveSubstrings = [
                'userPassword', 'dbSecret', 'myApiKey', 'appToken',
                'service_auth_key', 'oauth_secret', 'jwt_token'
            ];

            keysWithSensitiveSubstrings.forEach(key => {
                const result = redact(key, 'sensitive-value');
                expect(result).toContain('...');
                expect(result).not.toContain('sensitive-value');
            });
        });

        it('should not redact non-sensitive keys', () => {
            const nonSensitiveKeys = [
                'normalKey', 'username', 'email', 'name', 'id', 
                'url', 'endpoint', 'config', 'setting', 'option'
            ];

            nonSensitiveKeys.forEach(key => {
                const result = redact(key, 'public-value');
                expect(result).not.toContain('...');
                expect(result).toBe('public-value');
            });
        });
    });

    describe('value type handling', () => {
        it('should handle string values correctly', () => {
            const result = redact('apiKey', 'string-secret');
            expect(result).toContain('...');
            expect(result).not.toContain('string-secret');
            expect(typeof result).toBe('string');
        });

        it('should handle number values', () => {
            const result = redact('secretCode', 12345);
            expect(result).toContain('...');
            expect(result).not.toContain('12345');
        });

        it('should handle boolean values', () => {
            const result = redact('secretFlag', true);
            expect(result).toContain('...');
            expect(result).not.toContain('true');
        });

        it('should handle object values', () => {
            const objValue = {
                nested: 'secret',
                data: { deep: 'value' },
                array: [1, 2, 3]
            };
            const result = redact('secretObj', objValue);
            expect(result).toContain('...');
            expect(result).toContain('secretObj');
            expect(result).toContain('[Redacted sensitive value]');
        });

        it('should handle array values', () => {
            const arrayValue = ['secret1', 'secret2', { nested: 'secret3' }];
            const result = redact('secretArray', arrayValue);
            expect(result).toContain('...');
            expect(result).not.toContain('secret1');
            expect(result).not.toContain('secret2');
            expect(result).not.toContain('secret3');
        });

        it('should handle function values', () => {
            const funcValue = () => 'secret';
            const result = redact('secretFunc', funcValue);
            expect(result).toContain('...');
            expect(result).toContain('secretFunc');
            expect(result).toContain('[Redacted sensitive value]');
        });

        it('should handle Date values', () => {
            const dateValue = new Date('2023-01-01');
            const result = redact('secretDate', dateValue);
            expect(result).toContain('...');
        });

        it('should handle RegExp values', () => {
            const regexValue = /secret/gi;
            const result = redact('secretRegex', regexValue);
            expect(result).toContain('...');
        });
    });

    describe('null and undefined handling', () => {
        it('should handle null values', () => {
            const result = redact('nullable', null);
            expect(result).toContain('[Value is null or undefined]');
        });

        it('should handle undefined values', () => {
            const result = redact('undef', undefined);
            expect(result).toContain('[Value is null or undefined]');
        });

        it('should handle null values for sensitive keys', () => {
            const result = redact('password', null);
            expect(result).toContain('[Value is null or undefined]');
        });

        it('should handle undefined values for non-sensitive keys', () => {
            const result = redact('normalKey', undefined);
            expect(result).toContain('[Value is null or undefined]');
        });
    });

    describe('input validation', () => {
        it('should return error message for invalid key type - number', () => {
            const result = redact(123 as any, 'value');
            expect(result).toContain('Invalid key');
        });

        it('should return error message for invalid key type - object', () => {
            const result = redact({} as any, 'value');
            expect(result).toContain('Invalid key');
        });

        it('should return error message for invalid key type - array', () => {
            const result = redact([] as any, 'value');
            expect(result).toContain('Invalid key');
        });

        it('should return error message for invalid key type - function', () => {
            const result = redact((() => {}) as any, 'value');
            expect(result).toContain('Invalid key');
        });

        it('should handle empty string keys', () => {
            const result = redact('', 'value');
            expect(result).toBe('value'); // Empty string is not sensitive
        });

        it('should handle whitespace-only keys', () => {
            const result = redact('   ', 'value');
            expect(result).toBe('value'); // Whitespace is not sensitive
        });
    });

    describe('redaction format', () => {
        it('should include partial value information in redaction', () => {
            const result = redact('apiKey', 'very-long-secret-value');
            expect(result).toContain('...');
            // Should give some hint about the original value length or type
            expect(result.length).toBeGreaterThan(3); // More than just "..."
        });

        it('should be consistent for same inputs', () => {
            const result1 = redact('password', 'same-secret');
            const result2 = redact('password', 'same-secret');
            expect(result1).toBe(result2);
        });

        it('should be different for different sensitive values', () => {
            const result1 = redact('password', 'secret1');
            const result2 = redact('password', 'secret2');
            expect(result1).not.toBe(result2);
        });
    });

    describe('edge cases', () => {
        it('should handle very long values', () => {
            const longValue = 'x'.repeat(10000);
            const result = redact('secret', longValue);
            expect(result).toContain('...');
            expect(result.length).toBeLessThan(longValue.length);
        });

        it('should handle empty string values', () => {
            const result = redact('password', '');
            expect(result).toContain('...');
        });

        it('should handle circular object references', () => {
            const circularObj: any = { name: 'test' };
            circularObj.self = circularObj;
            
            const result = redact('secretObj', circularObj);
            expect(result).toContain('...');
            // Should not throw an error or cause infinite recursion
        });

        it('should handle symbols', () => {
            const symbolValue = Symbol('secret');
            const result = redact('secretSymbol', symbolValue);
            expect(result).toContain('...');
        });

        it('should handle BigInt values', () => {
            const bigIntValue = BigInt(123456789012345678901234567890n);
            const result = redact('secretBigInt', bigIntValue);
            expect(result).toContain('...');
        });
    });

    describe('performance', () => {
        it('should handle many redactions efficiently', () => {
            const startTime = Date.now();
            
            for (let i = 0; i < 1000; i++) {
                redact(`key${i}`, `value${i}`);
                redact(`password${i}`, `secret${i}`);
            }
            
            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });
    });
});