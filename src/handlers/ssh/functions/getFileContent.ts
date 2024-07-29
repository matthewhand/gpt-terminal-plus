import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:getFileContent');

/**
 * Retrieves the content of a file from the remote server.
 * @param client - The SSH client instance.
 * @param config - The server configuration.
 * @param filePath - The remote file path.
 * @returns A promise that resolves to the file content.
 */
export async function getFileContent(client: Client, config: ServerConfig, filePath: string): Promise<string> {
    debug(`Retrieving content of file: ${filePath}`);
    return new Promise((resolve, reject) => {
        client.sftp((err, sftp) => {
            if (err) {
                debug(`SFTP error: ${err.message}`);
                return reject(new Error(`SFTP error: ${err.message}`));
            }

            sftp.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    debug(`Error reading file: ${err.message}`);
                    return reject(new Error(`Error reading file: ${err.message}`));
                }

                resolve(data);
            });
        });
    });
}
