import config from 'config';
import { areFileOperationsEnabled, validateFileOperations } from '../../src/utils/fileOperations';

// Mock the config module
jest.mock('config');
const mockConfig = config as jest.Mocked<typeof config>;

describe('fileOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('areFileOperationsEnabled', () => {
    it('should return true when files.enabled is true', () => {
      mockConfig.get.mockReturnValue(true);
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(true);
      expect(mockConfig.get).toHaveBeenCalledWith('files.enabled');
    });

    it('should return false when files.enabled is false', () => {
      mockConfig.get.mockReturnValue(false);
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(false);
      expect(mockConfig.get).toHaveBeenCalledWith('files.enabled');
    });

    it('should return false when files.enabled is explicitly false', () => {
      mockConfig.get.mockReturnValue(false);
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(false);
    });

    it('should return true when files.enabled is undefined', () => {
      mockConfig.get.mockReturnValue(undefined);
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(true);
    });

    it('should return true when files.enabled is null', () => {
      mockConfig.get.mockReturnValue(null);
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(true);
    });

    it('should return true when files.enabled is truthy string', () => {
      mockConfig.get.mockReturnValue('true');
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(true);
    });

    it('should return true when files.enabled is non-zero number', () => {
      mockConfig.get.mockReturnValue(1);
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(true);
    });

    it('should return false when files.enabled is zero', () => {
      mockConfig.get.mockReturnValue(0);
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(false);
    });

    it('should return false when files.enabled is empty string', () => {
      mockConfig.get.mockReturnValue('');
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(false);
    });

    it('should return true when config.get throws an error', () => {
      mockConfig.get.mockImplementation(() => {
        throw new Error('Config not found');
      });
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(true);
      expect(mockConfig.get).toHaveBeenCalledWith('files.enabled');
    });

    it('should return true when config.get throws any type of error', () => {
      mockConfig.get.mockImplementation(() => {
        throw 'String error';
      });
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(true);
    });

    it('should return true when config module is completely unavailable', () => {
      mockConfig.get.mockImplementation(() => {
        throw new TypeError('Cannot read property of undefined');
      });
      
      const result = areFileOperationsEnabled();
      
      expect(result).toBe(true);
    });
  });

  describe('validateFileOperations', () => {
    it('should return allowed: true when file operations are enabled', () => {
      mockConfig.get.mockReturnValue(true);
      
      const result = validateFileOperations();
      
      expect(result).toEqual({ allowed: true });
      expect(result.error).toBeUndefined();
    });

    it('should return allowed: false with error message when file operations are disabled', () => {
      mockConfig.get.mockReturnValue(false);
      
      const result = validateFileOperations();
      
      expect(result).toEqual({
        allowed: false,
        error: 'File operations are disabled. Set files.enabled=true in config or FILES_ENABLED=true in environment.'
      });
    });

    it('should return allowed: true when config is missing (default behavior)', () => {
      mockConfig.get.mockImplementation(() => {
        throw new Error('Config missing');
      });
      
      const result = validateFileOperations();
      
      expect(result).toEqual({ allowed: true });
      expect(result.error).toBeUndefined();
    });

    it('should return allowed: true when files.enabled is undefined', () => {
      mockConfig.get.mockReturnValue(undefined);
      
      const result = validateFileOperations();
      
      expect(result).toEqual({ allowed: true });
    });

    it('should return allowed: true when files.enabled is null', () => {
      mockConfig.get.mockReturnValue(null);
      
      const result = validateFileOperations();
      
      expect(result).toEqual({ allowed: true });
    });

    it('should return allowed: false when files.enabled is explicitly false', () => {
      mockConfig.get.mockReturnValue(false);
      
      const result = validateFileOperations();
      
      expect(result.allowed).toBe(false);
      expect(result.error).toContain('File operations are disabled');
      expect(result.error).toContain('files.enabled=true');
      expect(result.error).toContain('FILES_ENABLED=true');
    });

    it('should return allowed: false when files.enabled is falsy (0)', () => {
      mockConfig.get.mockReturnValue(0);
      
      const result = validateFileOperations();
      
      expect(result).toEqual({
        allowed: false,
        error: 'File operations are disabled. Set files.enabled=true in config or FILES_ENABLED=true in environment.'
      });
    });

    it('should return allowed: false when files.enabled is falsy (empty string)', () => {
      mockConfig.get.mockReturnValue('');
      
      const result = validateFileOperations();
      
      expect(result).toEqual({
        allowed: false,
        error: 'File operations are disabled. Set files.enabled=true in config or FILES_ENABLED=true in environment.'
      });
    });

    it('should return allowed: true when files.enabled is truthy string', () => {
      mockConfig.get.mockReturnValue('enabled');
      
      const result = validateFileOperations();
      
      expect(result).toEqual({ allowed: true });
    });

    it('should return allowed: true when files.enabled is truthy number', () => {
      mockConfig.get.mockReturnValue(1);
      
      const result = validateFileOperations();
      
      expect(result).toEqual({ allowed: true });
    });
  });

  describe('integration tests', () => {
    it('should have consistent behavior between areFileOperationsEnabled and validateFileOperations', () => {
      const testCases = [true, false, undefined, null, 0, 1, '', 'enabled'];
      
      testCases.forEach(value => {
        mockConfig.get.mockReturnValue(value);
        
        const enabledResult = areFileOperationsEnabled();
        const validationResult = validateFileOperations();
        
        expect(validationResult.allowed).toBe(enabledResult);
        
        if (!enabledResult) {
          expect(validationResult.error).toBeDefined();
          expect(validationResult.error).toContain('File operations are disabled');
        } else {
          expect(validationResult.error).toBeUndefined();
        }
      });
    });

    it('should handle config errors consistently', () => {
      const errors = [
        new Error('Config not found'),
        new TypeError('Cannot read property'),
        'String error',
        { message: 'Object error' }
      ];
      
      errors.forEach(error => {
        mockConfig.get.mockImplementation(() => {
          throw error;
        });
        
        const enabledResult = areFileOperationsEnabled();
        const validationResult = validateFileOperations();
        
        expect(enabledResult).toBe(true);
        expect(validationResult.allowed).toBe(true);
        expect(validationResult.error).toBeUndefined();
      });
    });
  });
});