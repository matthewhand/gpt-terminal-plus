import { escapeRegExp } from '../src/utils/escapeRegExp';

describe('utils/escapeRegExp', () => {
  it('escapes common regex special chars', () => {
    const input = 'a+b*c?^$()[]{}|.';
    const escaped = escapeRegExp(input);
    expect(() => new RegExp(escaped)).not.toThrow();
    expect(escaped).toBe('a\\+b\\*c\\?\\^\\$\\(\\)\\[\\]\\{\\}\\|\\.');
  });

  it('escapes backslashes correctly', () => {
    const input = String.raw`path\to\file`;
    const escaped = escapeRegExp(input);
    // Each backslash becomes \\\\ in the escaped text (escaped for JS+regex)
    expect(escaped).toContain('\\\\');
    expect(() => new RegExp(escaped)).not.toThrow();
  });

  it('handles empty string', () => {
    expect(escapeRegExp('')).toBe('');
  });

  it('handles unicode and leaves safe chars intact', () => {
    const input = 'héllo_world—✓';
    const escaped = escapeRegExp(input);
    expect(escaped).toBe(input);
  });
});
