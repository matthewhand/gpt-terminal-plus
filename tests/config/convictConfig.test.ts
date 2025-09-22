import { convictConfig, persistConfig } from '../../src/config/convictConfig';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Convict Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('configuration creation', () => {
    it('should create configuration with default values', () => {
      const config = convictConfig();
      
      expect(config.get('server.port')).toBe(5005);
      expect(config.get('server.httpsEnabled')).toBe(false);
      expect(config.get('server.corsOrigin')).toBe('https://chat.openai.com,https://chatgpt.com');
      expect(config.get('server.disableHealthLog')).toBe(false);
      expect(config.get('server.sseHeartbeatMs')).toBe(15000);
    });

    it('should load values from environment variables', () => {
      process.env.PORT = '8080';
      process.env.HTTPS_ENABLED = 'true';
      process.env.CORS_ORIGIN = 'https://example.com';
      process.env.DISABLE_HEALTH_LOG = 'true';
      process.env.SSE_HEARTBEAT_MS = '30000';

      const config = convictConfig();

      expect(config.get('server.port')).toBe(8080);
      expect(config.get('server.httpsEnabled')).toBe(true);
      expect(config.get('server.corsOrigin')).toBe('https://example.com');
      expect(config.get('server.disableHealthLog')).toBe(true);
      expect(config.get('server.sseHeartbeatMs')).toBe(30000);
    });

    it('should handle HTTPS configuration', () => {
      process.env.HTTPS_ENABLED = 'true';
      process.env.HTTPS_KEY_PATH = '/path/to/key.pem';
      process.env.HTTPS_CERT_PATH = '/path/to/cert.pem';

      const config = convictConfig();

      expect(config.get('server.httpsEnabled')).toBe(true);
      expect(config.get('server.httpsKeyPath')).toBe('/path/to/key.pem');
      expect(config.get('server.httpsCertPath')).toBe('/path/to/cert.pem');
    });

    it('should handle security configuration', () => {
      process.env.API_TOKEN = 'test-token-123';

      const config = convictConfig();

      expect(config.get('security.apiToken')).toBe('test-token-123');
    });

    it('should handle LLM configuration', () => {
      process.env.OPENAI_API_KEY = 'sk-test123';
      process.env.AI_PROVIDER = 'ollama';
      process.env.OLLAMA_BASE_URL = 'http://localhost:11434';

      const config = convictConfig();

      expect(config.get('llm.openai.apiKey')).toBe('sk-test123');
      expect(config.get('llm.provider')).toBe('ollama');
      expect(config.get('llm.ollama.baseUrl')).toBe('http://localhost:11434');
    });
  });

  describe('validation', () => {
    it('should validate port format', () => {
      const config = convictConfig();
      
      expect(() => {
        config.set('server.port', 99999); // Use invalid port number
        config.validate({ allowed: 'strict' });
      }).toThrow();
    });

    it('should validate natural number format', () => {
      const config = convictConfig();
      
      expect(() => {
        config.set('server.sseHeartbeatMs', -1);
        config.validate({ allowed: 'strict' });
      }).toThrow();
    });

    it('should pass validation with valid values', () => {
      const config = convictConfig();
      
      config.set('server.port', 3000);
      config.set('server.httpsEnabled', true);
      config.set('server.sseHeartbeatMs', 10000);
      
      expect(() => {
        config.validate({ allowed: 'strict' });
      }).not.toThrow();
    });

    it('should validate enum values for LLM provider', () => {
      const config = convictConfig();
      
      expect(() => {
        config.set('llm.provider', 'invalid-provider');
        config.validate({ allowed: 'strict' });
      }).toThrow();
    });
  });

  describe('configuration methods', () => {
    it('should get configuration values', () => {
      const config = convictConfig();
      
      expect(typeof config.get('server.port')).toBe('number');
      expect(typeof config.get('server.httpsEnabled')).toBe('boolean');
      expect(typeof config.get('server.corsOrigin')).toBe('string');
    });

    it('should set configuration values', () => {
      const config = convictConfig();
      
      config.set('server.port', 4000);
      expect(config.get('server.port')).toBe(4000);
      
      config.set('server.httpsEnabled', true);
      expect(config.get('server.httpsEnabled')).toBe(true);
    });

    it('should validate configuration', () => {
      const config = convictConfig();
      
      expect(() => {
        config.validate({ allowed: 'strict' });
      }).not.toThrow();
    });

    it('should have schema', () => {
      const config = convictConfig();
      const schema = config.getSchema();
      
      expect(schema).toBeDefined();
      expect(schema._cvtProperties).toBeDefined();
      expect(schema._cvtProperties.server).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle missing environment variables gracefully', () => {
      // Don't set any environment variables
      delete process.env.PORT;
      delete process.env.CORS_ORIGIN;

      const config = convictConfig();

      // Should use defaults when env vars are missing
      expect(config.get('server.port')).toBe(5005);
      expect(config.get('server.corsOrigin')).toBe('https://chat.openai.com,https://chatgpt.com');
    });

    it('should handle boolean environment variables correctly', () => {
      process.env.HTTPS_ENABLED = 'false';
      process.env.DISABLE_HEALTH_LOG = 'false';

      const config = convictConfig();

      expect(config.get('server.httpsEnabled')).toBe(false);
      expect(config.get('server.disableHealthLog')).toBe(false);
    });

    it('should handle numeric environment variables', () => {
      process.env.PORT = '3000';
      process.env.SSE_HEARTBEAT_MS = '1000';

      const config = convictConfig();

      expect(config.get('server.port')).toBe(3000);
      expect(config.get('server.sseHeartbeatMs')).toBe(1000);
    });

    it('should handle server configuration sections', () => {
      const config = convictConfig();
      const serverConfig = config.get('server');
      
      expect(serverConfig).toBeDefined();
      expect(typeof serverConfig.port).toBe('number');
      expect(typeof serverConfig.httpsEnabled).toBe('boolean');
    });

    it('should handle security configuration sections', () => {
      const config = convictConfig();
      const securityConfig = config.get('security');
      
      expect(securityConfig).toBeDefined();
      expect(typeof securityConfig.apiToken).toBe('string');
    });

    it('should handle LLM configuration sections', () => {
      const config = convictConfig();
      const llmConfig = config.get('llm');

      expect(llmConfig).toBeDefined();
      expect(typeof llmConfig.provider).toBe('string');
      expect(llmConfig.openai).toBeDefined();
      expect(llmConfig.ollama).toBeDefined();
    });
  });

  describe('persistence functionality', () => {
    const configPath = path.join(os.tmpdir(), 'convict-config.json');

    afterEach(() => {
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
      }
    });

    describe('persistConfig', () => {
      it('should persist config to file', async () => {
        const config = convictConfig();
        config.set('server.port', 9999);
        config.set('files.enabled', false);

        await persistConfig(config, configPath);

        expect(fs.existsSync(configPath)).toBe(true);

        const persistedData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        expect(persistedData.server.port).toBe(9999);
        expect(persistedData.files.enabled).toBe(false);
      });

      it('should create directory if it does not exist', async () => {
        // Remove the file and ensure directory doesn't exist
        if (fs.existsSync(configPath)) {
          fs.unlinkSync(configPath);
        }
        const dir = path.dirname(configPath);
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
        }

        const config = convictConfig();
        config.set('server.port', 8888);

        await persistConfig(config, configPath);

        expect(fs.existsSync(configPath)).toBe(true);
        const persistedData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        expect(persistedData.server.port).toBe(8888);
      });

      it('should handle atomic writes using temp file', async () => {
        const config = convictConfig();
        config.set('server.port', 7777);

        await persistConfig(config, configPath);

        // Check that temp file doesn't exist after successful write
        const tempFile = configPath + '.tmp';
        expect(fs.existsSync(tempFile)).toBe(false);
        expect(fs.existsSync(configPath)).toBe(true);
      });

      it('should throw error on write failure', async () => {
        const config = convictConfig();
        // Mock fs.writeFileSync to throw
        const originalWriteFileSync = fs.writeFileSync;
        fs.writeFileSync = jest.fn(() => {
          throw new Error('Write failed');
        });

        await expect(persistConfig(config, configPath)).rejects.toThrow('Failed to persist config: Write failed');

        fs.writeFileSync = originalWriteFileSync;
      });
    });

    describe('config loading from file', () => {
      it('should load persisted config on initialization', () => {
        // Create a config file
        const testConfig = {
          server: { port: 5555 },
          files: { enabled: false }
        };
        fs.writeFileSync(configPath, JSON.stringify(testConfig));

        // Create new config instance (should load from file)
        const config = convictConfig();

        expect(config.get('server.port')).toBe(5555);
        expect(config.get('files.enabled')).toBe(false);
      });

      it('should handle invalid JSON in config file gracefully', () => {
        // Write invalid JSON
        fs.writeFileSync(configPath, '{ invalid json }');

        // Should not crash, should use defaults
        const config = convictConfig();

        expect(config.get('server.port')).toBe(5005); // default
        expect(config.get('files.enabled')).toBe(true); // default
      });

      it('should handle missing config file gracefully', () => {
        // Ensure file doesn't exist
        if (fs.existsSync(configPath)) {
          fs.unlinkSync(configPath);
        }

        const config = convictConfig();

        // Should use defaults
        expect(config.get('server.port')).toBe(5005);
        expect(config.get('files.enabled')).toBe(true);
      });

      it('should merge loaded config with defaults', () => {
        const partialConfig = {
          server: { port: 4444 }
          // files.enabled not specified, should use default
        };
        fs.writeFileSync(configPath, JSON.stringify(partialConfig));

        const config = convictConfig();

        expect(config.get('server.port')).toBe(4444);
        expect(config.get('files.enabled')).toBe(true); // default
      });
    });

    describe('file operations toggles persistence', () => {
      it('should persist individual file operation toggles', async () => {
        const config = convictConfig();
        config.set('files.operations.create.enabled', false);
        config.set('files.operations.read.enabled', true);

        await persistConfig(config, configPath);

        const persistedData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        expect(persistedData.files.operations.create.enabled).toBe(false);
        expect(persistedData.files.operations.read.enabled).toBe(true);
      });

      it('should load file operation toggles from persisted config', () => {
        const testConfig = {
          files: {
            operations: {
              create: { enabled: false },
              read: { enabled: true },
              update: { enabled: false }
            }
          }
        };
        fs.writeFileSync(configPath, JSON.stringify(testConfig));

        const config = convictConfig();

        expect(config.get('files.operations.create.enabled')).toBe(false);
        expect(config.get('files.operations.read.enabled')).toBe(true);
        expect(config.get('files.operations.update.enabled')).toBe(false);
      });
    });

    describe('concurrent persistence', () => {
      it('should handle concurrent persist operations', async () => {
        const config1 = convictConfig();
        const config2 = convictConfig();

        config1.set('server.port', 1111);
        config2.set('server.port', 2222);

        // Persist both concurrently
        await Promise.all([
          persistConfig(config1),
          persistConfig(config2)
        ]);

        // One should win (last write)
        const finalConfig = convictConfig();
        const finalPort = finalConfig.get('server.port');
        expect([1111, 2222]).toContain(finalPort);
      });
    });
  });
});

