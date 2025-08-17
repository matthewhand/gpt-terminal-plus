import { escapeRegExp } from '../../src/utils/escapeRegExp';

describe('escapeRegExp', () => {
  it('should escape special regex characters', () => {
    const input = 'Hello. How are you? (I am fine)';
    const expected = 'Hello\\. How are you\\? \\(I am fine\\)';
    const result = escapeRegExp(input);
    expect(result).toBe(expected);
  });

  it('should return an empty string if input is empty', () => {
    const input = '';
    const expected = '';
    const result = escapeRegExp(input);
    expect(result).toBe(expected);
  });

  it('should handle strings without special characters', () => {
    const input = 'HelloWorld';
    const expected = 'HelloWorld';
    const result = escapeRegExp(input);
    expect(result).toBe(expected);
  });

  it('should handle multiple special characters', () => {
    const input = '*+?^${}()|[]\\.';
    const expected = '\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\\\.';
    const result = escapeRegExp(input);
    expect(result).toBe(expected);
  });
});
