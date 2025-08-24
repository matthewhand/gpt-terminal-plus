import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import { ListParams } from '../../../types/ListParams';
import Debug from 'debug';

const debug = Debug('app:listFiles');

/**
 * Lists files in a directory on the remote server.
 * @param {Client} client - The SSH client instance.
 * @param {ServerConfig} config - The server configuration.
 * @param {ListParams} params - The parameters for listing files.
 * @returns {Promise<string[]>} A promise that resolves to an array of filenames.
 */
export async function listFiles(client: Client, config: ServerConfig, params: ListParams): Promise<string[]> {
    const { directory } = params;

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
    if (!directory || typeof directory !== 'string') {
        const errorMessage = 'Directory must be provided and must be a string.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }

    debug(`Listing files in directory: ${directory}`);
    return new Promise((resolve, reject) => {
        client.sftp((err, sftp) => {
            if (err) {
                debug(`SFTP error: ${err.message}`);
                return reject(new Error(`SFTP error: ${err.message}`));
            }

            sftp.readdir(directory, (err, list) => {
                if (err) {
                    debug(`Error listing files: ${err.message}`);
                    return reject(new Error(`Error listing files: ${err.message}`));
                }

                const filenames = list.map(item => item.filename);
                debug(`Files in directory ${directory}: ${filenames.join(', ')}`);
                resolve(filenames);
            });
        });
    });
}
