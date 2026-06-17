import { describe, it, expect, jest, beforeEach, afterEach, vi } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { SettingsStore, getSettings } from '@src/settings/store';
import { SettingsSchema } from '@src/settings/schema';

const mockSettingsFile = '/mock/settings.json';
const mockDir = '/mock';

jest.mock('node:fs');
jest.mock('node:path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('settings/store.ts - Settings Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GTP_SETTINGS_PATH = mockSettingsFile;
    process.env.NODE_ENV = 'production';
    mockPath.resolve.mockReturnValue(mockSettingsFile);
    mockPath.dirname.mockReturnValue(mockDir);
    mockFs.existsSync.mockReturnValue(false);
    mockFs.readFileSync.mockImplementation(() => { throw new Error('File not found'); });
    mockFs.mkdirSync.mockImplementation();
    mockFs.writeFileSync.mockImplementation();
    vi.useFakeTimers();
  });

  afterEach(() => {
    delete process.env.GTP_SETTINGS_PATH;
    delete process.env.NODE_ENV;
    vi.useRealTimers();
  });

  describe('get', () => {
    it('should return defaults if file missing', () => {
      const settings = SettingsStore.get();
      expect(settings).toEqual(SettingsSchema.parse({}));
      expect(mockFs.readFileSync).toHaveBeenNthCalledWith(1, mockSettingsFile, 'utf8');
    });

    it('should load and parse valid JSON from file', () => {
      const mockJson = { server: { port: 3000 } };
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockJson));
      const settings = SettingsStore.get();
      expect(settings.server.port).toBe(3000);
      expect(mockFs.readFileSync).toHaveBeenCalledWith(mockSettingsFile, 'utf8');
    });

    it('should fallback to defaults on parse error', () => {
      mockFs.readFileSync.mockReturnValue('invalid json');
      const settings = SettingsStore.get();
      expect(settings.server.port).toBe(5004); // Default
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(mockDir, { recursive: true });
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(mockSettingsFile, expect.stringContaining('"port":5004'), 'utf8');
    });

    it('should use defaults in test mode without file ops', () => {
      process.env.NODE_ENV = 'test';
      const settings = SettingsStore.get();
      expect(settings).toEqual(SettingsSchema.parse({}));
      expect(mockFs.readFileSync).not.toHaveBeenCalled();
    });

    it('should create dir and save defaults on first load if missing', () => {
      mockFs.readFileSync.mockImplementation(() => { throw new Error(); });
      const settings = SettingsStore.get();
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(mockDir, { recursive: true });
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(mockSettingsFile, expect.any(String), 'utf8');
    });
  });

  describe('set', () => {
    it('should merge partial settings and validate', () => {
      const partial = { server: { port: 3000 }, files: { enabled: false } };
      const settings = SettingsStore.set(partial);
      expect(settings.server.port).toBe(3000);
      expect(settings.files.enabled).toBe(false);
      expect(settings.auth.apiToken).toMatch(/^gtp-token-/); // Unchanged
    });

    it('should merge nested features/execution', () => {
      const partial = {
        features: { executeShell: { enabled: false } },
        execution: { shell: { local: { timeoutMs: 30000 } } }
      };
      const settings = SettingsStore.set(partial);
      expect(settings.features.executeShell.enabled).toBe(false);
      expect(settings.execution.shell.local.timeoutMs).toBe(30000);
    });

    it('should validate and reject invalid partial', () => {
      const invalid = { server: { port: 'invalid' } };
      expect(() => SettingsStore.set(invalid)).toThrow(); // Schema error
    });

    it('should debounce save on multiple sets', () => {
      const set1 = SettingsStore.set({ server: { port: 3000 } });
      const set2 = SettingsStore.set({ files: { enabled: false } });
      expect(vi.getTimerCount()).toBe(1); // Debounced
      vi.runAllTimers();
      expect(mockFs.writeFileSync).toHaveBeenCalledTimes(1); // One save
      expect(set2.files.enabled).toBe(false);
    });

    it('should not save in test mode', () => {
      process.env.NODE_ENV = 'test';
      SettingsStore.set({ server: { port: 3000 } });
      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('replace', () => {
    it('should replace full settings and validate', () => {
      const full = SettingsSchema.parse({ server: { port: 4000 }, llm: { enabled: true } });
      const settings = SettingsStore.replace(full);
      expect(settings.server.port).toBe(4000);
      expect(settings.llm.enabled).toBe(true);
      expect(mockFs.writeFileSync).toHaveBeenCalled();
    });

    it('should reject invalid full settings', () => {
      const invalid = { server: { port: -1 } };
      expect(() => SettingsStore.replace(invalid)).toThrow();
      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should debounce save after replace', () => {
      const full = { server: { port: 5000 } };
      SettingsStore.replace(full);
      vi.runAllTimers();
      expect(mockFs.writeFileSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('isEnabled/setEnabled', () => {
    it('should check feature enabled', () => {
      const settings = SettingsStore.get();
      expect(SettingsStore.isEnabled('executeShell')).toBe(true); // Default
    });

    it('should set enabled and save', () => {
      const settings = SettingsStore.setEnabled('executeLlm', false);
      expect(settings.features.executeLlm.enabled).toBe(false);
      expect(mockFs.writeFileSync).toHaveBeenCalled();
      vi.runAllTimers(); // Debounce
    });

    it('should toggle back to true', () => {
      SettingsStore.setEnabled('executeCode', false);
      const settings = SettingsStore.setEnabled('executeCode', true);
      expect(settings.features.executeCode.enabled).toBe(true);
    });
  });

  describe('getSettings alias', () => {
    it('should return same as store.get', () => {
      const storeSettings = SettingsStore.get();
      const aliasSettings = getSettings();
      expect(aliasSettings).toEqual(storeSettings);
    });
  });

  describe('error handling', () => {
    it('should handle write fail during save', () => {
      mockFs.writeFileSync.mockImplementation(() => { throw new Error('Write fail'); });
      const settings = SettingsStore.set({ server: { port: 6000 } });
      expect(settings.server.port).toBe(6000); // Still sets in memory
      // No throw, ignore as per code
    });

    it('should handle mkdir fail', () => {
      mockFs.mkdirSync.mockImplementation(() => { throw new Error('Dir fail'); });
      SettingsStore.set({ server: { port: 7000 } });
      // Ignore, no throw
    });
  });
});