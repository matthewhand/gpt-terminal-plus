import Debug from 'debug';

const debug = Debug('app:redact');

/**
 * Utility to redact sensitive information from key-value pairs.
 *
 * This function redacts sensitive information by hiding the middle portion of sensitive values.
 * Typically used in logging or data processing to avoid exposing sensitive data.
 *
 * Key Features:
 * - Redacts sensitive values based on key patterns (e.g., tokens, passwords).
 * - Handles non-string values by stringifying them.
 * - Detailed logging for invalid keys or errors during stringification.
 * - Redacts middle portion of sensitive values.
 *
 * @param {string} key - The key identifying the type of information.
 * @param {any} value - The value that may contain sensitive information.
 * @returns {string} The redacted key-value pair as a string.
 */
export function redact(key: string, value: any): string {
    // Ensure the key is a string
    if (typeof key !== 'string') {
        debug('Invalid key type: ' + typeof key + '. Key must be a string.');
        return 'Invalid key: [Key must be a string]';
    }

    // Define sensitive keys and patterns for redaction
    const sensitiveKeys = ['token', 'password', 'secret', 'apikey', 'api_key', 'private_key', 'ssh_private_key', 'auth', 'authorization', 'credential', 'privatekey', 'accesstoken', 'refreshtoken', 'sessiontoken', 'jwt'];
    const sensitiveKeyPatterns = ['database_url', 'db_url', 'connection_string'];

    // Check if the key contains sensitive information
    const lowerKey = key.toLowerCase();
    const isSensitiveKey = sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey)) ||
                          sensitiveKeyPatterns.some(pattern => lowerKey.includes(pattern)) ||
                          // More specific key patterns
                          /\b(api|secret|private|auth|token|jwt|credential).*key\b/.test(lowerKey) ||
                          /\bkey\b/.test(lowerKey) && !/^(normal|regular|simple|basic|public|test)key$/i.test(lowerKey);

    // Handle null or undefined values
    if (value == null) {
        return '[Value is null or undefined]';
    }

    // Check for sensitive value patterns (URLs with credentials, private keys, etc.)
    let hasSensitiveValue = false;
    if (typeof value === 'string') {
        hasSensitiveValue = /:\/\/[^:]+:[^@]+@/.test(value) || // URLs with user:pass@
                           /-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(value); // Private keys
    }

    if (isSensitiveKey || hasSensitiveValue) {
        // For non-string values, redact without stringifying
        if (typeof value !== 'string') {
            return `${key}: ...[Redacted sensitive value]...`;
        }
        const visibleLength = Math.max(1, Math.floor(value.length / 8)); // Show less of the original
        const redactedPart = value.substring(0, visibleLength) + '...' + value.slice(-visibleLength);
        return `${key}: ${redactedPart}`;
    }

    // For non-sensitive non-string values, stringify them
    if (typeof value !== 'string') {
        try {
            value = JSON.stringify(value);
        } catch (error: any) {
            debug('Error stringifying value: ' + error.message);
            return '[Complex value cannot be stringified]';
        }
    }

    // Return the original value if no redaction is needed
    return value;
}
