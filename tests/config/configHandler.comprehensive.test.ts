import { isConfigLoaded, generateDefaultConfig, persistConfig } from '../../src/config/configHandler';
import fs from 'fs';
import path from 'path';

// Mock fs module
jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('Configuration Handler - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isConfigLoaded', () => {
    it('should return true when config file exists', () => {
      mockFs.existsSync.mockReturnValue(true);
      
      const result = isConfigLoaded('/path/to/config.json');
      
      expect(result).toBe(true);
      expect(mockFs.existsSync).toHaveBeenCalledWith('/path/to/config.json');
    });

    it('should return false when config file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = isConfigLoaded('/path/to/nonexistent.json');
      
      expect(result).toBe(false);
      expect(mockFs.existsSync).toHaveBeenCalledWith('/path/to/nonexistent.json');
    });

    it('should handle different file paths correctly', () => {
      const testPaths = [
        '/etc/app/config.json',
        './config/development.json',
        '../configs/test.json',
        'C:\\Windows\\config.json'
      ];

      testPaths.forEach((testPath, index) => {
        mockFs.existsSync.mockReturnValue(index % 2 === 0); // Alternate true/false
        
        const result = isConfigLoaded(testPath);
        
        expect(mockFs.existsSync).toHaveBeenCalledWith(testPath);
        expect(result).toBe(index % 2 === 0);
      });
    });

    it('should handle empty path', () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = isConfigLoaded('');
      
      expect(result).toBe(false);
      expect(mockFs.existsSync).toHaveBeenCalledWith('');
    });

    it('should handle special characters in path', () => {
      const specialPath = '/path/with spaces/config-file_v1.2.json';
      mockFs.existsSync.mockReturnValue(true);
      
      const result = isConfigLoaded(specialPath);
      
      expect(result).toBe(true);
      expect(mockFs.existsSync).toHaveBeenCalledWith(specialPath);
    });
  });

  describe('generateDefaultConfig', () => {
    it('should return a valid default configuration object', () => {
      const config = generateDefaultConfig();
      
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
      expect(config).not.toBeNull();
    });

    it('should include required top-level properties', () => {
      const config = generateDefaultConfig() as any;
      
      expect(config).toHaveProperty('default', true);
      expect(config).toHaveProperty('port', 5005);
      expect(config).toHaveProperty('local');
      expect(config).toHaveProperty('ssh');
      expect(config).toHaveProperty('ssm');
    });

    it('should have correct local configuration', () => {
      const config = generateDefaultConfig() as any;
      
      expect(config.local).toBeDefined();
      expect(config.local).toHaveProperty('code', true);
    });

    it('should have correct SSH configuration structure', () => {
      const config = generateDefaultConfig() as any;
      
      expect(config.ssh).toBeDefined();
      expect(config.ssh).toHaveProperty('hosts');
      expect(Array.isArray(config.ssh.hosts)).toBe(true);
      expect(config.ssh.hosts).toHaveLength(1);
      
      const sshHost = config.ssh.hosts[0];
      expect(sshHost).toHaveProperty('name', 'example-ssh-server');
      expect(sshHost).toHaveProperty('host', 'ssh.example.com');
      expect(sshHost).toHaveProperty('port', 23);
      expect(sshHost).toHaveProperty('username', 'user');
      expect(sshHost).toHaveProperty('privateKey', '/path/to/private/key');
    });

    it('should have correct SSM configuration structure', () => {
      const config = generateDefaultConfig() as any;
      
      expect(config.ssm).toBeDefined();
      expect(config.ssm).toHaveProperty('region', 'us-east0');
      expect(config.ssm).toHaveProperty('targets');
      expect(Array.isArray(config.ssm.targets)).toBe(true);
      expect(config.ssm.targets).toHaveLength(1);
      
      const ssmTarget = config.ssm.targets[0];
      expect(ssmTarget).toHaveProperty('name', 'example-ssm-instance');
      expect(ssmTarget).toHaveProperty('instanceId', 'i-123456788abcdef0');
    });

    it('should return the same structure on multiple calls', () => {
      const config1 = generateDefaultConfig();
      const config2 = generateDefaultConfig();
      
      expect(config1).toEqual(config2);
    });

    it('should return a new object instance each time', () => {
      const config1 = generateDefaultConfig();
      const config2 = generateDefaultConfig();
      
      expect(config1).not.toBe(config2); // Different object references
      
      // Modifying one should not affect the other
      (config1 as any).port = 9999;
      expect((config2 as any).port).toBe(5005);
    });

    it('should have valid data types for all properties', () => {
      const config = generateDefaultConfig() as any;
      
      expect(typeof config.default).toBe('boolean');
      expect(typeof config.port).toBe('number');
      expect(typeof config.local).toBe('object');
      expect(typeof config.ssh).toBe('object');
      expect(typeof config.ssm).toBe('object');
      
      expect(typeof config.local.code).toBe('boolean');
      expect(typeof config.ssh.region).toBe('undefined'); // SSH doesn't have region
      expect(typeof config.ssm.region).toBe('string');
    });
  });

  describe('persistConfig', () => {
    it('should write config to specified file path', () => {
      const configData = { test: 'data', number: 42 };
      const filePath = '/path/to/config.json';
      
      persistConfig(configData, filePath);
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(configData, null, 3)
      );
    });

    it('should format JSON with 3-space indentation', () => {
      const configData = {
        nested: {
          object: {
            value: 'test'
          }
        },
        array: [1, 2, 3]
      };
      const filePath = '/test/config.json';
      
      persistConfig(configData, filePath);
      
      const expectedJson = JSON.stringify(configData, null, 3);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(filePath, expectedJson);
    });

    it('should handle empty configuration object', () => {
      const configData = {};
      const filePath = '/empty/config.json';
      
      persistConfig(configData, filePath);
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify({}, null, 3)
      );
    });

    it('should handle null values in configuration', () => {
      const configData = {
        nullValue: null,
        undefinedValue: undefined,
        emptyString: '',
        zero: 0,
        false: false
      };
      const filePath = '/test/config.json';
      
      persistConfig(configData, filePath);
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(configData, null, 3)
      );
    });

    it('should handle complex nested configuration', () => {
      const configData = {
        server: {
          port: 3000,
          host: 'localhost',
          ssl: {
            enabled: true,
            cert: '/path/to/cert',
            key: '/path/to/key'
          }
        },
        database: {
          connections: [
            { name: 'primary', url: 'mongodb://localhost:27017' },
            { name: 'secondary', url: 'mongodb://backup:27017' }
          ]
        },
        features: {
          auth: true,
          logging: {
            level: 'info',
            file: '/var/log/app.log'
          }
        }
      };
      const filePath = '/complex/config.json';
      
      persistConfig(configData, filePath);
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(configData, null, 3)
      );
    });

    it('should handle different file paths and extensions', () => {
      const configData = { test: 'data' };
      const testPaths = [
        '/etc/app/config.json',
        './local-config.json',
        '../configs/development.json',
        'C:\\Windows\\app-config.json',
        '/tmp/config-backup.json'
      ];

      testPaths.forEach(filePath => {
        persistConfig(configData, filePath);
        expect(mockFs.writeFileSync).toHaveBeenCalledWith(
          filePath,
          JSON.stringify(configData, null, 3)
        );
      });

      expect(mockFs.writeFileSync).toHaveBeenCalledTimes(testPaths.length);
    });

    it('should handle arrays in configuration', () => {
      const configData = {
        servers: ['server1', 'server2', 'server3'],
        ports: [3000, 3001, 3002],
        features: [
          { name: 'auth', enabled: true },
          { name: 'logging', enabled: false }
        ]
      };
      const filePath = '/array/config.json';
      
      persistConfig(configData, filePath);
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(configData, null, 3)
      );
    });

    it('should preserve data types in JSON serialization', () => {
      const configData = {
        string: 'text',
        number: 42,
        boolean: true,
        nullValue: null,
        array: [1, 'two', true],
        object: { nested: 'value' }
      };
      const filePath = '/types/config.json';
      
      persistConfig(configData, filePath);
      
      const serializedData = JSON.stringify(configData, null, 3);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(filePath, serializedData);
      
      // Verify that the serialized data can be parsed back correctly
      const parsedData = JSON.parse(serializedData);
      expect(parsedData).toEqual(configData);
    });
  });

  describe('integration scenarios', () => {
    it('should work with generated default config', () => {
      const defaultConfig = generateDefaultConfig();
      const filePath = '/integration/default-config.json';
      
      persistConfig(defaultConfig, filePath);
      
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(defaultConfig, null, 3)
      );
    });

    it('should handle config loading workflow', () => {
      const configPath = '/app/config.json';
      
      // First check if config exists
      mockFs.existsSync.mockReturnValue(false);
      const exists = isConfigLoaded(configPath);
      expect(exists).toBe(false);
      
      // Generate and persist default config
      const defaultConfig = generateDefaultConfig();
      persistConfig(defaultConfig, configPath);
      
      // Verify persistence was called
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        configPath,
        JSON.stringify(defaultConfig, null, 3)
      );
      
      // Now config should exist
      mockFs.existsSync.mockReturnValue(true);
      const existsAfter = isConfigLoaded(configPath);
      expect(existsAfter).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle fs.existsSync throwing an error', () => {
      mockFs.existsSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });
      
      expect(() => {
        isConfigLoaded('/restricted/config.json');
      }).toThrow('Permission denied');
    });

    it('should handle fs.writeFileSync throwing an error', () => {
      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error('Disk full');
      });
      
      const configData = { test: 'data' };
      const filePath = '/full-disk/config.json';
      
      expect(() => {
        persistConfig(configData, filePath);
      }).toThrow('Disk full');
    });
  });
});
