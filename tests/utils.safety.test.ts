import { evaluateCommandSafety } from '../src/utils/safety';

describe('Command Safety Evaluation', () => {
  const originalEnv = {
    DENY_COMMAND_REGEX: process.env.DENY_COMMAND_REGEX,
    CONFIRM_COMMAND_REGEX: process.env.CONFIRM_COMMAND_REGEX
  };

  beforeEach(() => {
    // Reset environment for each test
    delete process.env.DENY_COMMAND_REGEX;
    delete process.env.CONFIRM_COMMAND_REGEX;
  });

  afterEach(() => {
    // Restore original environment
    process.env.DENY_COMMAND_REGEX = originalEnv.DENY_COMMAND_REGEX;
    process.env.CONFIRM_COMMAND_REGEX = originalEnv.CONFIRM_COMMAND_REGEX;
  });

  describe('Environment Pattern Configuration', () => {
    it('should use custom deny patterns from environment', () => {
      process.env.DENY_COMMAND_REGEX = 'danger|malicious';
      const cases = [
        { cmd: 'echo hello', hardDeny: false, needsConfirm: false },
        { cmd: 'do danger things', hardDeny: true, needsConfirm: false },
        { cmd: 'run malicious script', hardDeny: true, needsConfirm: false },
      ];
      cases.forEach(({ cmd, hardDeny, needsConfirm }) => {
        const result = evaluateCommandSafety(cmd);
        expect(result.hardDeny).toBe(hardDeny);
        expect(result.needsConfirm).toBe(needsConfirm);
      });
    });

    it('should use custom confirm patterns from environment', () => {
      process.env.CONFIRM_COMMAND_REGEX = 'rm\\s+-rf|sudo\\s+';
      const cases = [
        { cmd: 'ls -la', hardDeny: false, needsConfirm: false },
        { cmd: 'rm -rf /tmp/demo', hardDeny: false, needsConfirm: true },
        { cmd: 'sudo apt update', hardDeny: false, needsConfirm: true },
      ];
      cases.forEach(({ cmd, hardDeny, needsConfirm }) => {
        const result = evaluateCommandSafety(cmd);
        expect(result.hardDeny).toBe(hardDeny);
        expect(result.needsConfirm).toBe(needsConfirm);
      });
    });

    it('should handle both deny and confirm patterns together', () => {
      process.env.DENY_COMMAND_REGEX = 'format\\s+c:|del\\s+/s';
      process.env.CONFIRM_COMMAND_REGEX = 'rm\\s+-rf|sudo\\s+';
      const cases = [
        { cmd: 'echo test', hardDeny: false, needsConfirm: false },
        { cmd: 'rm -rf /tmp', hardDeny: false, needsConfirm: true },
        { cmd: 'format c:', hardDeny: true, needsConfirm: false },
      ];
      cases.forEach(({ cmd, hardDeny, needsConfirm }) => {
        const result = evaluateCommandSafety(cmd);
        expect(result.hardDeny).toBe(hardDeny);
        expect(result.needsConfirm).toBe(needsConfirm);
      });
    });
  });

  describe('Default Safety Patterns', () => {
    it('should have sensible defaults when no environment patterns are set', () => {
      const safeCommands = [
        'echo hello',
        'ls -la',
        'cat file.txt',
        'pwd',
        'whoami'
      ];

      safeCommands.forEach(command => {
        const result = evaluateCommandSafety(command);
        expect(result.hardDeny).toBe(false);
        // Some may need confirmation based on default patterns
      });
    });

    it('should handle potentially dangerous commands appropriately', () => {
      const potentiallyDangerousCommands = [
        'rm -rf /',
        'sudo rm -rf /',
        'mkfs /dev/sda1',
        'shutdown now'
      ];

      potentiallyDangerousCommands.forEach(command => {
        const result = evaluateCommandSafety(command);
        // Should either deny or require confirmation based on default patterns
        expect(result.hardDeny || result.needsConfirm).toBe(true);
        expect(Array.isArray(result.reasons)).toBe(true);
      });
    });
  });

  describe('Edge Cases and Input Validation', () => {
    it('should handle empty commands', () => {
      const result = evaluateCommandSafety('');
      expect(result).toHaveProperty('hardDeny');
      expect(result).toHaveProperty('needsConfirm');
      expect(typeof result.hardDeny).toBe('boolean');
      expect(typeof result.needsConfirm).toBe('boolean');
    });

    it('should handle whitespace-only commands', () => {
      const result = evaluateCommandSafety('   \t\n   ');
      expect(result).toHaveProperty('hardDeny');
      expect(result).toHaveProperty('needsConfirm');
    });

    it('should handle commands with special regex characters', () => {
      const commandsWithSpecialChars = [
        'echo ".*+?^${}()|[]"',
        'grep "pattern.*" file.txt',
        'sed "s/old/new/g" file.txt'
      ];

      commandsWithSpecialChars.forEach(command => {
        expect(() => evaluateCommandSafety(command)).not.toThrow();
      });
    });

    it('should handle very long commands', () => {
      const longCommand = 'echo ' + 'a'.repeat(10000);
      expect(() => evaluateCommandSafety(longCommand)).not.toThrow();
    });
  });

  describe('Pattern Matching Behavior', () => {
    it('should handle case sensitivity in patterns', () => {
      process.env.DENY_COMMAND_REGEX = 'DANGER';
      
      const lowerCase = evaluateCommandSafety('danger command');
      const upperCase = evaluateCommandSafety('DANGER command');
      
      // Note: patterns are parsed with 'i' flag, so they are case-insensitive
      expect(lowerCase.hardDeny).toBe(true);
      expect(upperCase.hardDeny).toBe(true);
    });

    it('should support regex word boundaries', () => {
      process.env.DENY_COMMAND_REGEX = '\\bdanger\\b';
      
      const exactMatch = evaluateCommandSafety('danger');
      const partialMatch = evaluateCommandSafety('dangerous');
      
      expect(exactMatch.hardDeny).toBe(true);
      expect(partialMatch.hardDeny).toBe(false);
    });

    it('should handle invalid regex patterns gracefully', () => {
      process.env.DENY_COMMAND_REGEX = '[invalid regex';
      
      expect(() => evaluateCommandSafety('test command')).not.toThrow();
    });
  });

  describe('Return Value Structure', () => {
    it('should always return an object with required properties', () => {
      const result = evaluateCommandSafety('test');
      
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('hardDeny');
      expect(result).toHaveProperty('needsConfirm');
      expect(typeof result.hardDeny).toBe('boolean');
      expect(typeof result.needsConfirm).toBe('boolean');
    });

    it('should never have both hardDeny and needsConfirm as true', () => {
      const testCommands = [
        'echo test',
        'rm -rf /',
        'sudo dangerous',
        'format c:'
      ];

      testCommands.forEach(command => {
        const result = evaluateCommandSafety(command);
        expect(!(result.hardDeny && result.needsConfirm)).toBe(true);
      });
    });
  });
});

