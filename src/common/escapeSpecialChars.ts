/**
 * Escapes special characters in the input string based on environment variables.
 * @param {string} input - The input string to escape.
 * @returns {string} - The escaped string.
 */
export function escapeSpecialChars(input: string): string {
  let escaped = input;
  if (process.env.ESCAPE_DOLLAR === 'true') {
    escaped = escaped.replace(/\$/g, "\\$");
  }
  if (process.env.ESCAPE_QUOTES === 'true') {
    escaped = escaped.replace(/['"]/g, "\\$&");
  }
  if (process.env.ESCAPE_BACKTICKS === 'true') {
    escaped = escaped.replace(/`/g, "\\$");
  }
  if (process.env.ESCAPE_FORWARD_SLASH === 'true') {
    escaped = escaped.replace(/\//g, "\\/");
  }
  if (process.env.ESCAPE_BACKWARD_SLASH === 'true') {
    escaped = escaped.replace(/\\/g, "\\\\");
  }
  return escaped;
}
