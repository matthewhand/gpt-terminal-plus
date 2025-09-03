import { escapeRegExp } from '@src/utils/escapeRegExp';

describe('escapeRegExp', () => {
  it('escapes all common regex metacharacters', () => {
    const input = '.*+-?^${}()|[]\\';
    const expected = '\\.\\*\\+\\-\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
    expect(escapeRegExp(input)).toBe(expected);
    expect(() => new RegExp(escapeRegExp(input))).not.toThrow();
  });

  it('does not alter safe strings', () => {
    expect(escapeRegExp('abc123')).toBe('abc123');
  });

  it('handles empty string', () => {
    expect(escapeRegExp('')).toBe('');
  });

  it('escapes backslashes correctly and remains a valid pattern', () => {
    const input = String.raw`path\\to\\file`;
    const escaped = escapeRegExp(input);
    // Each single backslash is escaped for regex consumption
    expect(escaped).toContain('\\\\');
    expect(() => new RegExp(escaped)).not.toThrow();
  });

  it('leaves unicode and underscores intact', () => {
    const input = 'héllo_world—✓';
    expect(escapeRegExp(input)).toBe(input);
  });

  it('handles strings with only special characters', () => {
    expect(escapeRegExp('$^')).toBe('\\$\\^');
  });
});