describe('getRedactedSettings', () => {
  it('should return redacted view with readOnly for env overrides', () => {
    process.env.PORT = '8080';
    process.env.API_TOKEN = 'secret';
    process.env.OPENAI_API_KEY = 'sk-secret';
    const { getRedactedSettings } = require('../../src/config/convictConfig');
    const redacted = getRedactedSettings();
    expect(redacted.server.port.value).toBe(8080);
    expect(redacted.server.port.readOnly).toBe(true);
    expect(redacted.security.apiToken.value).toBe('*****');
    expect(redacted.security.apiToken.readOnly).toBe(true);
    expect(redacted.llm['openai.apiKey'].value).toBe('*****');
    expect(redacted.llm['openai.apiKey'].readOnly).toBe(true);
    expect(redacted.server.httpsEnabled.readOnly).toBe(false); // No env
  });

  it('should mask only sensitive keys', () => {
    process.env.API_TOKEN = 'visible-secret';
    const { getRedactedSettings } = require('../../src/config/convictConfig');
    const redacted = getRedactedSettings();
    expect(redacted.security.apiToken.value).toBe('*****'); // Masked
    expect(redacted.server.port.value).toBe(5005); // Not masked
  });

  it('should group settings correctly (server, security, llm, compat)', () => {
    const { getRedactedSettings } = require('../../src/config/convictConfig');
    const redacted = getRedactedSettings();
    expect(redacted.server).toBeDefined();
    expect(redacted.security).toBeDefined();
    expect(redacted.llm).toBeDefined();
    expect(redacted.compat).toBeDefined();
    expect(Object.keys(redacted.server)).toContain('port');
    expect(Object.keys(redacted.llm)).toContain('provider');
    expect(Object.keys(redacted.compat)).toContain('llmProvider');
  });

  it('should set readOnly false for non-env overridden values', () => {
    const { getRedactedSettings } = require('../../src/config/convictConfig');
    const redacted = getRedactedSettings();
    expect(redacted.server.port.readOnly).toBe(false); // Default, no env
  });
});