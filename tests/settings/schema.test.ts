import {
  SettingsSchema,
  ExecuteShellSchema,
  ExecuteCodeSchema,
} from '../../src/settings/schema';

describe('SettingsSchema', () => {
  it('applies sensible defaults for top-level settings', () => {
    const parsed = SettingsSchema.parse({});

    // server defaults
    expect(parsed.server.port).toBe(5004);
    expect(parsed.server.host).toBe('0.0.0.0');

    expect(parsed.auth.apiToken).toMatch(/^gtp-token-/);
    expect(parsed.auth.adminUsername).toBe('admin');
    expect(parsed.auth.adminPassword).toMatch(/^admin-/);

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

  it.each([
    ['ollama', true],
    ['openai', true],
    ['none', true],
    ['invalid-provider', false],
  ])('enforces valid llm.provider %s (success=%s)', (provider, expectedSuccess) => {
    const res = SettingsSchema.safeParse({ llm: { provider } });
    expect(res.success).toBe(expectedSuccess);
  });

  it('generates unique random auth tokens and passwords on each parse', () => {
    const parsed1 = SettingsSchema.parse({});
    const parsed2 = SettingsSchema.parse({});
    expect(parsed1.auth.apiToken).not.toBe(parsed2.auth.apiToken);
    expect(parsed1.auth.adminPassword).not.toBe(parsed2.auth.adminPassword);
    expect(parsed1.auth.apiToken).toMatch(/^gtp-token-/);
    expect(parsed1.auth.adminPassword).toMatch(/^admin-/);
  });

  it('parses full settings with nested overrides and specific file/llm flags', () => {
    const input = {
      server: { port: 3000, host: 'localhost' },
      auth: { adminUsername: 'user' },
      app: { corsOrigins: ['https://example.com'] },
      execution: {
        shell: { local: { timeoutMs: 30000 } },
        code: { languages: ['js'] },
        llm: { providersAllowed: ['ollama'] }
      },
      files: { enabled: false, fsRead: true },
      llm: { provider: 'ollama', enabled: true, ollamaURL: 'http://localhost:11434' }
    };
    const parsed = SettingsSchema.parse(input);
    expect(parsed.server.port).toBe(3000);
    expect(parsed.app.corsOrigins).toEqual(['https://example.com']);
    expect(parsed.execution.shell.local.timeoutMs).toBe(30000);
    expect(parsed.execution.code.languages).toEqual(['js']);
    expect(parsed.llm.provider).toBe('ollama');
    expect(parsed.llm.ollamaURL).toBe('http://localhost:11434');
    expect(parsed.files.enabled).toBe(false);
    expect(parsed.files.fsRead).toBe(true);
  });

  it('rejects invalid port and invalid llm provider with path info', () => {
    const invalidPort = SettingsSchema.safeParse({ server: { port: 'invalid' } });
    expect(invalidPort.success).toBe(false);
    expect(invalidPort.error!.errors[0].path).toEqual(['server', 'port']);

    const outOfRange = SettingsSchema.safeParse({ server: { port: 70000 } });
    expect(outOfRange.success).toBe(false);

    const badLlm = SettingsSchema.safeParse({ llm: { provider: 'invalid' } });
    expect(badLlm.success).toBe(false);
    expect(badLlm.error!.errors[0].path).toEqual(['llm', 'provider']);
  });
});




