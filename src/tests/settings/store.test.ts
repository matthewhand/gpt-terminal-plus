import { SettingsStore } from '@src/settings/store';

describe('SettingsStore', () => {
  beforeEach(() => {
    // Ensure a clean start for each test
    // Accessing get() forces lazy init with defaults under NODE_ENV=test
    const initial = SettingsStore.get();
    // Replace with defaults to avoid cross-test pollution
    SettingsStore.replace(initial);
  });

  it('returns defaults and reports feature enablement', () => {
    const settings = SettingsStore.get();
    expect(settings.features.executeShell.enabled).toBe(true);
    expect(SettingsStore.isEnabled('executeShell')).toBe(true);
  });

  it('toggles a feature via setEnabled', () => {
    const s1 = SettingsStore.setEnabled('executeCode', false);
    expect(s1.features.executeCode.enabled).toBe(false);
    expect(SettingsStore.isEnabled('executeCode')).toBe(false);

    const s2 = SettingsStore.setEnabled('executeCode', true);
    expect(s2.features.executeCode.enabled).toBe(true);
  });

  it('merges nested feature updates without losing others', () => {
    const updated = SettingsStore.set({
      features: {
        executeCode: {
          enabled: false,
          local: { timeoutMs: 1234 },
        },
      },
    });

    expect(updated.features.executeCode.enabled).toBe(false);
    expect(updated.features.executeCode.local.timeoutMs).toBe(1234);
    // Other feature sections remain present with defaults
    expect(updated.features.executeShell).toBeDefined();
    expect(updated.features.executeLlm).toBeDefined();
  });

  it('merges top-level sections (app, llm) shallowly', () => {
    const next = SettingsStore.set({ app: { corsOrigins: ['http://example.com'] } });
    expect(next.app.corsOrigins).toEqual(['http://example.com']);

    const next2 = SettingsStore.set({ llm: { enabled: true, provider: 'ollama' as any } });
    expect(next2.llm.enabled).toBe(true);
    expect(next2.llm.provider).toBe('ollama');
  });

  it('replace() fully swaps settings and preserves validation', () => {
    const replaced = SettingsStore.replace({
      server: { port: 6001, host: '127.0.0.1' },
      auth: { apiToken: 't', adminUsername: 'u', adminPassword: 'p' },
      app: { corsOrigins: ['*'] },
      execution: {
        shell: { enabled: true, local: { enabled: true, timeoutMs: 1000 }, ssh: { enabled: false, timeoutMs: 2000 }, ssm: { enabled: false, timeoutMs: 3000 } },
        code: { enabled: false, local: { enabled: true, timeoutMs: 1000 }, ssh: { enabled: false, timeoutMs: 2000 }, ssm: { enabled: false, timeoutMs: 3000 } },
        llm: { enabled: true, providersAllowed: ['local-mock'], local: { enabled: true, timeoutMs: 1000 }, ssh: { enabled: false, timeoutMs: 2000 }, ssm: { enabled: false, timeoutMs: 3000 } },
      },
      files: { enabled: true },
      features: {
        executeShell: { enabled: true, local: { enabled: true, timeoutMs: 1000 }, ssh: { enabled: false, timeoutMs: 2000 }, ssm: { enabled: false, timeoutMs: 3000 } },
        executeCode: { enabled: false, local: { enabled: true, timeoutMs: 1000 }, ssh: { enabled: false, timeoutMs: 2000 }, ssm: { enabled: false, timeoutMs: 3000 } },
        executeLlm: { enabled: true, local: { enabled: true, timeoutMs: 1000 }, ssh: { enabled: false, timeoutMs: 2000 }, ssm: { enabled: false, timeoutMs: 3000 } },
      },
      llm: { enabled: false, provider: 'none', defaultModel: '', baseURL: '', apiKey: '', ollamaURL: 'http://localhost:11434', lmstudioURL: 'http://localhost:1234/v1' },
    } as any);

    expect(replaced.server.port).toBe(6001);
    expect(replaced.features.executeCode.enabled).toBe(false);
    // Optional fields not provided should remain undefined/omitted
    expect((replaced.server as any).publicBaseUrl).toBeUndefined();
  });
});
