import { z } from 'zod';
import {
  SettingsSchema,
  ExecuteShellSchema,
  ExecuteCodeSchema,
  ExecuteLlmSchema,
} from '../../src/settings/schema';

describe('SettingsSchema', () => {
  it('applies sensible defaults for top-level settings', () => {
    const parsed = SettingsSchema.parse({});

    // server defaults
    expect(parsed.server.port).toBe(5004);
    expect(parsed.server.host).toBe('0.0.0.0');

    // auth defaults (randomized but with stable prefixes/types)
    expect(typeof parsed.auth.apiToken).toBe('string');
    expect(parsed.auth.apiToken).toMatch(/^gtp-token-/);
    expect(parsed.auth.adminUsername).toBe('admin');
    expect(typeof parsed.auth.adminPassword).toBe('string');

    // app defaults
    expect(Array.isArray(parsed.app.corsOrigins)).toBe(true);
    expect(parsed.app.corsOrigins).toContain('*');

    // files defaults
    expect(parsed.files.enabled).toBe(true);

    // features defaults (mirrors execution groups)
    expect(parsed.features.executeShell.enabled).toBe(true);
    expect(parsed.features.executeCode.enabled).toBe(true);
    expect(parsed.features.executeLlm.enabled).toBe(true);

    // llm defaults
    expect(parsed.llm.enabled).toBe(false);
    expect(parsed.llm.provider).toBe('none');
    expect(parsed.llm.defaultModel).toBe('');
  });

  it('supports override of nested execution timeouts and languages', () => {
    const parsed = SettingsSchema.parse({
      execution: {
        code: {
          local: { timeoutMs: 10_000 },
          languages: ['bash', 'python', 'node'],
        },
        shell: {
          ssh: { enabled: true, timeoutMs: 120_000 },
        },
      },
    });

    expect(parsed.execution.code.local.timeoutMs).toBe(10_000);
    expect(parsed.execution.code.languages).toEqual(['bash', 'python', 'node']);
    expect(parsed.execution.shell.ssh.enabled).toBe(true);
    expect(parsed.execution.shell.ssh.timeoutMs).toBe(120_000);
  });

  it('exposes provider allowlist defaults for LLM execution', () => {
    const parsed = SettingsSchema.parse({});
    expect(parsed.execution.llm.providersAllowed).toEqual(['local-mock']);
    expect(parsed.execution.llm.local.timeoutMs).toBeGreaterThan(0);
  });

  it('rejects invalid negative or zero timeout values', () => {
    // Directly parse with invalid values; positive() should reject them
    expect(() =>
      ExecuteShellSchema.parse({
        enabled: true,
        local: { enabled: true, timeoutMs: 0 },
        ssh: { enabled: false, timeoutMs: 120_000 },
        ssm: { enabled: false, timeoutMs: 180_000 },
      })
    ).toThrow();

    expect(() =>
      ExecuteCodeSchema.parse({
        enabled: true,
        languages: ['python'],
        local: { enabled: true, timeoutMs: -1 },
      })
    ).toThrow();
  });

  it('enforces valid llm.provider enum and rejects invalid values', () => {
    const good = SettingsSchema.safeParse({ llm: { provider: 'ollama', enabled: true } });
    expect(good.success).toBe(true);

    const bad = SettingsSchema.safeParse({ llm: { provider: 'invalid-provider' as any } });
    expect(bad.success).toBe(false);
  });
});


it('should generate unique random auth tokens and passwords', () => {
  const parsed1 = SettingsSchema.parse({});
  const parsed2 = SettingsSchema.parse({});
  expect(parsed1.auth.apiToken).not.toBe(parsed2.auth.apiToken);
  expect(parsed1.auth.adminPassword).not.toBe(parsed2.adminPassword);
  expect(parsed1.auth.apiToken).toMatch(/^gtp-token-/);
  expect(parsed1.auth.adminPassword).toMatch(/^admin-/);
});

it('should validate llm provider enum values', () => {
  const validProviders = ['none', 'openai', 'ollama', 'lmstudio', 'litellm'];
  validProviders.forEach(provider => {
    const parsed = SettingsSchema.safeParse({ llm: { provider } });
    expect(parsed.success).toBe(true);
  });
});

it('should reject invalid llm provider', () => {
  const parsed = SettingsSchema.safeParse({ llm: { provider: 'invalid' } });
  expect(parsed.success).toBe(false);
  expect(parsed.error.errors[0].path).toEqual([ 'llm', 'provider' ]);
});

it('should parse full settings with nested overrides', () => {
  const input = {
    server: { port: 3000, host: 'localhost' },
    auth: { adminUsername: 'user' },
    app: { corsOrigins: ['https://example.com'] },
    execution: {
      shell: { local: { timeoutMs: 30000 } },
      code: { languages: ['js'] },
      llm: { providersAllowed: ['ollama'] }
    },
    files: { enabled: false },
    llm: { provider: 'ollama', enabled: true, ollamaURL: 'http://localhost:11434' }
  };
  const parsed = SettingsSchema.parse(input);
  expect(parsed.server.port).toBe(3000);
  expect(parsed.app.corsOrigins).toEqual(['https://example.com']);
  expect(parsed.execution.shell.local.timeoutMs).toBe(30000);
  expect(parsed.execution.code.languages).toEqual(['js']);
  expect(parsed.llm.provider).toBe('ollama');
  expect(parsed.llm.ollamaURL).toBe('http://localhost:11434');
});

it('should reject invalid port (non-number or out of range)', () => {
  const invalid = SettingsSchema.safeParse({ server: { port: 'invalid' } });
  expect(invalid.success).toBe(false);
  expect(invalid.error.errors[0].path).toEqual([ 'server', 'port' ]);

  const outOfRange = SettingsSchema.safeParse({ server: { port: 70000 } });
  expect(outOfRange.success).toBe(false); // Assuming port format is 'port' which is 0-65535
});

it('should validate file ops enabled', () => {
  const parsed = SettingsSchema.parse({ files: { enabled: false, fsRead: true } });
  expect(parsed.files.enabled).toBe(false);
  expect(parsed.files.fsRead).toBe(true);
});