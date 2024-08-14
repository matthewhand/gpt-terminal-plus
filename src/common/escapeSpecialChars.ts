/**
 * Escapes special characters in the input string based on environment variables.
 * By default, no characters are escaped unless explicitly enabled via environment variables.
 * @param {string} input - The input string to escape.
 * @returns {string} - The escaped string.
 */
export function escapeSpecialChars(input: string): string {
    let escaped = input;
  
    // Escape backward slash if enabled
    if (process.env.ESCAPE_BACKWARD_SLASH === 'true') {
        escaped = escaped.replace(/\\/g, "\\\\");
    }
  
    // Escape dollar sign if enabled
    if (process.env.ESCAPE_DOLLAR === 'true') {
        escaped = escaped.replace(/\$/g, "\\$");
    }
  
    // Escape backticks if enabled
    if (process.env.ESCAPE_BACKTICKS === 'true') {
        escaped = escaped.replace(/`/g, "\\$");
    }
  
    // Escape single and double quotes if enabled
    if (process.env.ESCAPE_QUOTES === 'true') {
        escaped = escaped.replace(/['"]/g, "\\$&");
    }
  
    // Escape forward slash if enabled
    if (process.env.ESCAPE_FORWARD_SLASH === 'true') {
        escaped = escaped.replace(/\//g, "\\/");
    }
  
    return escaped;
  }
  