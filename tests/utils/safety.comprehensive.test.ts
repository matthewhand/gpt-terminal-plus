import { evaluateCommandSafety } from '../../src/utils/safety';

describe('Safety Utils - Comprehensive Tests', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    // Clear environment variables
    delete process.env.DENY_COMMAND_REGEX;
    delete process.env.CONFIRM_COMMAND_REGEX;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('evaluateCommandSafety', () => {
    describe('default deny patterns', () => {
      it('should deny commands ending with :/', () => {
        const result = evaluateCommandSafety('something:/');
        expect(result.hardDeny).toBe(true);
        expect(result.needsConfirm).toBe(false);
        expect(result.reasons.some(r => r.includes('Denied by pattern'))).toBe(true);
      });

      it('should deny various commands ending with :/', () => {
        const commands = [
          'test:/',
          'example:/',
          'path:/'
        ];

        commands.forEach(cmd => {
          const result = evaluateCommandSafety(cmd);
          expect(result.hardDeny).toBe(true);
        });
      });

      it('should not deny rm -rf / (it should need confirmation instead)', () => {
        const result = evaluateCommandSafety('rm -rf /');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true); // Should need confirmation for rm -rf
      });
    });

    describe('default confirm patterns', () => {
      it('should require confirmation for dangerous rm commands', () => {
        const result = evaluateCommandSafety('rm -rf /home/user');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.some(r => r.includes('rm'))).toBe(true);
      });

      it('should require confirmation for mkfs commands', () => {
        const result = evaluateCommandSafety('mkfs.ext4 /dev/sda1');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.some(r => r.includes('mkfs'))).toBe(true);
      });

      it('should require confirmation for dd commands with space before if=', () => {
        const result = evaluateCommandSafety('dd if=test of=/dev/sda');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.some(r => r.includes('dd'))).toBe(true);
      });

      it('should not require confirmation for dd commands without proper spacing', () => {
        const result = evaluateCommandSafety('dd if=/dev/zero of=/dev/sda');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(false);
      });

      it('should require confirmation for shutdown commands', () => {
        const result = evaluateCommandSafety('shutdown -h now');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.some(r => r.includes('shutdown'))).toBe(true);
      });

      it('should require confirmation for reboot commands', () => {
        const result = evaluateCommandSafety('reboot');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.some(r => r.includes('reboot'))).toBe(true);
      });

      it('should require confirmation for userdel commands', () => {
        const result = evaluateCommandSafety('userdel -r username');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.some(r => r.includes('userdel'))).toBe(true);
      });

      it('should require confirmation for iptables flush', () => {
        const result = evaluateCommandSafety('iptables -F');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.some(r => r.includes('iptables'))).toBe(true);
      });

      it('should require confirmation for systemctl stop', () => {
        const result = evaluateCommandSafety('systemctl stop nginx');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.some(r => r.includes('systemctl'))).toBe(true);
      });
    });

    describe('safe commands', () => {
      it('should allow safe commands without confirmation', () => {
        const safeCommands = [
          'ls -la',
          'cat /etc/passwd',
          'ps aux',
          'df -h',
          'free -m',
          'uptime',
          'whoami',
          'pwd',
          'echo "hello world"',
          'grep pattern file.txt',
          'find /home -name "*.txt"',
          'tail -f /var/log/syslog'
        ];

        safeCommands.forEach(cmd => {
          const result = evaluateCommandSafety(cmd);
          expect(result.hardDeny).toBe(false);
          expect(result.needsConfirm).toBe(false);
          expect(result.reasons).toHaveLength(0);
        });
      });
    });

    describe('environment variable overrides', () => {
      it('should use DENY_COMMAND_REGEX from environment', () => {
        process.env.DENY_COMMAND_REGEX = 'dangerous_command';
        
        const result = evaluateCommandSafety('dangerous_command --flag');
        expect(result.hardDeny).toBe(true);
        expect(result.reasons.some(r => r.includes('dangerous_command'))).toBe(true);
      });

      it('should use CONFIRM_COMMAND_REGEX from environment', () => {
        process.env.CONFIRM_COMMAND_REGEX = 'careful_command';
        
        const result = evaluateCommandSafety('careful_command --flag');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.some(r => r.includes('careful_command'))).toBe(true);
      });

      it('should handle multiple patterns in environment variables', () => {
        process.env.DENY_COMMAND_REGEX = 'cmd1,cmd2,cmd3';
        process.env.CONFIRM_COMMAND_REGEX = 'warn1,warn2';
        
        const denyResult = evaluateCommandSafety('cmd2 test');
        expect(denyResult.hardDeny).toBe(true);
        
        const confirmResult = evaluateCommandSafety('warn1 test');
        expect(confirmResult.needsConfirm).toBe(true);
      });

      it('should handle invalid regex patterns gracefully', () => {
        process.env.DENY_COMMAND_REGEX = '[invalid regex';
        
        // Should fall back to defaults without throwing
        const result = evaluateCommandSafety('test:/');
        expect(result.hardDeny).toBe(true); // Should still catch with default patterns
      });

      it('should handle empty environment variables', () => {
        process.env.DENY_COMMAND_REGEX = '';
        process.env.CONFIRM_COMMAND_REGEX = '';
        
        // Should use defaults
        const result = evaluateCommandSafety('rm -rf /home');
        expect(result.needsConfirm).toBe(true);
      });
    });

    describe('case insensitive matching', () => {
      it('should match patterns case insensitively', () => {
        const commands = [
          'RM -RF /home',
          'Rm -Rf /home',
          'SHUTDOWN now',
          'Shutdown now',
          'REBOOT',
          'Reboot'
        ];

        commands.forEach(cmd => {
          const result = evaluateCommandSafety(cmd);
          expect(result.needsConfirm || result.hardDeny).toBe(true);
        });
      });
    });

    describe('complex command scenarios', () => {
      it('should handle commands with pipes and redirects', () => {
        const result = evaluateCommandSafety('cat /etc/passwd | grep root > /tmp/output');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(false);
      });

      it('should handle commands with multiple dangerous patterns', () => {
        const result = evaluateCommandSafety('rm -rf /tmp && shutdown -h now');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(true);
        expect(result.reasons.length).toBeGreaterThan(1);
      });

      it('should handle commands with sudo', () => {
        const result = evaluateCommandSafety('sudo rm -rf /var/log');
        expect(result.needsConfirm).toBe(true);
      });

      it('should handle commands with full paths', () => {
        const result = evaluateCommandSafety('/bin/rm -rf /tmp/test');
        expect(result.needsConfirm).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should handle empty commands', () => {
        const result = evaluateCommandSafety('');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(false);
        expect(result.reasons).toHaveLength(0);
      });

      it('should handle whitespace-only commands', () => {
        const result = evaluateCommandSafety('   \t\n  ');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(false);
        expect(result.reasons).toHaveLength(0);
      });

      it('should handle very long commands', () => {
        const longCommand = 'echo ' + 'a'.repeat(10000);
        const result = evaluateCommandSafety(longCommand);
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(false);
      });

      it('should handle commands with special characters', () => {
        const result = evaluateCommandSafety('echo "Hello $USER & friends!"');
        expect(result.hardDeny).toBe(false);
        expect(result.needsConfirm).toBe(false);
      });
    });

    describe('pattern matching accuracy', () => {
      it('should not match partial words incorrectly', () => {
        // These should not trigger rm -rf pattern
        const safeCommands = [
          'format disk',
          'confirm action',
          'perform task'
        ];

        safeCommands.forEach(cmd => {
          const result = evaluateCommandSafety(cmd);
          expect(result.hardDeny).toBe(false);
          expect(result.needsConfirm).toBe(false);
        });
      });

      it('should match word boundaries correctly', () => {
        // These should trigger patterns
        const dangerousCommands = [
          'rm -rf /tmp',
          'userdel user',
          'shutdown now'
        ];

        dangerousCommands.forEach(cmd => {
          const result = evaluateCommandSafety(cmd);
          expect(result.needsConfirm || result.hardDeny).toBe(true);
        });
      });
    });
  });
});
