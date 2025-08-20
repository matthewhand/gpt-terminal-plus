import { escapeSpecialChars } from '@src/common/escapeSpecialChars';

describe('escapeSpecialChars', () => {
  it('should escape special characters in a string', () => {
    const input = '.*+?^${}()|[]\\';
    const expectedOutput = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
    expect(escapeSpecialChars(input)).toBe(expectedOutput);
  });

  it('should not modify a string with no special characters', () => {
    const input = 'abcdefg';
    expect(escapeSpecialChars(input)).toBe(input);
  });

  it('should handle an empty string', () => {
    const input = '';
    expect(escapeSpecialChars(input)).toBe(input);
  });

  it('should escape special characters in a mixed string', () => {
    const input = 'hello.*world';
    const expectedOutput = 'hello\\.\\*world';
    expect(escapeSpecialChars(input)).toBe(expectedOutput);
  });
});
