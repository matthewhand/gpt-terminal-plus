import { escapeSpecialChars } from './escapeSpecialChars';

describe('escapeSpecialChars', () => {
  test('should not modify a string with no special characters', () => {
    const input = "abc123";
    const output = escapeSpecialChars(input);
    expect(output).toBe("abc123");
  });
  
  test('should escape regex special characters', () => {
    const input = "a.c*?+^${}()|[]\\";
    const expected = "a\\.c\\*\\?\\+\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\";
    const output = escapeSpecialChars(input);
    expect(output).toBe(expected);
  });

  test('should escape multiple occurrences of special characters', () => {
    const input = ".*+?^$()[]{}|\\";
    const expected = "\\.\\*\\+\\?\\^\\$\\(\\)\\[\\]\\{\\}\\|\\\\";
    const output = escapeSpecialChars(input);
    expect(output).toBe(expected);
  });
});