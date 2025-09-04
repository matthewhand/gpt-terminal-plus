import { escapeRegExp } from '../../src/utils/escapeRegExp';

describe('escapeRegExp', () => {
  describe('basic functionality', () => {
    it('should escape special regex characters', () => {
      const input = 'Hello. How are you? (I am fine)';
      const expected = 'Hello\\\\. How are you\\\\? \\\\(I am fine\\\\)';
      const result = escapeRegExp(input);
      expect(result).toBe(expected);
    });

    it('should handle strings without special characters', () => {
      const input = 'HelloWorld123';
      const expected = 'HelloWorld123';
      const result = escapeRegExp(input);
      expect(result).toBe(expected);
    });

    it('should handle all regex special characters', () => {
      const input = '*+?^${}()|[]\\\\.';
      const expected = '\\\\*\\\\+\\\\?\\\\^\\\\$\\\\{\\\\}\\\\(\\\\)\\\\|\\\\[\\\\]\\\\\\\\\\\\\.';
      const result = escapeRegExp(input);
      expect(result).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it('should return an empty string if input is empty', () => {
      const input = '';
      const expected = '';
      const result = escapeRegExp(input);
      expect(result).toBe(expected);
    });

    it('should handle whitespace-only strings', () => {
      const input = '   \\t\\n  ';
      const result = escapeRegExp(input);
      expect(result).toBe(input); // Whitespace should not be escaped
    });

    it('should handle strings with only special characters', () => {
      const input = '.*+?^${}()|[]\\\\';
      const expected = '\\\\.\\\\*\\\\+\\\\?\\\\^\\\\$\\\\{\\\\}\\\\(\\\\)\\\\|\\\\[\\\\]\\\\\\\\';
      const result = escapeRegExp(input);
      expect(result).toBe(expected);
    });

    it('should handle very long strings', () => {
      const input = 'a'.repeat(1000) + '.*+?' + 'b'.repeat(1000);
      const result = escapeRegExp(input);
      expect(result).toContain('a'.repeat(1000));
      expect(result).toContain('b'.repeat(1000));
      expect(result).toContain('\\\\.\\\\*\\\\+\\\\?');
    });

    it('should handle unicode characters', () => {
      const input = 'Hello 世界 🌍 café.txt';
      const expected = 'Hello 世界 🌍 café\\\\.txt';
      const result = escapeRegExp(input);
      expect(result).toBe(expected);
    });
  });

  describe('specific character escaping', () => {
    const testCases = [
      { char: '.', escaped: '\\\\.' },
      { char: '*', escaped: '\\\\*' },
      { char: '+', escaped: '\\\\+' },
      { char: '?', escaped: '\\\\?' },
      { char: '^', escaped: '\\\\^' },
      { char: '$', escaped: '\\\\$' },
      { char: '{', escaped: '\\\\{' },
      { char: '}', escaped: '\\\\}' },
      { char: '(', escaped: '\\\\(' },
      { char: ')', escaped: '\\\\)' },
      { char: '|', escaped: '\\\\|' },
      { char: '[', escaped: '\\\\[' },
      { char: ']', escaped: '\\\\]' },
      { char: '\\\\', escaped: '\\\\\\\\' }
    ];

    testCases.forEach(({ char, escaped }) => {
      it(`should escape ${char} to ${escaped}`, () => {
        const result = escapeRegExp(char);
        expect(result).toBe(escaped);
      });
    });

    it('should escape multiple occurrences of the same character', () => {
      const input = '...***???';
      const expected = '\\\\.\\\\.\\\\.\\\\*\\\\*\\\\*\\\\?\\\\?\\\\?';
      const result = escapeRegExp(input);
      expect(result).toBe(expected);
    });
  });

  describe('practical use cases', () => {
    it('should work with file paths', () => {
      const input = 'C:\\\\Users\\\\John\\\\Documents\\\\file.txt';
      const result = escapeRegExp(input);
      expect(result).toContain('\\\\\\\\'); // Escaped backslashes
      expect(result).toContain('\\\\.'); // Escaped dot
    });

    it('should work with URLs', () => {
      const input = 'https://example.com/path?query=value&other=123';
      const result = escapeRegExp(input);
      expect(result).toContain('\\\\.'); // Escaped dots
      expect(result).toContain('\\\\?'); // Escaped question mark
    });

    it('should work with email addresses', () => {
      const input = 'user+tag@example.com';
      const result = escapeRegExp(input);
      expect(result).toContain('\\\\+'); // Escaped plus
      expect(result).toContain('\\\\.'); // Escaped dot
    });

    it('should work with regex patterns themselves', () => {
      const input = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$';
      const result = escapeRegExp(input);
      expect(result).toContain('\\\\^'); // Escaped caret
      expect(result).toContain('\\\\['); // Escaped brackets
      expect(result).toContain('\\\\$'); // Escaped dollar
    });
  });

  describe('integration with RegExp constructor', () => {
    it('should produce valid regex when used with RegExp constructor', () => {
      const input = 'Hello. How are you? (I am fine)';
      const escaped = escapeRegExp(input);
      
      expect(() => new RegExp(escaped)).not.toThrow();
      
      const regex = new RegExp(escaped);
      expect(regex.test(input)).toBe(true);
      expect(regex.test('Different string')).toBe(false);
    });

    it('should work with global and case-insensitive flags', () => {
      const input = 'test.file';
      const escaped = escapeRegExp(input);
      const regex = new RegExp(escaped, 'gi');
      
      const testString = 'TEST.FILE and test.file and Test.File';
      const matches = testString.match(regex);
      expect(matches).toHaveLength(3);
    });

    it('should handle complex patterns correctly', () => {
      const input = '(function.*{.*})';
      const escaped = escapeRegExp(input);
      const regex = new RegExp(escaped);
      
      expect(regex.test(input)).toBe(true);
      expect(regex.test('function test() { return true; }')).toBe(false);
    });
  });

  describe('performance', () => {
    it('should handle many escape operations efficiently', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        escapeRegExp(`test.string.${i}.*+?^${}()|[]\\\\`);
      }
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
    });

    it('should be consistent across multiple calls', () => {
      const input = 'test.*+?^${}()|[]\\\\';
      const result1 = escapeRegExp(input);
      const result2 = escapeRegExp(input);
      const result3 = escapeRegExp(input);
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });
});
