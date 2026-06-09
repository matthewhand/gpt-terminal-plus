import {
  RemoteTargetSchema,
  ExecuteShellSchema,
  ExecuteCodeSchema,
  ExecuteLlmSchema,
  SettingsSchema,
  type Settings,
} from '../schema';

describe('Settings Schema', () => {
  describe('RemoteTargetSchema', () => {
    it('should parse valid remote target with defaults', () => {
      const result = RemoteTargetSchema.parse({});
      expect(result).toEqual({
        enabled: true,
        timeoutMs: 60_000,
      });
    });

    it('should parse complete remote target configuration', () => {
      const input = {
        enabled: false,
        host: 'example.com',
        port: 22,
        user: 'testuser',
        profile: 'production',
        timeoutMs: 30_000,
      };
      const result = RemoteTargetSchema.parse(input);
      expect(result).toEqual(input);
    });

    it('should reject negative port numbers', () => {
      expect(() => {
        RemoteTargetSchema.parse({ port: -1 });
      }).toThrow();
    });

    it('should reject zero port numbers', () => {
      expect(() => {
        RemoteTargetSchema.parse({ port: 0 });
      }).toThrow();
    });

    it('should reject negative timeout values', () => {
      expect(() => {
        RemoteTargetSchema.parse({ timeoutMs: -1000 });
      }).toThrow();
    });

    it('should reject non-integer port numbers', () => {
      expect(() => {
        RemoteTargetSchema.parse({ port: 22.5 });
      }).toThrow();
    });
  });

  describe('ExecuteShellSchema', () => {
    it('should parse with defaults', () => {
      const result = ExecuteShellSchema.parse({});
      expect(result).toEqual({
        enabled: true,
        local: { enabled: true, timeoutMs: 60_000 },
        ssh: { enabled: false, timeoutMs: 120_000 },
        ssm: { enabled: false, timeoutMs: 180_000 },
      });
    });

    it('should parse custom configuration', () => {
      const input = {
        enabled: false,
        local: { enabled: false, host: 'localhost', timeoutMs: 30_000 },
        ssh: { enabled: true, host: 'remote.com', port: 2222, user: 'admin' },
      };
      const result = ExecuteShellSchema.parse(input);
      expect(result.enabled).toBe(false);
      expect(result.local.enabled).toBe(false);
      expect(result.ssh.enabled).toBe(true);
      expect(result.ssh.host).toBe('remote.com');
    });
  });

  describe('ExecuteCodeSchema', () => {
    it('should parse with defaults', () => {
      const result = ExecuteCodeSchema.parse({});
      expect(result).toEqual({
        enabled: true,
        languages: ['bash', 'python', 'node'],
        local: { enabled: true, timeoutMs: 60_000 },
        ssh: { enabled: false, timeoutMs: 120_000 },
        ssm: { enabled: false, timeoutMs: 180_000 },
      });
    });

    it('should parse custom languages', () => {
      const input = {
        languages: ['javascript', 'typescript', 'go'],
      };
      const result = ExecuteCodeSchema.parse(input);
      expect(result.languages).toEqual(['javascript', 'typescript', 'go']);
    });

    it('should validate languages as array of strings', () => {
      expect(() => {
        ExecuteCodeSchema.parse({ languages: ['valid', 123, 'invalid'] });
      }).toThrow();
    });
  });

  describe('ExecuteLlmSchema', () => {
    it('should parse with defaults', () => {
      const result = ExecuteLlmSchema.parse({});
      expect(result).toEqual({
        enabled: true,
        providersAllowed: ['local-mock'],
        local: { enabled: true, timeoutMs: 90_000 },
        ssh: { enabled: false, timeoutMs: 180_000 },
        ssm: { enabled: false, timeoutMs: 180_000 },
      });
    });

    it('should parse custom providers', () => {
      const input = {
        providersAllowed: ['openai', 'ollama', 'anthropic'],
      };
      const result = ExecuteLlmSchema.parse(input);
      expect(result.providersAllowed).toEqual(['openai', 'ollama', 'anthropic']);
    });
  });

  describe('SettingsSchema', () => {
    it('should parse empty object with all defaults', () => {
      const result = SettingsSchema.parse({});
      
      expect(result.app.corsOrigins).toEqual([
        'https://chat.openai.com',
        'https://chatgpt.com',
      ]);
      
      expect(result.features.executeShell.enabled).toBe(true);
      expect(result.features.executeCode.enabled).toBe(true);
      expect(result.features.executeLlm.enabled).toBe(true);
      
      expect(result.llm.enabled).toBe(false);
      expect(result.llm.provider).toBe('none');
      expect(result.llm.defaultModel).toBe('');
      expect(result.llm.baseURL).toBe('');
      expect(result.llm.apiKey).toBe('');
      expect(result.llm.ollamaURL).toBe('http://localhost:11434');
      expect(result.llm.lmstudioURL).toBe('http://localhost:1234/v1');
    });

    it('should parse complete configuration', () => {
      const input = {
        app: {
          corsOrigins: ['https://custom.domain.com'],
        },
        features: {
          executeShell: {
            enabled: false,
            local: { enabled: false },
          },
          executeCode: {
            languages: ['rust', 'go'],
          },
          executeLlm: {
            providersAllowed: ['openai'],
          },
        },
        llm: {
          enabled: true,
          provider: 'openai' as const,
          defaultModel: 'gpt-4',
          apiKey: 'sk-test123',
          baseURL: 'https://api.openai.com/v1',
        },
      };
      
      const result = SettingsSchema.parse(input);
      
      expect(result.app.corsOrigins).toEqual(['https://custom.domain.com']);
      expect(result.features.executeShell.enabled).toBe(false);
      expect(result.features.executeCode.languages).toEqual(['rust', 'go']);
      expect(result.features.executeLlm.providersAllowed).toEqual(['openai']);
      expect(result.llm.enabled).toBe(true);
      expect(result.llm.provider).toBe('openai');
      expect(result.llm.defaultModel).toBe('gpt-4');
    });

    it('should validate LLM provider enum', () => {
      expect(() => {
        SettingsSchema.parse({
          llm: { provider: 'invalid-provider' },
        });
      }).toThrow();
    });

    it('should accept valid LLM providers', () => {
      const validProviders = ['none', 'openai', 'ollama', 'lmstudio', 'litellm'];
      
      validProviders.forEach(provider => {
        expect(() => {
          SettingsSchema.parse({
            llm: { provider },
          });
        }).not.toThrow();
      });
    });

    it('should validate CORS origins as array of strings', () => {
      expect(() => {
        SettingsSchema.parse({
          app: { corsOrigins: ['valid', 123, 'invalid'] },
        });
      }).toThrow();
    });

    it('should handle partial nested updates', () => {
      const input = {
        features: {
          executeShell: {
            local: { timeoutMs: 45_000 },
          },
        },
      };
      
      const result = SettingsSchema.parse(input);
      
      // Should preserve defaults for other properties
      expect(result.features.executeShell.enabled).toBe(true);
      expect(result.features.executeShell.local.enabled).toBe(true);
      expect(result.features.executeShell.local.timeoutMs).toBe(45_000);
      expect(result.features.executeShell.ssh.enabled).toBe(false);
    });
  });

  describe('Type inference', () => {
    it('should infer correct Settings type', () => {
      const settings: Settings = SettingsSchema.parse({});
      
      // Type checks - these should compile without errors
      expect(typeof settings.app.corsOrigins).toBe('object');
      expect(typeof settings.features.executeShell.enabled).toBe('boolean');
      expect(typeof settings.features.executeCode.languages).toBe('object');
      expect(typeof settings.features.executeLlm.providersAllowed).toBe('object');
      expect(typeof settings.llm.enabled).toBe('boolean');
      expect(typeof settings.llm.provider).toBe('string');
    });
  });
});