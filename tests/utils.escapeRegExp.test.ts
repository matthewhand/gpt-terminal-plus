import { escapeRegExp } from '../src/utils/escapeRegExp';

describe('utils/escapeRegExp', () => {
  it('escapes regex special chars', () => {
    const input = 'a+b*c?^$()[]{}|.';
    const escaped = escapeRegExp(input);
    expect(() => new RegExp(escaped)).not.toThrow();
    expect(escaped).toMatch(/\\\+/);
  });
});

