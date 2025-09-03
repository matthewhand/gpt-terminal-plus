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

  test('quotes file paths with spaces or special chars', () => {
    expect(getExecuteCommand('bash', '/path/with space.sh')).toBe('bash "/path/with space.sh"');
    expect(getExecuteCommand('powershell', 'C:/Program Files/script.ps1')).toBe('Powershell -File "C:/Program Files/script.ps1"');
    expect(getExecuteCommand('unknown', 'file(name).sh')).toBe('bash "file(name).sh"');
  });

  test('should handle edge cases in utilities', () => {
    expect(() => getExecuteCommand('', 'test')).toThrow();
    expect(() => getExecuteCommand('bash', '')).toThrow();
    expect(escapeSpecialChars('')).toBe('');
  });

  test('powershell casing is treated case-insensitively', () => {
    expect(getExecuteCommand('PoWeRsHeLl', 'script.ps1')).toBe('Powershell -File script.ps1');
  });

  test('quotes paths containing special shell characters', () => {
    expect(getExecuteCommand('bash', 'file&(name).sh')).toBe('bash "file&(name).sh"');
    expect(getExecuteCommand('bash', 'semi;colon.sh')).toBe('bash "semi;colon.sh"');
    expect(getExecuteCommand('bash', 'pipe|name.sh')).toBe('bash "pipe|name.sh"');
    expect(getExecuteCommand('bash', 'redir>name.sh')).toBe('bash "redir>name.sh"');
    expect(getExecuteCommand('bash', 'redir<name.sh')).toBe('bash "redir<name.sh"');
    expect(getExecuteCommand('python', 'no_specials.py')).toBe('python no_specials.py');
  });

  test('returns same token across multiple calls once set', () => {
    // Force a fresh token generation
    delete process.env.API_TOKEN;
    const token1 = getOrGenerateApiToken();
    const token2 = getOrGenerateApiToken();
    expect(token1).toBe(token2);
    expect(typeof token1).toBe('string');
  });
});
