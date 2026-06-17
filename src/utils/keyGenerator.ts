/**
 * Generates cryptographically secure random keys
 */
import crypto from 'crypto';

export function generateApiKey(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

export function generateSecureKey(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    key += chars.charAt(randomBytes[i] % chars.length);
  }
  return key;
}

export function validateKeyStrength(key: string): { valid: boolean; score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 0;
  
  if (key.length < 16) {
    issues.push('Key too short (minimum 16 characters)');
  } else if (key.length >= 32) {
    score += 2;
  } else {
    score += 1;
  }
  
  if (/[A-Z]/.test(key)) score += 1;
  if (/[a-z]/.test(key)) score += 1;
  if (/[0-9]/.test(key)) score += 1;
  if (/[^A-Za-z0-9]/.test(key)) score += 1;
  
  const uniqueChars = new Set(key).size;
  if (uniqueChars / key.length > 0.7) score += 1;
  
  return {
    valid: issues.length === 0 && score >= 4,
    score,
    issues
  };
}