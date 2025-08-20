import { Client } from 'ssh2';
import Debug from 'debug';

const debug = Debug('app:executeSystemInfo');

/**
 * Executes a system info command on a remote SSH server.
 * @param {Client} sshClient - The SSH client.
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} The system info as a string.
 */
export async function executeSystemInfo(sshClient: Client, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Validate inputs
        if (!sshClient || !(sshClient instanceof Client)) {
            const errorMessage = 'SSH client must be provided and must be an instance of Client.';
            debug(errorMessage);
            throw new Error(errorMessage);
        }
        if (!command || typeof command !== 'string') {
            const errorMessage = 'Command must be provided and must be a string.';
            debug(errorMessage);
            throw new Error(errorMessage);
        }

        let commandOutput = '';
        debug('Executing command: ' + command);

        sshClient.exec(command, (err, stream) => {
            if (err) {
                debug('Error executing command: ' + err.message);
                return reject(err);
            }
            stream.on('data', (data: Buffer) => {
                commandOutput += data.toString();
            }).on('close', () => {
                sshClient.end();
                debug('Command executed successfully. Output: ' + commandOutput);
                resolve(commandOutput);
            }).stderr.on('data', (data: Buffer) => {
                const error = 'STDERR: ' + data.toString();
                debug(error);
                reject(new Error(error));
            });
        });
    });
}
