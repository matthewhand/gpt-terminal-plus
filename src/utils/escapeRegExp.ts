/**
 * Escapes special characters in a string to be used in a regular expression.
 * @param {string} string - The string to escape.
 * @returns {string} The escaped string.
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}
