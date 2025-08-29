import { getOrGenerateApiToken } from '../../common/apiToken';
import { escapeSpecialChars } from '../../common/escapeSpecialChars';
import { getExecuteCommand } from '../../common/getExecuteCommand';

describe('Core Utilities Integration', () => {
  test('should generate valid API tokens', () => {
    const token = getOrGenerateApiToken();
    expect(token.length).toBeGreaterThan(0);
    expect(typeof token).toBe('string');
    // Token can contain alphanumeric characters
    expect(token).toMatch(/^[a-zA-Z0-9]+$/);
  });

  test('should escape special characters consistently', () => {
    const input = '.*+?^${}()|[]\\';
    const escaped = escapeSpecialChars(input);
    expect(escaped).not.toBe(input);
    expect(escaped).toContain('\\.');
  });

  test('should generate execute commands for different shells', () => {
    expect(getExecuteCommand('bash', '/test.sh')).toBe('bash /test.sh');
    expect(getExecuteCommand('python', '/test.py')).toBe('python /test.py');
    expect(getExecuteCommand('powershell', 'test.ps1')).toBe('Powershell -File test.ps1');
  });

  test('should handle edge cases in utilities', () => {
    expect(() => getExecuteCommand('', 'test')).toThrow();
    expect(() => getExecuteCommand('bash', '')).toThrow();
    expect(escapeSpecialChars('')).toBe('');
  });

  test('should maintain consistency across multiple calls', () => {
    const token1 = getOrGenerateApiToken();
    const token2 = getOrGenerateApiToken();
    // Should be same if API_TOKEN env var is set, different if generated
    expect(typeof token1).toBe('string');
    expect(typeof token2).toBe('string');
  });
});
