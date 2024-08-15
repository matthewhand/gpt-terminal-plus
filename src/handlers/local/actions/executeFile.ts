import { execFile } from 'child_process';
import { promisify } from 'util';
import { ExecutionResult } from '../../../types/ExecutionResult';
import debug from 'debug';

const execFileAsync = promisify(execFile);
const executeFileDebug = debug('app:executeFile');

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
  timeout?: number
): Promise<ExecutionResult> {
  // Validate the input to ensure filename is provided
  if (!filename) {
    throw new Error('Filename must be provided for execution.');
  }

  // Define the execution options
  const options = {
    cwd: directory,
    timeout: timeout || 0 // Default to no timeout if not provided
  };

  executeFileDebug(`Executing file: ${filename}`);
  executeFileDebug(`Options: ${JSON.stringify(options)}`);

  try {
    // Execute the file and capture the output
    const { stdout, stderr } = await execFileAsync(filename, [], options);
    executeFileDebug(`Execution successful. stdout: ${stdout}, stderr: ${stderr}`);
    return { stdout, stderr, error: false };
  } catch (error) {
    executeFileDebug(`Execution failed. Error: ${(error as Error).message}`);
    return {
      stdout: '',
      stderr: (error as Error).message,
      error: true
    };
  }
}
