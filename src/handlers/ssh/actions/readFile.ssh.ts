import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:readFile');

/**
 * Reads the content of a file from the remote server.
 * @param {Client} client - The SSH client instance.
 * @param {ServerConfig} config - The server configuration.
 * @param {string} filePath - The remote file path.
 * @returns {Promise<string>} A promise that resolves to the file content.
 */
export async function readFile(client: Client, config: ServerConfig, filePath: string): Promise<string> {
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

  debug('Reading content of file: ' + filePath);
  return new Promise((resolve, reject) => {
    client.exec('cat ' + filePath, (err, stream) => {
      if (err) {
        debug('Error executing command: ' + err.message);
        return reject(err);
      }
      let data: string = '';
      stream.on('data', (chunk: Buffer) => {
        data += chunk.toString();
      });
      stream.on('end', () => {
        debug('File content read successfully');
        resolve(data);
      });
    });
  });
}
