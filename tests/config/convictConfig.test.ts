import { convictConfig } from '../../src/config/convictConfig';

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
});
