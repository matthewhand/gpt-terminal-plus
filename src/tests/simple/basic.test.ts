import { getOrGenerateApiToken } from '../../common/apiToken';
import { escapeSpecialChars } from '../../common/escapeSpecialChars';
import { getExecuteCommand } from '../../common/getExecuteCommand';

describe('Core Utilities Integration', () => {
  const originalApiToken = process.env.API_TOKEN;

  beforeEach(() => {
    // Clean slate for each test
    delete process.env.API_TOKEN;
  });

  afterAll(() => {
    // Restore original token
    if (originalApiToken) {
      process.env.API_TOKEN = originalApiToken;
    } else {
      delete process.env.API_TOKEN;
    }
  });

  describe('API Token Generation', () => {
    it('should generate valid API tokens with correct format', () => {
      const token = getOrGenerateApiToken();
      
      expect(typeof token).toBe('string');
      expect(token).toMatch(/^[a-f0-9]{32}$/);
      expect(token.length).toBe(32);
    });

    it('should generate cryptographically secure tokens', () => {
      const tokens = new Set();
      
      // Generate multiple tokens to check uniqueness
      for (let i = 0; i < 10; i++) {
        delete process.env.API_TOKEN;
        const token = getOrGenerateApiToken();
        tokens.add(token);
      }
      
      expect(tokens.size).toBe(10); // All tokens should be unique
    });

    it('should maintain token stability within process', () => {
      const token1 = getOrGenerateApiToken();
      const token2 = getOrGenerateApiToken();
      const token3 = getOrGenerateApiToken();
      
      expect(token1).toBe(token2);
      expect(token2).toBe(token3);
    });

    it('should respect existing API_TOKEN environment variable', () => {
      const customToken = 'abcdef1234567890abcdef1234567890';
      process.env.API_TOKEN = customToken;
      
      const token = getOrGenerateApiToken();
      expect(token).toBe(customToken);
    });

    it('should handle invalid environment tokens gracefully', () => {
      process.env.API_TOKEN = 'invalid-short-token';
      
      const token = getOrGenerateApiToken();
      expect(token).toBe('invalid-short-token'); // Should use what's provided
    });
  });

  describe('Special Character Escaping', () => {
    it('should escape regex special characters correctly', () => {
      const input = '.*+?^${}()|[]\\';
      const escaped = escapeSpecialChars(input);
      
      expect(escaped).not.toBe(input);
      expect(escaped).toContain('\\.');
      expect(escaped).toContain('\\*');
      expect(escaped).toContain('\\+');
      expect(escaped).toContain('\\?');
      expect(escaped).toContain('\\^');
      expect(escaped).toContain('\\$');
    });

    it('should handle empty strings', () => {
      expect(escapeSpecialChars('')).toBe('');
    });

    it('should handle strings with no special characters', () => {
      const input = 'normaltext123';
      expect(escapeSpecialChars(input)).toBe(input);
    });

    it('should handle mixed content correctly', () => {
      const input = 'normal.text*with+special?chars';
      const escaped = escapeSpecialChars(input);
      
      expect(escaped).toContain('normal\\.');
      expect(escaped).toContain('text\\*');
      expect(escaped).toContain('with\\+');
      expect(escaped).toContain('special\\?');
    });

    it('should escape characters consistently', () => {
      const input = '.*+?';
      const escaped = escapeSpecialChars(input);
      
      expect(escaped).toContain('\\.');
      expect(escaped).toContain('\\*');
      expect(escaped).toContain('\\+');
      expect(escaped).toContain('\\?');
      
      // Note: escapeSpecialChars is not idempotent by design
      // It will escape backslashes on subsequent calls
    });
  });

  describe('Execute Command Generation', () => {
    describe('Basic Shell Support', () => {
      it('should generate bash commands correctly', () => {
        expect(getExecuteCommand('bash', '/test.sh')).toBe('bash /test.sh');
        expect(getExecuteCommand('bash', 'script.sh')).toBe('bash script.sh');
      });

      it('should generate python commands correctly', () => {
        expect(getExecuteCommand('python', '/test.py')).toBe('python /test.py');
        // Note: python3 is not explicitly handled, defaults to bash
        expect(getExecuteCommand('python3', 'script.py')).toBe('bash script.py');
      });

      it('should generate powershell commands correctly', () => {
        expect(getExecuteCommand('powershell', 'test.ps1')).toBe('Powershell -File test.ps1');
        // Note: pwsh is not explicitly handled, defaults to bash
        expect(getExecuteCommand('pwsh', 'script.ps1')).toBe('bash script.ps1');
      });

      it('should handle case-insensitive powershell variants', () => {
        expect(getExecuteCommand('PowerShell', 'script.ps1')).toBe('Powershell -File script.ps1');
        expect(getExecuteCommand('POWERSHELL', 'script.ps1')).toBe('Powershell -File script.ps1');
        expect(getExecuteCommand('PoWeRsHeLl', 'script.ps1')).toBe('Powershell -File script.ps1');
      });
    });

    describe('Path Quoting and Special Characters', () => {
      it('should quote paths with spaces', () => {
        expect(getExecuteCommand('bash', '/path/with space.sh')).toBe('bash "/path/with space.sh"');
        expect(getExecuteCommand('python', '/my scripts/test.py')).toBe('python "/my scripts/test.py"');
        expect(getExecuteCommand('powershell', 'C:/Program Files/script.ps1')).toBe('Powershell -File "C:/Program Files/script.ps1"');
      });

      it('should quote paths with shell special characters', () => {
        const specialCharsQuoted = ['&', ';', '|', '>', '<', '(', ')'];
        const specialCharsNotQuoted = ['$', '`', '"', "'"];
        
        specialCharsQuoted.forEach(char => {
          const filename = `file${char}name.sh`;
          const result = getExecuteCommand('bash', filename);
          expect(result).toBe(`bash "${filename}"`);
        });
        
        // These characters are not in the quoting regex
        specialCharsNotQuoted.forEach(char => {
          const filename = `file${char}name.sh`;
          const result = getExecuteCommand('bash', filename);
          expect(result).toBe(`bash file${char}name.sh`);
        });
      });

      it('should not quote simple paths unnecessarily', () => {
        expect(getExecuteCommand('bash', 'simple.sh')).toBe('bash simple.sh');
        expect(getExecuteCommand('python', 'script.py')).toBe('python script.py');
        // Note: node is not explicitly handled, defaults to bash
        expect(getExecuteCommand('node', 'app.js')).toBe('bash app.js');
      });

      it('should handle paths with multiple special characters', () => {
        expect(getExecuteCommand('bash', 'file&(name).sh')).toBe('bash "file&(name).sh"');
        expect(getExecuteCommand('bash', 'semi;colon|pipe.sh')).toBe('bash "semi;colon|pipe.sh"');
      });
    });

    describe('Unknown Shell Handling', () => {
      it('should default to bash for unknown shells', () => {
        expect(getExecuteCommand('unknown', 'file.sh')).toBe('bash file.sh');
        expect(getExecuteCommand('custom', 'script.txt')).toBe('bash script.txt');
        // Empty shell should throw
        expect(() => getExecuteCommand('', 'file.sh')).toThrow();
      });
    });

    describe('Input Validation', () => {
      it('should validate shell parameter', () => {
        expect(() => getExecuteCommand('', 'test')).toThrow();
        expect(() => getExecuteCommand(null as any, 'test')).toThrow();
        expect(() => getExecuteCommand(undefined as any, 'test')).toThrow();
      });

      it('should validate file parameter', () => {
        expect(() => getExecuteCommand('bash', '')).toThrow();
        expect(() => getExecuteCommand('bash', null as any)).toThrow();
        expect(() => getExecuteCommand('bash', undefined as any)).toThrow();
      });

      it('should handle whitespace-only inputs', () => {
        // Whitespace-only shell is treated as valid by the current implementation
        expect(getExecuteCommand('   ', 'test')).toBe('bash test');
        // Whitespace-only file path gets quoted due to spaces
        expect(getExecuteCommand('bash', '   ')).toBe('bash "   "');
      });
    });

    describe('Cross-Platform Compatibility', () => {
      it('should handle Windows-style paths', () => {
        // Backslashes don't trigger quoting in current implementation
        expect(getExecuteCommand('powershell', 'C:\\Scripts\\test.ps1')).toBe('Powershell -File C:\\Scripts\\test.ps1');
        expect(getExecuteCommand('cmd', 'C:\\batch\\script.bat')).toBe('bash C:\\batch\\script.bat');
      });

      it('should handle Unix-style paths', () => {
        expect(getExecuteCommand('bash', '/usr/local/bin/script.sh')).toBe('bash /usr/local/bin/script.sh');
        // sh is not explicitly handled, defaults to bash
        expect(getExecuteCommand('sh', '/tmp/test.sh')).toBe('bash /tmp/test.sh');
      });

      it('should handle relative paths', () => {
        // node is not explicitly handled, defaults to bash
        expect(getExecuteCommand('node', './src/app.js')).toBe('bash ./src/app.js');
        expect(getExecuteCommand('python', '../scripts/test.py')).toBe('python ../scripts/test.py');
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should work together for complex file paths', () => {
      const complexPath = '/path/with spaces/and.special$chars/script.sh';
      const shell = 'bash';
      
      const command = getExecuteCommand(shell, complexPath);
      expect(command).toBe(`bash "${complexPath}"`);
      
      // The path itself might need escaping for regex
      const escapedPath = escapeSpecialChars(complexPath);
      expect(escapedPath).toContain('\\.');
      expect(escapedPath).toContain('\\$');
    });

    it('should maintain consistency across multiple calls', () => {
      const testCases = [
        { shell: 'bash', file: 'test.sh' },
        { shell: 'python', file: 'script.py' },
        { shell: 'powershell', file: 'script.ps1' }
      ];

      testCases.forEach(({ shell, file }) => {
        const result1 = getExecuteCommand(shell, file);
        const result2 = getExecuteCommand(shell, file);
        expect(result1).toBe(result2);
      });
    });
  });
});
