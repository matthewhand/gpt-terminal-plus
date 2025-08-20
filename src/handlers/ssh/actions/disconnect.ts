import { Client } from 'ssh2';
import Debug from 'debug';

const debug = Debug('app:disconnect');

/**
 * Disconnects the SSH client from the remote server.
 * @param {Client} client - The SSH client instance.
 * @returns {Promise<void>} A promise that resolves when the client is disconnected.
 */
export async function disconnect(client: Client): Promise<void> {
    // Validate inputs
    if (!client || !(client instanceof Client)) {
        const errorMessage = 'SSH client must be provided and must be an instance of Client.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }

    return new Promise((resolve) => {
        client.on('close', () => {
            debug('SSH connection closed');
            resolve();
        }).end();
    });
}
