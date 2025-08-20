import { escapeRegExp } from '../../src/utils/escapeRegExp';

describe('escapeRegExp', () => {
  it('escapes regex special characters', () => {
    const input = '.*+?^${}()|[]\\';
    const expected = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
    expect(escapeRegExp(input)).toBe(expected);
  });

  it('returns the same string if no special characters', () => {
    const input = 'abc123';
    expect(escapeRegExp(input)).toBe(input);
  });
});