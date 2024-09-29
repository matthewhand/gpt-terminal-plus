"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escapeRegExp_1 = require("../../src/utils/escapeRegExp");
describe('escapeRegExp', () => {
    it('should escape special characters in the string', () => {
        const input = '.*+-?^${}()|[]\\';
        const expectedOutput = '\\.\\*\\+\\-\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
        expect((0, escapeRegExp_1.escapeRegExp)(input)).toBe(expectedOutput);
    });
    it('should not alter a string without special characters', () => {
        const input = 'abc123';
        const expectedOutput = 'abc123';
        expect((0, escapeRegExp_1.escapeRegExp)(input)).toBe(expectedOutput);
    });
    it('should handle an empty string', () => {
        const input = '';
        const expectedOutput = '';
        expect((0, escapeRegExp_1.escapeRegExp)(input)).toBe(expectedOutput);
    });
    it('should handle strings with only special characters', () => {
        const input = '$^';
        const expectedOutput = '\\$\\^';
        expect((0, escapeRegExp_1.escapeRegExp)(input)).toBe(expectedOutput);
    });
});
