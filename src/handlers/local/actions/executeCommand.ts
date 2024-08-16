import { exec, execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { Shescape } from 'shescape';
import debug from 'debug';

const executeCommandDebug = debug('app:executeCommand');

// Load configuration from environment variables
const DEFAULT_TIMEOUT = parseInt(process.env.DEFAULT_TIMEOUT || '0', 10);
const DEFAULT_SHELL = process.env.DEFAULT_SHELL || '/bin/bash';
const USE_EXECFILE = process.env.USE_EXECFILE === 'true';
const ENABLE_CLEANUP = process.env.ENABLE_CLEANUP === 'true';
const CLEANUP_DELAY = parseInt(process.env.CLEANUP_DELAY || '1000', 10);
const DISABLE_SHEBANG = process.env.DISABLE_SHEBANG === 'true';

/**
 * Executes a shell command by either using exec or execFile based on an environment variable.
 * This function is designed to work across both POSIX and non-POSIX systems.
 * 
 * @param {string} command - The shell command to execute.
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Optional timeout in milliseconds for the command execution.
 * @param {string} [directory='.'] - The directory from which to execute the command. Defaults to the current directory.
 * @param {string} [shell=DEFAULT_SHELL] - The shell environment in which to run the command. Defaults to `/bin/bash`.
 * @returns {Promise<{ stdout: string; stderr: string; presentWorkingDirectory: string }>} - A promise that resolves with the command's output.
 * @throws Will throw an error if the command execution fails.
 */
export async function executeCommand(
    command: string,
    timeout: number = DEFAULT_TIMEOUT,
    directory: string = '.',
    shell: string = DEFAULT_SHELL
): Promise<{ stdout: string; stderr: string; presentWorkingDirectory: string }> {
    // Validate that a command is provided
    if (!command) {
        throw new Error('Command must be provided.');
    }

    executeCommandDebug(`Received command: ${command}`);
    executeCommandDebug(`Using shell: ${shell}`);
    executeCommandDebug(`Working directory: ${directory}`);
    executeCommandDebug(`Timeout: ${timeout}`);
    executeCommandDebug(`Using execFile: ${USE_EXECFILE}`);
    executeCommandDebug(`Enable Cleanup: ${ENABLE_CLEANUP}`);
    executeCommandDebug(`Cleanup Delay: ${CLEANUP_DELAY}`);
    executeCommandDebug(`Disable Shebang: ${DISABLE_SHEBANG}`);

    // Initialize Shescape
    const shescape = new Shescape({ shell: USE_EXECFILE ? false : shell });

    // Prepare the command
    let commandToExecute: string;
    let args: string[];

    if (USE_EXECFILE) {
        // For execFile, quote each argument properly using shescape.quote
        args = command.split(' ').map(arg => shescape.quote(arg));
        commandToExecute = args[0];
        args = args.slice(1);
    } else {
        // For exec with bash -c, quote the entire command
        const escapedCommand = shescape.quote(command);
        commandToExecute = `${shell} -c ${escapedCommand}`;
        args = [];
    }

    try {
        // Define the execution options
        const execOptions = {
            cwd: directory,
            timeout: timeout || 0,
            shell: shell,
            env: { ...process.env },
        };
        executeCommandDebug(`Execution options: ${JSON.stringify(execOptions)}`);

        // Execute the command
        return new Promise((resolve, reject) => {
            if (USE_EXECFILE) {
                execFile(commandToExecute, args, execOptions, (error, stdout, stderr) => {
                    executeCommandDebug(`Command executed with execFile. stdout: ${stdout}, stderr: ${stderr}`);

                    if (error) {
                        executeCommandDebug(`Error during command execution with execFile: ${error.message}`);
                        reject({ stdout, stderr, presentWorkingDirectory: execOptions.cwd });
                    } else {
                        resolve({ stdout, stderr, presentWorkingDirectory: execOptions.cwd });
                    }
                });
            } else {
                exec(commandToExecute, execOptions, (error, stdout, stderr) => {
                    executeCommandDebug(`Command executed with exec. stdout: ${stdout}, stderr: ${stderr}`);

                    if (error) {
                        executeCommandDebug(`Error during command execution with exec: ${error.message}`);
                        reject({ stdout, stderr, presentWorkingDirectory: execOptions.cwd });
                    } else {
                        resolve({ stdout, stderr, presentWorkingDirectory: execOptions.cwd });
                    }
                });
            }
        });

    } finally {
        // Handle cleanup of the temporary script file if applicable
        if (ENABLE_CLEANUP) {
            executeCommandDebug(`Cleanup is enabled. Deleting temporary script file after ${CLEANUP_DELAY}ms delay.`);
            setTimeout(async () => {
                try {
                    // Cleanup logic if needed
                } catch (cleanupError) {
                    executeCommandDebug(`Failed to delete temporary script file. Error: ${(cleanupError as Error).message}`);
                }
            }, CLEANUP_DELAY);
        } else {
            executeCommandDebug('Cleanup is disabled. Temporary script file will not be deleted.');
        }
    }
}
