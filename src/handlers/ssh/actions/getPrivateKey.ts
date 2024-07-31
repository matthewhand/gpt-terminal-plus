import * as fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ServerConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:getPrivateKey');

/**
 * Retrieves the private key from the specified path or the default path.
 * @param {ServerConfig} config - The server configuration.
 * @returns {Promise<Buffer>} The private key as a buffer.
 */
export async function getPrivateKey(config: ServerConfig): Promise<Buffer> {
  // Validate inputs
  if (!config || typeof config !== 'object') {
    const errorMessage = 'Server configuration must be provided and must be an object.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  const privateKeyPath = config.privateKeyPath ?? path.join(os.homedir(), '.ssh', 'id_rsa');
  debug('Reading private key from ' + privateKeyPath);

  try {
    const privateKey = await fs.readFile(privateKeyPath);
    debug('Private key read successfully from ' + privateKeyPath);
    return privateKey;
  } catch (error) {
    const errorMessage = 'Failed to read private key from ' + privateKeyPath + ': ' + error;
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
