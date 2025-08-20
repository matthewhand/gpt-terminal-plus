import { escapeRegExp } from '@src/utils/escapeRegExp';

describe('escapeRegExp', () => {
    it('should escape special characters in the string', () => {
        const input = '.*+-?^${}()|[]\\';
        const expectedOutput = '\\.\\*\\+\\-\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
        expect(escapeRegExp(input)).toBe(expectedOutput);
    });

    it('should not alter a string without special characters', () => {
        const input = 'abc123';
        const expectedOutput = 'abc123';
        expect(escapeRegExp(input)).toBe(expectedOutput);
    });

    it('should handle an empty string', () => {
        const input = '';
        const expectedOutput = '';
        expect(escapeRegExp(input)).toBe(expectedOutput);
    });

    it('should handle strings with only special characters', () => {
        const input = '$^';
        const expectedOutput = '\\$\\^';
        expect(escapeRegExp(input)).toBe(expectedOutput);
    });
});
