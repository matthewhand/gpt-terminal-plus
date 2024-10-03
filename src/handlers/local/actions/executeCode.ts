import { exec } from 'child_process';
import { ExecutionResult } from '../../../types/ExecutionResult';

/**
 * Executes code in a specified language with optional timeout and directory settings.
 * 
 * @param {string} code - The code snippet to execute.
 * @param {string} language - The programming language to use for execution.
 * @param {number} [timeout] - Optional timeout for execution in milliseconds.
 * @param {string} [directory] - Optional directory to execute the code in.
 * @returns {Promise<ExecutionResult>} - The result of the code execution, containing stdout and stderr.
 * @throws {Error} - If code or language is invalid, or if execution fails.
 */
export async function executeLocalCode(
  code: string,
  language: string,
  timeout?: number,
  directory?: string
): Promise<ExecutionResult> {
  if (!code || typeof code !== 'string') {
    throw new Error('Code is required for execution.');
  }

  if (!language || typeof language !== 'string') {
    throw new Error('Language is required for code execution.');
  }

  return new Promise((resolve, reject) => {
    // Construct the command to execute, optionally including the directory
    const command = directory
      ? `cd ${directory} && ${language} -c "${code}"`
      : `${language} -c "${code}"`;

    exec(command, { timeout: timeout }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error('Failed to execute code: ' + error.message));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}
