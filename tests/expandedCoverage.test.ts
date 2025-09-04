import 'jest';
import fs from 'fs';
import path from 'path';

describe('Module Loading and Integration', () => {
  afterAll(() => {
    console.log('API_TOKEN after expandedCoverage.test.ts:', process.env.API_TOKEN);
  });

  describe('Core Module Loading', () => {
    test('should load configHandler module', () => {
      expect(() => require('../src/config/configHandler')).not.toThrow();
    });

    test('should load PaginationHandler module', () => {
      expect(() => require('../src/handlers/PaginationHandler')).not.toThrow();
    });

    test('should load ServerManager module', () => {
      expect(() => require('../src/managers/ServerManager')).not.toThrow();
    });

    test('should load SSHConnectionManager module', () => {
      expect(() => require('../src/managers/SSHConnectionManager')).not.toThrow();
    });

    test('should load initializeServerHandler middleware and export a function', () => {
      const mod = require('../src/middlewares/initializeServerHandler');
      expect(mod).toBeDefined();
      expect(typeof mod.initializeServerHandler).toBe('function');
    });

    test('should load apiToken utility module', () => {
      expect(() => require('../src/common/apiToken')).not.toThrow();
    });

    test('should load escapeSpecialChars utility module', () => {
      expect(() => require('../src/common/escapeSpecialChars')).not.toThrow();
    });
  });

  describe('Module Exports Validation', () => {
    test('configHandler should export required functions', () => {
      const configHandler = require('../src/config/configHandler');
      expect(typeof configHandler.generateDefaultConfig).toBe('function');
      expect(typeof configHandler.isConfigLoaded).toBe('function');
      expect(typeof configHandler.persistConfig).toBe('function');
    });

    test('PaginationHandler should export class', () => {
      const { PaginationHandler } = require('../src/handlers/PaginationHandler');
      expect(typeof PaginationHandler).toBe('function');
    });

    test('ServerManager should export required methods', () => {
      const { ServerManager } = require('../src/managers/ServerManager');
      expect(typeof ServerManager.getInstance).toBe('function');
    });
  });
});

describe('Utility Functions', () => {
  describe('escapeSpecialChars functionality', () => {
    const { escapeSpecialChars } = require('../src/common/escapeSpecialChars');
    
    test('should escape special regex characters', () => {
      const input = 'a+b*c?';
      const expected = 'a\\+b\\*c\\?';
      expect(escapeSpecialChars(input)).toBe(expected);
    });

    test('should handle empty string', () => {
      expect(escapeSpecialChars('')).toBe('');
    });

    test('should handle string without special characters', () => {
      const input = 'abcdef';
      expect(escapeSpecialChars(input)).toBe(input);
    });

    test('should escape all regex special characters', () => {
      const input = '.^$*+?{}[]|()\\-';
      const result = escapeSpecialChars(input);
      expect(result).toContain('\\.');
      expect(result).toContain('\\^');
      expect(result).toContain('\\$');
    });
  });

  describe('apiToken functionality', () => {
    const { getOrGenerateApiToken } = require('../src/common/apiToken');
    
    test('should return a non-empty string token', () => {
      const token = getOrGenerateApiToken();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('should return consistent token on multiple calls', () => {
      const token1 = getOrGenerateApiToken();
      const token2 = getOrGenerateApiToken();
      expect(token1).toBe(token2);
    });

    test('should generate secure token format (32-char lowercase hex)', () => {
      // getOrGenerateApiToken uses crypto.randomBytes(16).toString('hex')
      const token = getOrGenerateApiToken();
      expect(token).toMatch(/^[a-f0-9]{32}$/);
    });
  });
});

describe('Configuration Management', () => {
  describe('configHandler functionality', () => {
    const configHandler = require('../src/config/configHandler');
    
    test('should generate default configuration', () => {
      const defaultConfig = configHandler.generateDefaultConfig();
      expect(defaultConfig).toHaveProperty('default', true);
      expect(defaultConfig).toHaveProperty('hostname');
      expect(defaultConfig).toHaveProperty('protocol');
    });

    test('should validate configuration structure', () => {
      const defaultConfig = configHandler.generateDefaultConfig();
      expect(defaultConfig.protocol).toMatch(/^(local|ssh|ssm)$/);
      expect(typeof defaultConfig.hostname).toBe('string');
    });
  });
});

describe('Handler Classes', () => {
  describe('PaginationHandler', () => {
    const { PaginationHandler } = require('../src/handlers/PaginationHandler');
    
    test('should create instance with default options', () => {
      const handler = new PaginationHandler();
      expect(handler).toBeInstanceOf(PaginationHandler);
    });

    test('should handle pagination parameters', () => {
      const handler = new PaginationHandler({ limit: 10, offset: 0 });
      expect(handler.limit).toBe(10);
      expect(handler.offset).toBe(0);
    });
  });
});

describe('Manager Classes', () => {
  describe('ServerManager', () => {
    const { ServerManager } = require('../src/managers/ServerManager');
    
    test('should implement singleton pattern', () => {
      const instance1 = ServerManager.getInstance();
      const instance2 = ServerManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    test('should manage server configurations', () => {
      const manager = ServerManager.getInstance();
      expect(typeof manager.addServer).toBe('function');
      expect(typeof manager.removeServer).toBe('function');
      expect(typeof manager.listServers).toBe('function');
    });
  });

  describe('SSHConnectionManager', () => {
    const { SSHConnectionManager } = require('../src/managers/SSHConnectionManager');
    
    test('should create instance', () => {
      const manager = new SSHConnectionManager();
      expect(manager).toBeInstanceOf(SSHConnectionManager);
    });

    test('should have connection management methods', () => {
      const manager = new SSHConnectionManager();
      expect(typeof manager.createConnection).toBe('function');
      expect(typeof manager.closeConnection).toBe('function');
      expect(typeof manager.getConnection).toBe('function');
    });
  });
});

describe('File System Integration', () => {
  test('should validate package.json structure', () => {
    const packagePath = path.join(__dirname, '../package.json');
    expect(fs.existsSync(packagePath)).toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    expect(packageJson).toHaveProperty('name');
    expect(packageJson).toHaveProperty('version');
    expect(packageJson).toHaveProperty('scripts');
  });
});

describe('Middleware Integration', () => {
  describe('initializeServerHandler', () => {
    const middleware = require('../src/middlewares/initializeServerHandler');
    
    test('should export middleware function', () => {
      expect(typeof middleware.initializeServerHandler).toBe('function');
    });

    test('should handle request/response cycle', () => {
      const mockReq = { headers: {}, body: {} };
      const mockRes = { locals: {} };
      const mockNext = jest.fn();
      
      expect(() => {
        middleware.initializeServerHandler(mockReq, mockRes, mockNext);
      }).not.toThrow();
    });

    test('attaches a server handler in test env when none selected', () => {
      const { _resetGlobalStateForTests } = require('../src/utils/GlobalStateHelper');
      const { LocalServerHandler } = require('../src/handlers/local/LocalServerHandler');
      const originalEnv = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = 'test';
        _resetGlobalStateForTests({ selectedServer: '' });
        const mockReq: any = { headers: {}, body: {} };
        const mockRes: any = { locals: {} };
        const mockNext = jest.fn();
        middleware.initializeServerHandler(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.server).toBeDefined();
        expect(typeof mockReq.server.executeCommand).toBe('function');
        // Instance check to ensure correct handler type in test env
        expect(mockReq.server).toBeInstanceOf(LocalServerHandler);
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });
});
