import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import { escapeSpecialChars } from '../../../common/escapeSpecialChars';
import Debug from 'debug';

const debug = Debug('app:executeCommand');

/**
 * Executes a command on the remote server using the provided SSH client.
 * @param client - The SSH client instance.
 * @param config - The server configuration.
 * @param command - The command to execute.
 * @param options - Optional execution options.
 * @returns A promise that resolves to the command's stdout, stderr, and timeout status.
 */
export async function executeCommand(client: Client, config: ServerConfig, command: string, options: { cwd?: string, timeout?: number } = {}): Promise<{ stdout: string; stderr: string; timeout?: boolean }> {
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
    if (!command || typeof command !== 'string') {
        const errorMessage = 'Command must be provided and must be a string.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }
    if (options.cwd !== undefined && typeof options.cwd !== 'string') {
        const errorMessage = 'CWD must be a string.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }
    if (options.timeout !== undefined && typeof options.timeout !== 'number') {
        const errorMessage = 'Timeout must be a number.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }

    const { cwd, timeout = 60000 } = options;
    const escapedCommand = escapeSpecialChars(command);
    const execCommand = cwd ? `cd ${cwd} && ${escapedCommand}` : escapedCommand;

    debug(`Executing command: ${escapedCommand}`);
    return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';
        const execTimeout = setTimeout(() => {
            debug(`Timeout reached for command: ${escapedCommand}`);
            resolve({ stdout, stderr, timeout: true });
        }, timeout);

        client.exec(execCommand, (err, stream) => {
            if (err) {
                clearTimeout(execTimeout);
                debug(`Execution error: ${err.message}`);
                return reject(new Error(`Execution error: ${err.message}`));
            }

            stream.on('data', (data: Buffer) => {
                stdout += data.toString();
            });

            stream.stderr.on('data', (data: Buffer) => {
                stderr += data.toString();
            });

            stream.on('close', (code: number) => {
                clearTimeout(execTimeout);
                if (code === 0) {
                    debug(`Command executed successfully: ${escapedCommand}`);
                } else {
                    debug(`Execution failed for command: ${escapedCommand}, Exit Code: ${code}`);
                }
                resolve({ stdout, stderr, timeout: false });
            });
        });
    });
}
