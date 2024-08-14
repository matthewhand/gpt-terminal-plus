import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

/**
 * Executes a given shell command locally by writing it to a temporary script file and executing it.
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

    // Create a temporary script file to hold the command
    const scriptFilePath = path.join(os.tmpdir(), `script-${Date.now()}.sh`);

    try {
        // Sanity check: Ensure no file exists at the path before writing
        try {
            await fs.access(scriptFilePath);
            console.error(`Sanity check failed: File already exists at ${scriptFilePath}`);
            throw new Error(`File already exists at ${scriptFilePath}`);
        } catch {
            // File does not exist, which is expected
            console.debug(`Sanity check passed: No pre-existing file at ${scriptFilePath}`);
        }

        // Write the command to the script file
        await fs.writeFile(scriptFilePath, command, { mode: 0o755 });

        // Sanity check: Ensure the file was written and exists
        try {
            await fs.access(scriptFilePath);
            console.debug(`Sanity check passed: File successfully created at ${scriptFilePath}`);
        } catch (error) {
            console.error(`Sanity check failed: File not found after creation at ${scriptFilePath}`);
            throw new Error(`File not found after creation at ${scriptFilePath}`);
        }

        const options = {
            cwd: directory,
            timeout: timeout || 0,
            shell: shell, // Specify the shell to be used
        };

        console.debug(`Executing script at path: ${scriptFilePath} with options: cwd=${options.cwd}, timeout=${options.timeout}, shell=${options.shell}`);

        // Execute the script file using execFile
        return new Promise((resolve, reject) => {
            execFile(scriptFilePath, [], options, (error, stdout, stderr) => {
                console.debug(`Command executed. stdout: ${stdout}, stderr: ${stderr}`);

                if (error) {
                    console.error(`Error executing script: ${scriptFilePath}`, error);
                    reject({ stdout, stderr, presentWorkingDirectory: options.cwd });
                } else {
                    resolve({ stdout, stderr, presentWorkingDirectory: options.cwd });
                }
            });
        });

    } finally {
        // Clean up: Delete the temporary script file
        try {
            await fs.unlink(scriptFilePath);
            console.debug(`Temporary script file deleted: ${scriptFilePath}`);
        } catch (cleanupError) {
            console.warn(`Failed to delete temporary script file: ${scriptFilePath}`, cleanupError);
        }
    }
}
