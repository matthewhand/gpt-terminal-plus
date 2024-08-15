import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import shellEscape from 'shell-escape';
import debug from 'debug';

const executeCommandDebug = debug('app:executeCommand');

/**
 * Executes a shell command by writing it to a temporary script file and running it.
 * This function is designed to work across both POSIX and non-POSIX systems.
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
    // Validate that the command is provided
    if (!command) {
        throw new Error('Command must be provided.');
    }

    executeCommandDebug(`Received command: ${command}`);
    executeCommandDebug(`Using shell: ${shell}`);
    executeCommandDebug(`Working directory: ${directory}`);
    executeCommandDebug(`Timeout: ${timeout}`);

    // Generate a unique file path for the temporary script
    const scriptFilePath = path.join(os.tmpdir(), `script-${Date.now()}.sh`);
    executeCommandDebug(`Generated script file path: ${scriptFilePath}`);

    try {
        // Determine whether to include a shebang based on environment variable
        const includeShebang = process.env.DISABLE_SHEBANG !== 'true';
        const shebang = includeShebang ? `#!${shell}\n` : '';

        // Construct the script content, ensuring $ symbols are properly escaped
        const scriptContent = `${shebang}${command.replace(/[$]/g, '\\$')}`;
        executeCommandDebug(`Script content: ${scriptContent}`);

        // Write the script content to the temporary file with executable permissions
        await fs.writeFile(scriptFilePath, scriptContent, { mode: 0o755 });
        executeCommandDebug(`Script file created with executable permissions`);

        // Define the execution options, including the specified shell and environment variables
        const options = {
            cwd: directory,
            timeout: timeout || 0,
            shell: shell,
            env: { ...process.env },
        };

        executeCommandDebug(`Execution options: ${JSON.stringify(options)}`);

        // Execute the script file using the specified shell
        return new Promise((resolve, reject) => {
            execFile(scriptFilePath, [], options, (error, stdout, stderr) => {
                executeCommandDebug(`Command executed. stdout: ${stdout}, stderr: ${stderr}`);

                if (error) {
                    executeCommandDebug(`Error during script execution: ${error.message}`);
                    reject({ stdout, stderr, presentWorkingDirectory: options.cwd });
                } else {
                    resolve({ stdout, stderr, presentWorkingDirectory: options.cwd });
                }
            });
        });

    } finally {
        // Handle cleanup of the temporary script file
        const enableCleanup = process.env.ENABLE_CLEANUP === 'true';
        const cleanupDelay = parseInt(process.env.CLEANUP_DELAY || '1000', 10);

        if (enableCleanup) {
            executeCommandDebug(`Cleanup is enabled. Deleting temporary script file after ${cleanupDelay}ms delay: ${scriptFilePath}`);
            setTimeout(async () => {
                try {
                    await fs.unlink(scriptFilePath);
                    executeCommandDebug(`Temporary script file deleted: ${scriptFilePath}`);
                } catch (cleanupError) {
                    executeCommandDebug(`Failed to delete temporary script file: ${scriptFilePath}. Error: ${(cleanupError as Error).message}`);
                }
            }, cleanupDelay);
        } else {
            executeCommandDebug('Cleanup is disabled. Temporary script file will not be deleted.');
        }
    }
}
