import { redact } from '../../src/utils/redact';
import Debug from 'debug';

const debug = Debug('test:redact');

describe('redact', () => {
    it('should redact sensitive keys', () => {
        expect(redact('apiKey', 'sensitive-value')).toContain('...');
        expect(redact('password', 'unguessable')).toContain('...');
        expect(redact('secretToken', 'super-secret')).toContain('...');
    });

    it('should not redact non-sensitive keys', () => {
        expect(redact('normalKey', 'public-value')).not.toContain('...');
    });

    it('should handle non-string values', () => {
        const objValue = { sensitive: 'secret' };
        expect(redact('secretObj', objValue)).toContain('...');
    });

    it('should return error message for invalid key type', () => {
        expect(redact(123 as any, 'value')).toContain('Invalid key');
    });

    it('should handle null or undefined values', () => {
        expect(redact('nullable', null)).toContain('[Value is null or undefined]');
        expect(redact('undef', undefined)).toContain('[Value is null or undefined]');
    });
});