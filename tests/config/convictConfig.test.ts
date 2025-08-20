import { convictConfig, getRedactedSettings } from '../../src/config/convictConfig';
import convict from 'convict';

describe('Convict Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    // Reset the environment
    process.env = {};
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('convictConfig', () => {
    it('should create configuration with default values', () => {
      const config = convictConfig();
      
      expect(config.get('server.port')).toBe(5005);
      expect(config.get('server.httpsEnabled')).toBe(false);
      expect(config.get('server.corsOrigin')).toBe('https://chat.openai.com,https://chatgpt.com');
      expect(config.get('security.apiToken')).toBe('');
      expect(config.get('llm.provider')).toBe(''); // Default is empty string
    });

    it('should override values with environment variables', () => {
      process.env.PORT = '8080';
      process.env.HTTPS_ENABLED = 'true';
      process.env.CORS_ORIGIN = 'https://example.com';
      process.env.API_TOKEN = 'test-token';
      process.env.AI_PROVIDER = 'ollama'; // Correct env var name

      const config = convictConfig();
      
      expect(config.get('server.port')).toBe(8080);
      expect(config.get('server.httpsEnabled')).toBe(true);
      expect(config.get('server.corsOrigin')).toBe('https://example.com');
      expect(config.get('security.apiToken')).toBe('test-token');
      expect(config.get('llm.provider')).toBe('ollama');
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
      process.env.API_TOKEN = 'secure-token-123';
      process.env.DENY_COMMAND_REGEX = 'rm -rf';
      process.env.CONFIRM_COMMAND_REGEX = 'sudo';

      const config = convictConfig();
      
      expect(config.get('security.apiToken')).toBe('secure-token-123');
      expect(config.get('security.denyCommandRegex')).toBe('rm -rf');
      expect(config.get('security.confirmCommandRegex')).toBe('sudo');
    });

    it('should handle LLM provider configurations', () => {
      process.env.AI_PROVIDER = 'openai'; // Correct env var
      process.env.OPENAI_BASE_URL = 'https://api.openai.com/v1';
      process.env.OPENAI_API_KEY = 'sk-test123';
      process.env.OLLAMA_BASE_URL = 'http://localhost:11434';
      process.env.LMSTUDIO_BASE_URL = 'http://localhost:1234';

      const config = convictConfig();
      
      expect(config.get('llm.provider')).toBe('openai');
      expect(config.get('llm.openai.baseUrl')).toBe('https://api.openai.com/v1');
      expect(config.get('llm.openai.apiKey')).toBe('sk-test123');
      expect(config.get('llm.ollama.baseUrl')).toBe('http://localhost:11434');
      expect(config.get('llm.lmstudio.baseUrl')).toBe('http://localhost:1234');
    });

    it('should handle compatibility settings', () => {
      process.env.LLM_COMPAT_PROVIDER = 'ollama';
      process.env.LLM_COMPAT_MODEL = 'llama2';
      process.env.LLM_COMPAT_OLLAMA_HOST = 'localhost:11434';
      process.env.LLM_COMPAT_INTERPRETER_HOST = 'localhost';
      process.env.LLM_COMPAT_INTERPRETER_PORT = '8000';
      process.env.LLM_COMPAT_INTERPRETER_OFFLINE = 'true';
      process.env.LLM_COMPAT_INTERPRETER_VERBOSE = 'false';

      const config = convictConfig();
      
      expect(config.get('llm.compat.llmProvider')).toBe('ollama');
      expect(config.get('llm.compat.llmModel')).toBe('llama2');
      expect(config.get('llm.compat.ollamaHost')).toBe('localhost:11434');
      expect(config.get('llm.compat.interpreterHost')).toBe('localhost');
      expect(config.get('llm.compat.interpreterPort')).toBe(8000);
      expect(config.get('llm.compat.interpreterOffline')).toBe(true);
      expect(config.get('llm.compat.interpreterVerbose')).toBe(false);
    });

    it('should handle server feature flags', () => {
      process.env.DISABLE_HEALTH_LOG = 'true';
      process.env.SSE_HEARTBEAT_MS = '30000';
      process.env.USE_SERVERLESS = 'true';
      process.env.USE_MCP = 'true';
      process.env.PUBLIC_BASE_URL = 'https://myapp.com';
      process.env.PUBLIC_HOST = 'myapp.com';

      const config = convictConfig();
      
      expect(config.get('server.disableHealthLog')).toBe(true);
      expect(config.get('server.sseHeartbeatMs')).toBe(30000);
      expect(config.get('server.useServerless')).toBe(true);
      expect(config.get('server.useMcp')).toBe(true);
      expect(config.get('server.publicBaseUrl')).toBe('https://myapp.com');
      expect(config.get('server.publicHost')).toBe('myapp.com');
    });

    it('should validate configuration', () => {
      const config = convictConfig();
      
      expect(() => config.validate({ allowed: 'warn' })).not.toThrow();
    });

    it('should handle invalid port values', () => {
      process.env.PORT = 'invalid';
      
      const config = convictConfig();
      
      expect(() => config.validate({ allowed: 'strict' })).toThrow();
    });

    it('should handle boolean environment variables correctly', () => {
      // Test that environment variables are properly parsed
      process.env.HTTPS_ENABLED = 'false';
      process.env.USE_SERVERLESS = 'false';
      process.env.USE_MCP = 'false';

      const config = convictConfig();
      
      expect(config.get('server.httpsEnabled')).toBe(false);
      expect(config.get('server.useServerless')).toBe(false);
      expect(config.get('server.useMcp')).toBe(false);
    });

    it('should handle numeric environment variables', () => {
      process.env.PORT = '3000';
      process.env.SSE_HEARTBEAT_MS = '5000';
      process.env.LLM_COMPAT_INTERPRETER_PORT = '9000';

      const config = convictConfig();
      
      expect(config.get('server.port')).toBe(3000);
      expect(config.get('server.sseHeartbeatMs')).toBe(5000);
      expect(config.get('llm.compat.interpreterPort')).toBe(9000);
    });

    it('should handle empty environment variables', () => {
      process.env.API_TOKEN = '';
      process.env.OPENAI_API_KEY = '';
      process.env.PUBLIC_BASE_URL = '';

      const config = convictConfig();
      
      expect(config.get('security.apiToken')).toBe('');
      expect(config.get('llm.openai.apiKey')).toBe('');
      expect(config.get('server.publicBaseUrl')).toBe('');
    });

    it('should get schema information', () => {
      const config = convictConfig();
      const schema = (config as any).getSchema();
      
      expect(schema).toBeDefined();
      expect(schema.properties).toBeDefined();
      expect(schema.properties.server).toBeDefined();
      expect(schema.properties.security).toBeDefined();
      expect(schema.properties.llm).toBeDefined();
    });

    it('should handle nested configuration paths', () => {
      const config = convictConfig();
      
      expect(config.get('llm.openai.baseUrl')).toBeDefined();
      expect(config.get('llm.ollama.baseUrl')).toBeDefined();
      expect(config.get('llm.lmstudio.baseUrl')).toBeDefined();
      expect(config.get('llm.compat.llmProvider')).toBeDefined();
    });
  });

  describe('getRedactedSettings', () => {
    beforeEach(() => {
      // Clear environment for clean tests
      delete process.env.PORT;
      delete process.env.API_TOKEN;
      delete process.env.OPENAI_API_KEY;
      delete process.env.HTTPS_ENABLED;
      delete process.env.AI_PROVIDER;
    });

    it('should return redacted settings with default values', () => {
      const settings = getRedactedSettings();
      
      expect(settings).toBeDefined();
      expect(settings.server).toBeDefined();
      expect(settings.security).toBeDefined();
      expect(settings.llm).toBeDefined();
      
      expect(settings.server.port.value).toBe(5005);
      expect(settings.server.httpsEnabled.value).toBe(false);
      expect(settings.security.apiToken.value).toBe('');
    });

    it('should mask sensitive values', () => {
      process.env.API_TOKEN = 'secret-token-123';
      process.env.OPENAI_API_KEY = 'sk-secret-key';
      
      const settings = getRedactedSettings();
      
      expect(settings.security.apiToken.value).toBe('*****');
      expect(settings.llm['openai.apiKey'].value).toBe('*****');
    });

    it('should not mask empty sensitive values', () => {
      process.env.API_TOKEN = '';
      process.env.OPENAI_API_KEY = '';
      
      const settings = getRedactedSettings();
      
      expect(settings.security.apiToken.value).toBe('');
      expect(settings.llm['openai.apiKey'].value).toBe('');
    });

    it('should mark environment-provided values as read-only', () => {
      process.env.PORT = '8080';
      process.env.HTTPS_ENABLED = 'true';
      process.env.API_TOKEN = 'env-token';
      
      const settings = getRedactedSettings();
      
      expect(settings.server.port.readOnly).toBe(true);
      expect(settings.server.httpsEnabled.readOnly).toBe(true);
      expect(settings.security.apiToken.readOnly).toBe(true);
    });

    it('should mark non-environment values as writable', () => {
      // Don't set environment variables, use defaults
      const settings = getRedactedSettings();
      
      expect(settings.server.port.readOnly).toBe(false);
      expect(settings.server.httpsEnabled.readOnly).toBe(false);
      expect(settings.security.apiToken.readOnly).toBe(false);
    });

    it('should handle all server settings', () => {
      process.env.PORT = '3000';
      process.env.HTTPS_ENABLED = 'true';
      process.env.CORS_ORIGIN = 'https://example.com';
      process.env.DISABLE_HEALTH_LOG = 'true';
      process.env.SSE_HEARTBEAT_MS = '20000';
      
      const settings = getRedactedSettings();
      
      expect(settings.server.port.value).toBe(3000);
      expect(settings.server.httpsEnabled.value).toBe(true);
      expect(settings.server.corsOrigin.value).toBe('https://example.com');
      expect(settings.server.disableHealthLog.value).toBe(true);
      expect(settings.server.sseHeartbeatMs.value).toBe(20000);
    });

    it('should handle all security settings', () => {
      process.env.API_TOKEN = 'test-token';
      process.env.DENY_COMMAND_REGEX = 'rm -rf';
      process.env.CONFIRM_COMMAND_REGEX = 'sudo';
      
      const settings = getRedactedSettings();
      
      expect(settings.security.apiToken.value).toBe('*****');
      expect(settings.security.denyCommandRegex.value).toBe('rm -rf');
      expect(settings.security.confirmCommandRegex.value).toBe('sudo');
    });

    it('should handle all LLM settings', () => {
      process.env.AI_PROVIDER = 'ollama'; // Correct env var
      process.env.OPENAI_BASE_URL = 'https://api.openai.com/v1';
      process.env.OPENAI_API_KEY = 'sk-test';
      process.env.OLLAMA_BASE_URL = 'http://localhost:11434';
      process.env.LMSTUDIO_BASE_URL = 'http://localhost:1234';
      
      const settings = getRedactedSettings();
      
      expect(settings.llm.provider.value).toBe('ollama');
      expect(settings.llm['openai.baseUrl'].value).toBe('https://api.openai.com/v1');
      expect(settings.llm['openai.apiKey'].value).toBe('*****');
      expect(settings.llm['ollama.baseUrl'].value).toBe('http://localhost:11434');
      expect(settings.llm['lmstudio.baseUrl'].value).toBe('http://localhost:1234');
    });

    it('should handle compatibility settings', () => {
      process.env.LLM_COMPAT_PROVIDER = 'ollama';
      process.env.LLM_COMPAT_MODEL = 'llama2';
      process.env.LLM_COMPAT_OLLAMA_HOST = 'localhost:11434';
      
      const settings = getRedactedSettings();
      
      expect(settings.compat.llmProvider.value).toBe('ollama');
      expect(settings.compat.llmModel.value).toBe('llama2');
      expect(settings.compat.ollamaHost.value).toBe('localhost:11434');
    });

    it('should handle complex data types', () => {
      const settings = getRedactedSettings();
      
      // Test that all values are properly serialized
      Object.values(settings).forEach(group => {
        Object.values(group).forEach(setting => {
          expect(setting.value).toBeDefined();
          expect(typeof setting.readOnly).toBe('boolean');
        });
      });
    });

    it('should handle null and undefined values', () => {
      // Test with minimal environment
      const settings = getRedactedSettings();
      
      // Should not have null values in the result
      Object.values(settings).forEach(group => {
        Object.values(group).forEach(setting => {
          expect(setting.value).not.toBeNull();
          expect(setting.value).not.toBeUndefined();
        });
      });
    });

    it('should validate configuration before generating settings', () => {
      // This should not throw even with validation
      expect(() => getRedactedSettings()).not.toThrow();
    });

    it('should handle mixed environment and default values', () => {
      process.env.PORT = '4000';
      // Leave other values as defaults
      
      const settings = getRedactedSettings();
      
      expect(settings.server.port.value).toBe(4000);
      expect(settings.server.port.readOnly).toBe(true);
      expect(settings.server.httpsEnabled.value).toBe(false);
      expect(settings.server.httpsEnabled.readOnly).toBe(false);
    });

    it('should handle all feature flags', () => {
      process.env.USE_SERVERLESS = 'true';
      process.env.USE_MCP = 'false';
      process.env.PUBLIC_BASE_URL = 'https://myapp.example.com';
      process.env.PUBLIC_HOST = 'myapp.example.com';
      
      const settings = getRedactedSettings();
      
      expect(settings.server.useServerless.value).toBe(true);
      expect(settings.server.useMcp.value).toBe(false);
      expect(settings.server.publicBaseUrl.value).toBe('https://myapp.example.com');
      expect(settings.server.publicHost.value).toBe('myapp.example.com');
    });

    it('should handle interpreter settings', () => {
      process.env.LLM_COMPAT_INTERPRETER_HOST = 'interpreter.example.com';
      process.env.LLM_COMPAT_INTERPRETER_PORT = '8080';
      process.env.LLM_COMPAT_INTERPRETER_OFFLINE = 'true';
      process.env.LLM_COMPAT_INTERPRETER_VERBOSE = 'false';
      
      const settings = getRedactedSettings();
      
      expect(settings.compat.interpreterHost.value).toBe('interpreter.example.com');
      expect(settings.compat.interpreterPort.value).toBe(8080);
      expect(settings.compat.interpreterOffline.value).toBe(true);
      expect(settings.compat.interpreterVerbose.value).toBe(false);
    });
  });
});
