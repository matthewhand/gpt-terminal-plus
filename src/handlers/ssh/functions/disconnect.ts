import { Client } from 'ssh2';
import Debug from 'debug';

const debug = Debug('app:disconnect');

/**
 * Disconnects the SSH client from the remote server.
 * @param client - The SSH client instance.
 * @returns A promise that resolves when the client is disconnected.
 */
export async function disconnect(client: Client): Promise<void> {
    return new Promise((resolve) => {
        client.on('close', () => {
            debug('SSH connection closed');
            resolve();
        }).end();
    });
}
