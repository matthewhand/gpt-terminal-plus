import Debug from 'debug';
import { redact } from '../utils/redact';

const debug = Debug('app:envValidation');

/**
 * Validates that all required environment variables are set.
 * Logs warnings or errors if any variables are missing or misconfigured.
 */
export const validateEnvironmentVariables = (): void => {
  const requiredVariables = [
    'API_TOKEN',
    'NODE_CONFIG_DIR',
    'HTTPS_ENABLED',
    'CORS_ORIGIN',
    'DEFAULT_MODEL'
  ];

  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      debug('Environment variable ' + variable + ' is not set.');
    } else {
      debug('Environment variable ' + variable + ': ' + redact(variable, process.env[variable]));
    }
  });

  // Specific validations for HTTPS
  if (process.env.HTTPS_ENABLED === 'true') {
    if (!process.env.HTTPS_KEY_PATH || !process.env.HTTPS_CERT_PATH) {
      debug('HTTPS is enabled but HTTPS_KEY_PATH or HTTPS_CERT_PATH is not set.');
    }
  }
};
