import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:transferFile');

/**
 * Transfers a file to/from the remote server using the provided SSH client.
 * @param client - The SSH client instance.
 * @param config - The server configuration.
 * @param localPath - The local file path.
 * @param remotePath - The remote file path.
 * @param direction - The direction of transfer ('upload' or 'download').
 * @returns A promise that resolves when the file transfer is complete.
 */
export async function transferFile(client: Client, config: ServerConfig, localPath: string, remotePath: string, direction: 'upload' | 'download'): Promise<void> {
    debug(`Transferring file ${direction === 'upload' ? 'to' : 'from'} remote server: ${localPath} -> ${remotePath}`);
    return new Promise((resolve, reject) => {
        client.sftp((err, sftp) => {
            if (err) {
                debug(`SFTP error: ${err.message}`);
                return reject(new Error(`SFTP error: ${err.message}`));
            }

            const transfer = direction === 'upload'
                ? sftp.fastPut(localPath, remotePath, (err) => {
                    if (err) {
                        debug(`File upload error: ${err.message}`);
                        return reject(new Error(`File upload error: ${err.message}`));
                    }
                    resolve();
                })
                : sftp.fastGet(remotePath, localPath, (err) => {
                    if (err) {
                        debug(`File download error: ${err.message}`);
                        return reject(new Error(`File download error: ${err.message}`));
                    }
                    resolve();
                });

            transfer.on('end', () => {
                debug(`File transfer complete: ${localPath} -> ${remotePath}`);
                resolve();
            });
        });
    });
}
