import { escapeSpecialChars } from '../../common/escapeSpecialChars';
import { expect } from 'chai';

describe('escapeSpecialChars', () => {
  it('should escape special characters', () => {
    const input = 'Hello.*+?^${}()|[\]';
    const expected = 'Hello\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\\\]';
    const result = escapeSpecialChars(input);
    expect(result).to.equal(expected);
  });
});
