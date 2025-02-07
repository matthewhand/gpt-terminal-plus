import { isConfigLoaded, generateDefaultConfig, persistConfig } from '../../src/config/configHandler';

describe('configHandler', () => {
  it('should export isConfigLoaded', () => {
    expect(isConfigLoaded).toBeDefined();
  });

  it('should export generateDefaultConfig', () => {
    expect(generateDefaultConfig).toBeDefined();
  });

  it('should export persistConfig', () => {
    expect(persistConfig).toBeDefined();
  });
});