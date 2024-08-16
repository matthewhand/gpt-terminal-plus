import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ExecutionResult } from '../../../types/ExecutionResult';
import debug from 'debug';

const executeCodeDebug = debug('app:executeCode');

// Load configuration from environment variables
const DEFAULT_TIMEOUT = parseInt(process.env.DEFAULT_TIMEOUT || '5000', 10);
const USE_EXECFILE = process.env.USE_EXECFILE === 'true';
const ENABLE_CLEANUP = process.env.ENABLE_CLEANUP === 'true';
const CLEANUP_DELAY = parseInt(process.env.CLEANUP_DELAY || '1000', 10);
const DISABLE_SHEBANG = process.env.DISABLE_SHEBANG === 'true';

/**
 * Executes code in either Python or TypeScript by creating a temporary file and running it.
 * 
 * @param {string} code - The code to execute.
 * @param {string} language - The programming language of the code ('python' or 'typescript').
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Optional timeout in milliseconds for code execution. Defaults to 5000ms.
 * @param {string} [directory=os.tmpdir()] - The directory from which to execute the code. Defaults to the system's temporary directory.
 * @returns {Promise<ExecutionResult>} - A promise that resolves with the execution result.
 * @throws {Error} Will throw an error if invalid language is provided or if code execution fails.
 */
export async function executeCode(
    code: string,
    language: string,
    timeout: number = DEFAULT_TIMEOUT,
    directory: string = os.tmpdir()
): Promise<ExecutionResult> {
    // Guard: Validate the programming language
    if (!['python', 'typescript'].includes(language.toLowerCase())) {
        const errorMessage = `Invalid language provided: ${language}. Supported languages are 'python' and 'typescript'.`;
        executeCodeDebug(errorMessage);
        throw new Error(errorMessage);
    }

    // Guard: Ensure the code is not empty
    if (!code) {
        const errorMessage = 'No code provided for execution.';
        executeCodeDebug(errorMessage);
        throw new Error(errorMessage);
    }

    // Determine the file extension based on the language
    const fileExtension = language.toLowerCase() === 'python' ? 'py' : 'ts';
    const tempFilePath = path.join(directory, `code-${Date.now()}.${fileExtension}`);
    executeCodeDebug(`Generated temp file path: ${tempFilePath}`);

    try {
        // Write the code to the temporary file
        await fs.writeFile(tempFilePath, code, { mode: 0o755 });
        executeCodeDebug(`Code written to temp file: ${tempFilePath}`);

        // Generate the command to execute based on the language
        const command = language.toLowerCase() === 'python'
            ? `python3 ${tempFilePath}`
            : `node ${tempFilePath}`;
        executeCodeDebug(`Generated command: ${command}`);

        // Execute the command and capture the output
        const result = await new Promise<ExecutionResult>((resolve) => {
            execFile(command, [], { cwd: directory, timeout }, (error, stdout, stderr) => {
                if (error) {
                    executeCodeDebug(`Execution error: ${stderr}`);
                    resolve({ stdout, stderr, error: true });
                } else {
                    executeCodeDebug(`Execution success: ${stdout}`);
                    resolve({ stdout, stderr, error: false });
                }
            });
        });

        return result;
    } catch (error) {
        // Log and return an error result if execution fails
        executeCodeDebug(`Caught error: ${(error as Error).message}`);
        return { stdout: '', stderr: `Execution failed: ${(error as Error).message}`, error: true };
    } finally {
        // Handle cleanup of the temporary code file
        if (ENABLE_CLEANUP) {
            executeCodeDebug(`Cleanup is enabled. Deleting temp file: ${tempFilePath}`);
            setTimeout(async () => {
                try {
                    await fs.unlink(tempFilePath);
                    executeCodeDebug(`Temp file deleted: ${tempFilePath}`);
                } catch (cleanupError) {
                    executeCodeDebug(`Failed to delete temp file: ${tempFilePath}. Error: ${(cleanupError as Error).message}`);
                }
            }, CLEANUP_DELAY);
        } else {
            executeCodeDebug('Cleanup is disabled. Temp file will not be deleted.');
        }
    }
}
