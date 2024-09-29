"use strict";
/**
 * @fileoverview Tests for the escapeRegExp function.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const escapeSpecialChars_1 = require("@common/escapeSpecialChars");
describe('escapeRegExp', () => {
    it('should escape special regex characters', () => {
        console.log('Test Case: Escape special regex characters');
        const input = 'Hello. How are you? (I am fine)';
        const expected = 'Hello\\. How are you\\? \\(I am fine\\)';
        const result = (0, escapeSpecialChars_1.escapeRegExp)(input);
        console.log(`escapeRegExp result: ${result}`);
        (0, chai_1.expect)(result).toBe(expected);
    });
    it('should return an empty string if input is empty', () => {
        console.log('Test Case: Return empty string for empty input');
        const input = '';
        const expected = '';
        const result = (0, escapeSpecialChars_1.escapeRegExp)(input);
        console.log(`escapeRegExp result: '${result}'`);
        (0, chai_1.expect)(result).toBe(expected);
    });
    it('should handle strings without special characters', () => {
        console.log('Test Case: Handle strings without special characters');
        const input = 'HelloWorld';
        const expected = 'HelloWorld';
        const result = (0, escapeSpecialChars_1.escapeRegExp)(input);
        console.log(`escapeRegExp result: ${result}`);
        (0, chai_1.expect)(result).toBe(expected);
    });
    it('should handle multiple special characters', () => {
        console.log('Test Case: Handle multiple special characters');
        const input = '*+?^${}()|[]\\.';
        const expected = '\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\\\.';
        const result = (0, escapeSpecialChars_1.escapeRegExp)(input);
        console.log(`escapeRegExp result: ${result}`);
        (0, chai_1.expect)(result).toBe(expected);
    });
});
