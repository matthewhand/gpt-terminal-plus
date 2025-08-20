import { Client } from 'ssh2';
import { SshHostConfig } from '../../../types/ServerConfig';
import Debug from 'debug';

const debug = Debug('app:connect');

/**
 * Establishes an SSH connection to the remote server.
 * @param {SshHostConfig} config - The server configuration.
 * @returns {Promise<Client>} A promise that resolves to the SSH client instance.
 */
export async function connect(config: SshHostConfig ): Promise<Client> {
    return new Promise((resolve, reject) => {
        // Validate inputs
        if (!config || typeof config !== 'object') {
            const errorMessage = 'Server configuration must be provided and must be an object.';
            debug(errorMessage);
            throw new Error(errorMessage);
        }
        if (!config.hostname || typeof config.hostname !== 'string') {
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
            host: config.hostname,
            port: config.port || 22,
            username: config.username
        });
    });
}
