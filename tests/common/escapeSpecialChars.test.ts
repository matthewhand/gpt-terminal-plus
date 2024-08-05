import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { escapeSpecialChars } from '../../src/common/escapeSpecialChars';

describe('escapeSpecialChars', () => {
  beforeEach(() => {
    delete process.env.ESCAPE_DOLLAR;
    delete process.env.ESCAPE_QUOTES;
    delete process.env.ESCAPE_BACKTICKS;
    delete process.env.ESCAPE_FORWARD_SLASH;
    delete process.env.ESCAPE_BACKWARD_SLASH;
  });

  it('should escape dollar signs when ESCAPE_DOLLAR is true', () => {
    process.env.ESCAPE_DOLLAR = 'true';
    const input = 'This $ is a dollar sign';
    const expected = 'This \$ is a dollar sign';
    const result = escapeSpecialChars(input);
    expect(result).to.equal(expected);
  });
