import crypto from 'crypto';

/**
 * Checks if API_TOKEN is set in the environment, generates one if not.
 * Prints the generated token to the console if it was not found.
 * @returns {string} - The API token.
 */
export const getOrGenerateApiToken = (): string => {
  if (!process.env.API_TOKEN) {
    const generatedToken = crypto.randomBytes(16).toString('hex');
    console.log('API_TOKEN not found. Generated new token:', generatedToken);
    process.env.API_TOKEN = generatedToken;
  }
  return process.env.API_TOKEN;
};
