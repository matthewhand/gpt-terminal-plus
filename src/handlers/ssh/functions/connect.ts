import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:connect');

/**
 * Establishes an SSH connection to the remote server.
 * @param {ServerConfig} config - The server configuration.
 * @returns {Promise<Client>} A promise that resolves to the SSH client instance.
 */
export async function connect(config: ServerConfig): Promise<Client> {
    return new Promise((resolve, reject) => {
        // Validate inputs
        if (!config || typeof config !== 'object') {
            const errorMessage = 'Server configuration must be provided and must be an object.';
            debug(errorMessage);
            throw new Error(errorMessage);
        }
        if (!config.host || typeof config.host !== 'string') {
            const errorMessage = 'Host must be provided and must be a string.';
            debug(errorMessage);
            throw new Error(errorMessage);
        }
        if (!config.username || typeof config.username !== 'string') {
            const errorMessage = 'Username must be provided and must be a string.';
            debug(errorMessage);
            throw new Error(errorMessage);
        }

        const client = new Client();
        client.on('ready', () => {
            debug('SSH connection established');
            resolve(client);
        }).on('error', (err) => {
            debug('SSH connection error: ' + err.message);
            reject(new Error('SSH connection error: ' + err.message));
        }).connect({
            host: config.host,
            port: config.port || 22,
            username: config.username
        });
    });
}
