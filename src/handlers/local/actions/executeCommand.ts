import { escapeSpecialChars } from '../../../common/escapeSpecialChars';
import { exec } from 'child_process';

/**
 * Executes a given shell command locally, with support for special character escaping and environment configuration.
 * 
 * @param {string} command - The shell command to execute.
 * @param {number} [timeout] - Optional timeout in milliseconds for the command execution.
 * @param {string} [directory='.'] - The directory from which to execute the command. Defaults to the current directory.
 * @param {string} [shell='/bin/bash'] - The shell environment in which to run the command. Defaults to '/bin/bash'.
 * @returns {Promise<{ stdout: string; stderr: string; presentWorkingDirectory: string }>} - A promise that resolves with the command's output.
 * @throws Will throw an error if the command execution fails.
 */
export async function executeCommand(
    command: string,
    timeout?: number,
    directory: string = '.',
    shell: string = '/bin/bash'
): Promise<{ stdout: string; stderr: string; presentWorkingDirectory: string }> {
    // Validate the command input
    if (typeof command !== 'string' || command.trim() === '') {
        console.error('Invalid command provided:', command);
        throw new Error('Command must be a non-empty string');
    }

    // Escape special characters in the command
    const escapedCommand = escapeSpecialChars(command);
    console.debug(`Escaped command: ${escapedCommand}`);

    // Define execution options with defaults
    const options = {
        cwd: directory,
        timeout: timeout || 0,
        shell: shell,
    };
    console.debug(`Execution options: cwd=${options.cwd}, timeout=${options.timeout}, shell=${options.shell}`);

    // Execute the command and return the result
    return new Promise((resolve, reject) => {
        exec(escapedCommand, options, (error: Error | null, stdout: string, stderr: string) => {
            console.debug(`Command executed. stdout: ${stdout}, stderr: ${stderr}`);

            if (error) {
                console.error(`Error executing command: ${escapedCommand}`, error);
                reject({ stdout, stderr, presentWorkingDirectory: options.cwd });
            } else {
                resolve({ stdout, stderr, presentWorkingDirectory: options.cwd });
            }
        });
    });
}
