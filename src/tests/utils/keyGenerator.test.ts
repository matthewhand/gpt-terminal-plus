import { generateApiKey, generateSecureKey, validateKeyStrength } from '../../utils/keyGenerator';

describe('Key Generator', () => {
  describe('generateApiKey', () => {
    test('should generate hex key of specified length', () => {
      const key = generateApiKey(32);
      expect(key).toHaveLength(32);
      expect(key).toMatch(/^[a-f0-9]+$/);
    });

    test('should generate different keys each time', () => {
      const key1 = generateApiKey();
      const key2 = generateApiKey();
      expect(key1).not.toBe(key2);
    });

    test('should handle different lengths', () => {
      expect(generateApiKey(16)).toHaveLength(16);
      expect(generateApiKey(64)).toHaveLength(64);
    });
  });

  describe('generateSecureKey', () => {
    test('should generate alphanumeric key', () => {
      const key = generateSecureKey();
      expect(key).toHaveLength(32);
      expect(key).toMatch(/^[A-Za-z0-9]+$/);
    });

    test('should use cryptographically secure randomness', () => {
      const keys = Array.from({ length: 100 }, () => generateSecureKey(8));
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(100); // All should be unique
    });

    test('should have good character distribution', () => {
      const key = generateSecureKey(1000);
      const hasUpper = /[A-Z]/.test(key);
      const hasLower = /[a-z]/.test(key);
      const hasDigits = /[0-9]/.test(key);
      
      expect(hasUpper).toBe(true);
      expect(hasLower).toBe(true);
      expect(hasDigits).toBe(true);
    });
  });

  describe('validateKeyStrength', () => {
    test('should validate strong keys', () => {
      const strongKey = 'Abc123XyzDef456GhiJkl789MnoPqr012';
      const result = validateKeyStrength(strongKey);
      expect(result.valid).toBe(true);
      expect(result.score).toBeGreaterThan(4);
      expect(result.issues).toHaveLength(0);
    });

    test('should reject weak keys', () => {
      const weakKey = 'abc';
      const result = validateKeyStrength(weakKey);
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Key too short (minimum 16 characters)');
    });

    test('should score keys appropriately', () => {
      const mediumKey = 'abcdefghijklmnop';
      const result = validateKeyStrength(mediumKey);
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThan(6);
    });

    test('should detect character variety', () => {
      const variedKey = 'Abc123!@#DefGhi456';
      const result = validateKeyStrength(variedKey);
      expect(result.score).toBeGreaterThan(4);
    });
  });
});