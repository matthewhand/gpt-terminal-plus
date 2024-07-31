import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:getFileContent');

/**
 * Retrieves the content of a file from the remote server.
 * @param {Client} client - The SSH client instance.
 * @param {ServerConfig} config - The server configuration.
 * @param {string} filePath - The remote file path.
 * @returns {Promise<string>} A promise that resolves to the file content.
 */
export async function getFileContent(client: Client, config: ServerConfig, filePath: string): Promise<string> {
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

    debug('Retrieving content of file: ' + filePath);
    return new Promise((resolve, reject) => {
        client.sftp((err, sftp) => {
            if (err) {
                debug('SFTP error: ' + err.message);
                return reject(new Error('SFTP error: ' + err.message));
            }

            sftp.readFile(filePath, (err, data) => {
                if (err) {
                    debug('Error reading file: ' + err.message);
                    return reject(new Error('Error reading file: ' + err.message));
                }

                resolve(data.toString('utf8')); // Convert Buffer to string
            });
        });
    });
}
