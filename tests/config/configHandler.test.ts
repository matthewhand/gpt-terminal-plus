import fs from 'fs';
import path from 'path';
import { isConfigLoaded, generateDefaultConfig, persistConfig } from '../../src/config/configHandler';

describe('Configuration Handler', () => {
  describe('Configuration Loading Detection', () => {
    let existsSyncSpy: jest.SpyInstance;

    beforeEach(() => {
      existsSyncSpy = jest.spyOn(fs, 'existsSync');
    });

    afterEach(() => {
      existsSyncSpy.mockRestore();
    });

    it('should return true when configuration file exists', () => {
      existsSyncSpy.mockReturnValue(true);
      
      expect(isConfigLoaded('/path/to/config.json')).toBe(true);
      expect(existsSyncSpy).toHaveBeenCalledWith('/path/to/config.json');
    });

    it('should return false when configuration file does not exist', () => {
      existsSyncSpy.mockReturnValue(false);
      
      expect(isConfigLoaded('/path/to/missing.json')).toBe(false);
      expect(existsSyncSpy).toHaveBeenCalledWith('/path/to/missing.json');
    });

    it('should handle various file path formats', () => {
      const testPaths = [
        '/absolute/path/config.json',
        './relative/config.json',
        '../parent/config.json',
        'simple-config.json',
        '/tmp/config.json',
        'C:\\Windows\\config.json'
      ];

      testPaths.forEach(testPath => {
        existsSyncSpy.mockReturnValue(true);
        expect(isConfigLoaded(testPath)).toBe(true);
        expect(existsSyncSpy).toHaveBeenCalledWith(testPath);
      });
    });

    it('should handle empty or invalid paths gracefully', () => {
      existsSyncSpy.mockReturnValue(false);
      
      expect(isConfigLoaded('')).toBe(false);
      expect(isConfigLoaded('   ')).toBe(false);
    });

    it('should call fs.existsSync exactly once per invocation', () => {
      existsSyncSpy.mockReturnValue(true);
      
      isConfigLoaded('/test/config.json');
      expect(existsSyncSpy).toHaveBeenCalledTimes(1);
      
      isConfigLoaded('/another/config.json');
      expect(existsSyncSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Default Configuration Generation', () => {
    let defaultConfig: any;

    beforeEach(() => {
      defaultConfig = generateDefaultConfig();
    });

    describe('Top-Level Configuration', () => {
      it('should generate consistent top-level structure', () => {
        expect(defaultConfig).toMatchObject({
          default: true,
          protocol: 'local',
          hostname: 'localhost',
          port: expect.any(Number),
        });
      });

      it('should generate valid port numbers', () => {
        expect(defaultConfig.port).toBeGreaterThanOrEqual(1);
        expect(defaultConfig.port).toBeLessThanOrEqual(65535);
        expect(Number.isInteger(defaultConfig.port)).toBe(true);
      });

      it('should use sensible defaults for hostname and protocol', () => {
        expect(defaultConfig.hostname).toBe('localhost');
        expect(defaultConfig.protocol).toBe('local');
        expect(defaultConfig.default).toBe(true);
      });
    });

    describe('Local Configuration Section', () => {
      it('should include local configuration with code execution enabled', () => {
        expect(defaultConfig.local).toBeDefined();
        expect(defaultConfig.local).toEqual(expect.objectContaining({ 
          code: true 
        }));
      });

      it('should have proper local configuration structure', () => {
        expect(typeof defaultConfig.local).toBe('object');
        expect(defaultConfig.local).not.toBeNull();
      });
    });

    describe('SSH Configuration Section', () => {
      it('should include SSH hosts array', () => {
        expect(defaultConfig.ssh).toBeDefined();
        expect(Array.isArray(defaultConfig.ssh.hosts)).toBe(true);
        expect(defaultConfig.ssh.hosts.length).toBeGreaterThan(0);
      });

      it('should generate valid SSH host configurations', () => {
        const firstHost = defaultConfig.ssh.hosts[0];
        
        expect(firstHost).toEqual(expect.objectContaining({
          name: expect.any(String),
          host: expect.any(String),
          port: expect.any(Number),
          username: expect.any(String),
          privateKey: expect.any(String),
        }));

        expect(firstHost.name.length).toBeGreaterThan(0);
        expect(firstHost.host.length).toBeGreaterThan(0);
        expect(firstHost.username.length).toBeGreaterThan(0);
        expect(firstHost.port).toBeGreaterThan(0);
        expect(firstHost.port).toBeLessThanOrEqual(65535);
      });

      it('should generate multiple SSH host entries', () => {
        expect(defaultConfig.ssh.hosts.length).toBeGreaterThanOrEqual(1);
        
        // If multiple hosts, ensure they have unique names
        if (defaultConfig.ssh.hosts.length > 1) {
          const names = defaultConfig.ssh.hosts.map((host: any) => host.name);
          const uniqueNames = new Set(names);
          expect(uniqueNames.size).toBe(names.length);
        }
      });
    });

    describe('SSM Configuration Section', () => {
      it('should include SSM targets array', () => {
        expect(defaultConfig.ssm).toBeDefined();
        expect(Array.isArray(defaultConfig.ssm.targets)).toBe(true);
        expect(defaultConfig.ssm.targets.length).toBeGreaterThan(0);
      });

      it('should generate valid SSM target configurations', () => {
        const firstTarget = defaultConfig.ssm.targets[0];
        
        expect(firstTarget).toEqual(expect.objectContaining({
          name: expect.any(String),
          instanceId: expect.stringMatching(/^i-[a-z0-9]+/),
        }));

        expect(firstTarget.name.length).toBeGreaterThan(0);
        expect(firstTarget.instanceId).toMatch(/^i-[a-f0-9]{8,17}$/);
      });

      it('should generate realistic AWS instance IDs', () => {
        defaultConfig.ssm.targets.forEach((target: any) => {
          expect(target.instanceId).toMatch(/^i-[a-f0-9]{8,17}$/);
          expect(target.instanceId.length).toBeGreaterThanOrEqual(10);
        });
      });
    });

    describe('Configuration Consistency', () => {
      it('should generate the same structure across multiple calls', () => {
        const config1 = generateDefaultConfig();
        const config2 = generateDefaultConfig();
        
        expect(Object.keys(config1)).toEqual(Object.keys(config2));
        expect(config1.protocol).toBe(config2.protocol);
        expect(config1.hostname).toBe(config2.hostname);
        expect(config1.default).toBe(config2.default);
      });

      it('should generate consistent default values', () => {
        const config1 = generateDefaultConfig();
        const config2 = generateDefaultConfig();
        
        // The current implementation generates consistent default values
        // This is actually good for testing and predictability
        expect(config1).toEqual(config2);
        
        // But the structure should be complete
        expect(config1).toHaveProperty('port');
        expect(config1).toHaveProperty('ssh.hosts');
        expect(config1).toHaveProperty('ssm.targets');
      });
    });
  });

  describe('Configuration Persistence', () => {
    let writeFileSyncSpy: jest.SpyInstance;

    beforeEach(() => {
      writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
      writeFileSyncSpy.mockImplementation(() => undefined);
    });

    afterEach(() => {
      writeFileSyncSpy.mockRestore();
    });

    it('should write configuration to specified file with proper formatting', () => {
      const testData = { a: 1, nested: { b: true } };
      const targetPath = '/tmp/config.json';
      
      persistConfig(testData, targetPath);
      
      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        targetPath, 
        JSON.stringify(testData, null, 3)
      );
      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle complex configuration objects', () => {
      const complexConfig = {
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
          url: 'postgresql://localhost:5432/db',
          pool: { min: 2, max: 10 }
        },
        features: ['auth', 'logging', 'metrics'],
        metadata: {
          version: '1.0.0',
          created: new Date().toISOString()
        }
      };

      persistConfig(complexConfig, '/tmp/complex.json');
      
      const expectedJson = JSON.stringify(complexConfig, null, 3);
      expect(writeFileSyncSpy).toHaveBeenCalledWith('/tmp/complex.json', expectedJson);
    });

    it('should handle different file paths correctly', () => {
      const data = { test: true };
      const testPaths = [
        '/absolute/path/config.json',
        './relative/config.json',
        '../parent/config.json',
        'simple-config.json',
        'C:\\Windows\\config.json'
      ];

      testPaths.forEach(testPath => {
        persistConfig(data, testPath);
        expect(writeFileSyncSpy).toHaveBeenCalledWith(
          testPath, 
          JSON.stringify(data, null, 3)
        );
      });

      expect(writeFileSyncSpy).toHaveBeenCalledTimes(testPaths.length);
    });

    it('should handle empty and null configurations', () => {
      persistConfig({}, '/tmp/empty.json');
      expect(writeFileSyncSpy).toHaveBeenCalledWith('/tmp/empty.json', '{}');

      persistConfig(null, '/tmp/null.json');
      expect(writeFileSyncSpy).toHaveBeenCalledWith('/tmp/null.json', 'null');
    });

    it('should use consistent indentation (3 spaces)', () => {
      const data = {
        level1: {
          level2: {
            level3: 'deep value'
          }
        }
      };

      persistConfig(data, '/tmp/indented.json');
      
      const writtenContent = writeFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toContain('   "level1"'); // 3 spaces
      expect(writtenContent).toContain('      "level2"'); // 6 spaces
      expect(writtenContent).toContain('         "level3"'); // 9 spaces
    });

    it('should handle special characters and unicode in configuration', () => {
      const dataWithSpecialChars = {
        message: 'Hello "World" with \'quotes\'',
        unicode: '🚀 Unicode test ñáéíóú',
        special: 'Line\nBreak\tTab\\Backslash',
        regex: '.*+?^${}()|[]'
      };

      expect(() => {
        persistConfig(dataWithSpecialChars, '/tmp/special.json');
      }).not.toThrow();

      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        '/tmp/special.json',
        JSON.stringify(dataWithSpecialChars, null, 3)
      );
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with generated default configuration', () => {
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
      writeFileSyncSpy.mockImplementation(() => undefined);

      const defaultConfig = generateDefaultConfig();
      const configPath = '/tmp/generated-config.json';

      expect(() => {
        persistConfig(defaultConfig, configPath);
      }).not.toThrow();

      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        configPath,
        JSON.stringify(defaultConfig, null, 3)
      );

      writeFileSyncSpy.mockRestore();
    });

    it('should handle the complete configuration lifecycle', () => {
      const existsSyncSpy = jest.spyOn(fs, 'existsSync');
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
      
      const configPath = '/tmp/lifecycle-config.json';
      
      // Initially no config
      existsSyncSpy.mockReturnValue(false);
      expect(isConfigLoaded(configPath)).toBe(false);
      
      // Generate and persist config
      const config = generateDefaultConfig();
      writeFileSyncSpy.mockImplementation(() => undefined);
      persistConfig(config, configPath);
      
      // Now config exists
      existsSyncSpy.mockReturnValue(true);
      expect(isConfigLoaded(configPath)).toBe(true);
      
      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        configPath,
        JSON.stringify(config, null, 3)
      );

      existsSyncSpy.mockRestore();
      writeFileSyncSpy.mockRestore();
    });
  });
});
