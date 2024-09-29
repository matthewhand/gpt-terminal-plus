/**
 * @fileoverview Utility function to escape special regex characters in a string.
 */

/**
 * Escapes special characters in a string to be used in a regular expression.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
export function escapeRegExp(str: string): string {
  if (!str) return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
