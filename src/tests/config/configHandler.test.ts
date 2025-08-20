import fs from 'fs';
import { isConfigLoaded, generateDefaultConfig, persistConfig } from '@src/config/configHandler';

describe('Config Handler', () => {
  describe('isConfigLoaded', () => {
    it('should return true if configuration file exists', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const result = isConfigLoaded('/fake/path/config.json');
      expect(result).toBe(true);
    });

    it('should return false if configuration file does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const result = isConfigLoaded('/fake/path/config.json');
      expect(result).toBe(false);
    });
  });

  describe('generateDefaultConfig', () => {
    it('should generate a configuration object with default properties', () => {
      const config = generateDefaultConfig();
      expect(config).toHaveProperty('port', 5005);
      expect(config).toHaveProperty('local');
      expect(config).toHaveProperty('ssh');
      expect(config).toHaveProperty('ssm');
    });
  });

  describe('persistConfig', () => {
    it('should write configuration data to disk as JSON', () => {
      const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      const configData = { test: 'data' };
      const configFilePath = '/tmp/config.json';
      persistConfig(configData, configFilePath);
      expect(writeSpy).toHaveBeenCalledWith(
        configFilePath,
        JSON.stringify(configData, null, 3)
      );
      writeSpy.mockRestore();
    });
  });
});