/**
 * Escapes special characters in a string.
 * @param {string} input - The string to escape.
 * @returns {string} - The escaped string.
 */
export function escapeSpecialChars(input: string): string {
  return input
    .replace(/\$/g, '\\u0024')   // Escapes $
    .replace(/`/g, '\\u0060')    // Escapes `
    .replace(/\\/g, '\\u005C');  // Escapes \\
}
