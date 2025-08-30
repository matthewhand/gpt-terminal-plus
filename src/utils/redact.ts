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

    // Handle null or undefined values
    if (value == null) {
        return key + ': [Value is null or undefined]';
    } else if (typeof value !== 'string') {
        // Safely stringify non-string values
        try {
            value = JSON.stringify(value);
        } catch (error: any) {
            debug('Error stringifying value: ' + error.message);
            return key + ': [Complex value cannot be stringified]';
        }
    }

    // Define sensitive keys and patterns for redaction
    const sensitiveKeys = ['token', 'password', 'secret', 'apikey', 'api_key', 'private_key', 'ssh_private_key'];
    const sensitiveKeyPatterns = ['database_url', 'db_url', 'connection_string'];

    // Check if the key contains sensitive information
    const lowerKey = key.toLowerCase();
    const isSensitiveKey = sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey)) ||
                          sensitiveKeyPatterns.some(pattern => lowerKey.includes(pattern));

    // Check for sensitive value patterns (URLs with credentials, private keys, etc.)
    const hasSensitiveValue = /:\/\/[^:]+:[^@]+@/.test(value) || // URLs with user:pass@
                              /-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(value); // Private keys

    if (isSensitiveKey || hasSensitiveValue) {
        const visibleLength = Math.max(1, Math.floor(value.length / 4));
        const redactedPart = value.substring(0, visibleLength) + '...' + value.slice(-visibleLength);
        return key + ': ' + redactedPart;
    }

    // Return the original key-value pair if no redaction is needed
    return key + ': ' + value;
}
