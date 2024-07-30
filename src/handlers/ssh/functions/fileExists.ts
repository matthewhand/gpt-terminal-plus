import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:fileExists');

/**
 * Checks if a file exists on the remote server.
 * @param {Client} client - The SSH client instance.
 * @param {ServerConfig} config - The server configuration.
 * @param {string} filePath - The path of the file to check.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the file exists.
 */
export async function fileExists(client: Client, config: ServerConfig, filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Validate inputs
    if (!client || !(client instanceof Client)) {
      const errorMessage = 'SSH client must be provided and must be an instance of Client.';
      debug(errorMessage);
      throw new Error(errorMessage);
    }
    if (!config || typeof config !== 'object') {
      const errorMessage = 'Server configuration must be provided and must be an object.';
      debug(errorMessage);
      throw new Error(errorMessage);
    }
    if (!filePath || typeof filePath !== 'string') {
      const errorMessage = 'File path must be provided and must be a string.';
      debug(errorMessage);
      throw new Error(errorMessage);
    }

    debug('Checking if file exists at ' + filePath);

    client.exec('test -f ' + filePath + ' && echo "exists"', (err, stream) => {
      if (err) {
        debug('Error executing command: ' + err.message);
        return reject(err);
      }

      let data: string = '';
      stream.on('data', (chunk: Buffer) => {
        data += chunk.toString();
      });
      stream.on('end', () => {
        const exists = data.trim() === 'exists';
        debug('File exists: ' + exists);
        resolve(exists);
      });
    });
  });
}
