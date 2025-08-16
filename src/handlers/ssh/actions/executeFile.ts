import { Client } from 'ssh2';
import { ExecutionResult } from '../../../types/ExecutionResult';
import debug from 'debug';

const executeFileDebug = debug('app:ssh:executeFile');

/**
 * Executes a file on a remote SSH server.
 * 
 * @param {Client} sshClient - The SSH client connected to the remote server.
 * @param {string} filename - The name of the file to execute on the remote server.
 * @param {string} [directory] - The directory where the file is located.
 * @param {number} [timeout] - Optional timeout for file execution in milliseconds.
 * @returns {Promise<ExecutionResult>} - A promise that resolves with the execution result.
 */
export async function executeFile(
    sshClient: Client,
    filename: string,
    directory?: string,
    timeout?: number
): Promise<ExecutionResult> {
    return new Promise<ExecutionResult>((resolve, reject) => {
        let command: string = `./${filename}`;
        if (directory) {
            command = `cd ${directory} && ${command}`;
        }

        executeFileDebug(`Executing command on SSH server: ${command}`);

        sshClient.exec(command, (err, stream) => {
            if (err) {
                executeFileDebug(`Error executing file: ${err.message}`);
                return resolve({
                    stdout: '',
                    stderr: err.message,
                    error: true,
                    exitCode: 1,
                } as ExecutionResult);
            }

            let stdout: string = '';
            let stderr: string = '';

            stream.on('close', (code: number, signal: string) => {
                executeFileDebug(`Stream closed with code: ${code}, signal: ${signal}`);
                resolve({
                    stdout,
                    stderr,
                    error: (code ?? 1) !== 0,
                    exitCode: code ?? 1,
                } as ExecutionResult);
            });

            stream.on('data', (data: Buffer) => {
                stdout += data.toString();
            });

            stream.stderr.on('data', (data: Buffer) => {
                stderr += data.toString();
            });

            if (timeout) {
                setTimeout(() => {
                    stream.close();
                    executeFileDebug(`Timeout of ${timeout} ms reached, stream closed`);
                    resolve({
                        stdout,
                        stderr,
                        error: true,
                        exitCode: 124,
                    } as ExecutionResult);
                }, timeout);
            }
        });
    });
}
