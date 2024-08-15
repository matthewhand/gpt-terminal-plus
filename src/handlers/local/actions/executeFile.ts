import { execFile } from 'child_process';
import { promisify } from 'util';
import { ExecutionResult } from '../../../types/ExecutionResult';

const execFileAsync = promisify(execFile);

/**
 * Executes a file on the local server.
 * 
 * @param {string} filename - The name of the file to execute.
 * @param {string} [directory] - The directory where the file is located.
 * @param {number} [timeout] - Optional timeout for file execution.
 * @returns {Promise<ExecutionResult>} - A promise that resolves with the execution result.
 */
export async function executeFile(
  filename: string,
  directory?: string,
  timeout?: number // Declared the timeout parameter
): Promise<ExecutionResult> {
  const options = {
    cwd: directory,
    timeout: timeout // Initialize the timeout value in options
  };

  try {
    const { stdout, stderr } = await execFileAsync(filename, [], options);
    return { stdout, stderr, error: false };
  } catch (error) {
    return {
      stdout: '',
      stderr: (error as Error).message,
      error: true
    };
  }
}
