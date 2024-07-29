import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:listFiles');

/**
 * Lists files in a directory on the remote server.
 * @param client - The SSH client instance.
 * @param config - The server configuration.
 * @param directory - The remote directory path.
 * @returns A promise that resolves to an array of filenames.
 */
export async function listFiles(client: Client, config: ServerConfig, directory: string): Promise<string[]> {
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
                resolve(filenames);
            });
        });
    });
}
