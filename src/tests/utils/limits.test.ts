import { enforceInputLimit, clipOutput, getLimitConfig } from '../../utils/limits';
import { convictConfig } from '../../config/convictConfig';

describe('utils/limits', () => {
  const originalEnv = { ...process.env } as NodeJS.ProcessEnv;

  afterEach(() => {
    // Reset env and any cached config after each test
    process.env = { ...originalEnv } as any;
  });

  describe('getLimitConfig', () => {
    it('returns sane defaults and reflects env overrides', () => {
      // Defaults
      const def = getLimitConfig();
      expect(def.maxInputChars).toBeGreaterThan(0);
      expect(def.maxOutputChars).toBeGreaterThan(0);
      expect(typeof def.allowTruncation).toBe('boolean');

      // Env overrides (fresh convict per test env)
      process.env.MAX_INPUT_CHARS = '1234';
      process.env.MAX_OUTPUT_CHARS = '5678';
      process.env.ALLOW_TRUNCATION = 'false';
      const cfg = convictConfig();
      // Validate we actually read envs
      expect((cfg as any).get('limits.maxInputChars')).toBe(1234);
      expect((cfg as any).get('limits.maxOutputChars')).toBe(5678);
      expect((cfg as any).get('limits.allowTruncation')).toBe(false);
      const withEnv = getLimitConfig();
      expect(withEnv.maxInputChars).toBe(1234);
      expect(withEnv.maxOutputChars).toBe(5678);
      expect(withEnv.allowTruncation).toBe(false);
    });

    it('applies active profile session overrides when present', () => {
      // Mock convictConfig for this isolated module load so that profiles are present
      jest.isolateModules(() => {
        jest.doMock('../../config/convictConfig', () => ({
          convictConfig: () => ({
            get: (key: string) => {
              switch (key) {
                case 'limits.maxInputChars': return 10000;
                case 'limits.maxOutputChars': return 200000;
                case 'limits.maxSessionDurationSec': return 7200;
                case 'limits.maxSessionIdleSec': return 600;
                case 'limits.maxLlmCostUsd': return 0;
                case 'limits.allowTruncation': return true;
                case 'profiles': return [
                  { name: 'default', session: { maxInputChars: 50, maxOutputChars: 60, maxDuration: 10, maxIdle: 5 } }
                ];
                case 'activeProfile': return 'default';
                default: return undefined;
              }
            }
          })
        }));
        const { getLimitConfig: freshGetLimitConfig } = require('../../utils/limits');
        const cfgOverlay = freshGetLimitConfig();
        expect(cfgOverlay.maxInputChars).toBe(50);
        expect(cfgOverlay.maxOutputChars).toBe(60);
        expect(cfgOverlay.maxSessionDurationSec).toBe(10);
        expect(cfgOverlay.maxSessionIdleSec).toBe(5);
      });
    });
  });

  describe('enforceInputLimit', () => {
    it('allows inputs under threshold', () => {
      process.env.MAX_INPUT_CHARS = '10';
      const res = enforceInputLimit('test', '12345');
      expect((res as any).ok).toBe(true);
      expect((res as any).truncated).toBeUndefined();
    });

    it('treats empty input as ok', () => {
      process.env.MAX_INPUT_CHARS = '0';
      const res = enforceInputLimit('test', '');
      expect(res).toEqual({ ok: true });
    });

    it('truncates when over limit and truncation allowed', () => {
      process.env.MAX_INPUT_CHARS = '5';
      process.env.ALLOW_TRUNCATION = 'true';
      const res = enforceInputLimit('test', 'ABCDEFGHIJ');
      expect((res as any).ok).toBe(true);
      expect((res as any).truncated).toBe(true);
      expect((res as any).value).toBe('ABCDE');
    });

    it('rejects when over limit and truncation disabled', () => {
      process.env.MAX_INPUT_CHARS = '3';
      process.env.ALLOW_TRUNCATION = 'false';
      const res = enforceInputLimit('test', 'WXYZ');
      expect((res as any).ok).toBe(false);
      expect((res as any).payload?.error).toMatch(/exceeded/i);
      expect((res as any).payload?.truncated).toBe(true);
      expect((res as any).payload?.stdout).toBe('WXY');
    });
  });

  describe('clipOutput', () => {
    it('returns original output when under limit', () => {
      process.env.MAX_OUTPUT_CHARS = '100';
      const out = clipOutput('aaa', 'bbb');
      expect(out.truncated).toBe(false);
      expect(out.stdout).toBe('aaa');
      expect(out.stderr).toBe('bbb');
    });

    it('clips proportionally when over combined limit', () => {
      // Total len = 10; allow only 5; expect ratio 8:2 -> stdout 4, stderr 1
      process.env.MAX_OUTPUT_CHARS = '5';
      const out = clipOutput('ABCDEFGH', 'IJ');
      expect(out.truncated).toBe(true);
      expect(out.stdout).toBe('ABCD');
      expect(out.stderr).toBe('I');
    });

    it('clips only stderr when stdout is empty', () => {
      process.env.MAX_OUTPUT_CHARS = '4';
      const out = clipOutput('', 'ABCDEFG');
      expect(out.truncated).toBe(true);
      expect(out.stdout).toBe('');
      expect(out.stderr).toBe('ABCD');
    });
  });
});
