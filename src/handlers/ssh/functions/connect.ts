import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:connect');

/**
 * Establishes an SSH connection to the remote server.
 * @param config - The server configuration.
 * @returns A promise that resolves to the SSH client instance.
 */
export async function connect(config: ServerConfig): Promise<Client> {
    return new Promise((resolve, reject) => {
        const client = new Client();
        client.on('ready', () => {
            debug('SSH connection established');
            resolve(client);
        }).on('error', (err) => {
            debug(`SSH connection error: ${err.message}`);
            reject(new Error(`SSH connection error: ${err.message}`));
        }).connect({
            host: config.host,
            port: config.port || 22,
            username: config.username,
            privateKey: config.privateKey
        });
    });
}
