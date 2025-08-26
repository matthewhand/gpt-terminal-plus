// child_process is required lazily to honor Jest mocks in some tests
import { convictConfig } from '../../../config/convictConfig';
import debug from 'debug';
import { ExecutionResult } from '../../../types/ExecutionResult';

const executeCommandDebug = debug('app:executeCommand');

// Configuration loaded from environment variables
const LOCAL_TIMEOUT = parseInt(process.env.LOCAL_TIMEOUT ?? process.env.DEFAULT_TIMEOUT ?? '0', 10);
const DEFAULT_SHELL = process.env.DEFAULT_SHELL || '/bin/bash';
const MAX_OUTPUT_CHARS = parseInt(process.env.MAX_OUTPUT_CHARS || '', 10) || (() => {
  try { return convictConfig().get('limits.maxOutputChars'); } catch { return 200000; }
})();
const USE_EXECFILE = process.env.USE_EXECFILE === 'true';

/**
 * Executes a shell command using either `exec` or `execFile`, depending on the configuration.
 * This function is designed to be compatible across POSIX and non-POSIX systems.
 *
 * @param {string} command - The shell command to execute.
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Optional timeout in milliseconds for command execution.
 * @param {string} [directory='.'] - The working directory from which the command will be executed.
 * @param {string} [shell=DEFAULT_SHELL] - The shell environment to use. Defaults to `/bin/bash`.
 * @returns {Promise<ExecutionResult>} - A promise that resolves with the command's output.
 * @throws {Error} If command execution fails or if inputs are invalid.
 */
export async function executeCommand(
  command: string,
  timeout: number = LOCAL_TIMEOUT,
  directory: string = '.',
  shell: string = DEFAULT_SHELL
): Promise<any> {
  // Input validation
  if (!command || typeof command !== 'string') {
    throw new Error('A valid command string must be provided.');
  }
  if (typeof timeout !== 'number' || timeout < 0) {
    throw new Error('Timeout must be a non-negative number.');
  }
  if (!directory || typeof directory !== 'string') {
    throw new Error('A valid directory string must be provided.');
  }
  if (!shell || typeof shell !== 'string') {
    throw new Error('A valid shell string must be provided.');
  }

  // Debug logging
  executeCommandDebug(`Received command: ${command}`);
  executeCommandDebug(`Using shell: ${shell}`);
  executeCommandDebug(`Working directory: ${directory}`);
  executeCommandDebug(`Timeout: ${timeout}`);
  executeCommandDebug(`Using execFile: ${USE_EXECFILE}`);

  let commandToExecute: string;
  let args: string[] = [];

  // Resolve timeout with per-backend default if undefined or invalid
  const resolvedTimeout = (typeof timeout === 'number' && timeout >= 0) ? timeout : LOCAL_TIMEOUT;

  // Execution options setup
  const execOptions: any = {
    cwd: directory,
    timeout: resolvedTimeout || 0, // Default to no timeout if not specified
    shell: shell,
    env: { ...process.env }, // Pass current environment variables
  };
  // Enforce output ceiling via maxBuffer (stdout and stderr independently)
  execOptions.maxBuffer = Math.max(1024 * 64, Number(MAX_OUTPUT_CHARS));
  executeCommandDebug(`Execution options: ${JSON.stringify(execOptions)}`);

  // Execute the command and return the result
  return new Promise((resolve, reject) => {
    const { exec, execFile } = require('child_process');
    if (USE_EXECFILE) {
      execFile(command, args, execOptions, (error: any, stdout: string, stderr: string) => {
        executeCommandDebug(`Command executed with execFile. stdout: ${stdout}, stderr: ${stderr}`);
        if (error) {
          executeCommandDebug(`Error during command execution with execFile: ${error.message}`);
          const out = String(stdout || '');
          const err = String(stderr || '');
          const isMax = /maxBuffer/i.test(error?.message || '');
          const exitCode = typeof error?.code === 'number' ? error.code : 1;
          // In error cases, some tests expect a rejected promise with a slim shape
          return reject({ stdout: out, stderr: err, presentWorkingDirectory: directory });
        } else {
          resolve({ stdout, stderr, presentWorkingDirectory: directory });
        }
      });
    } else {
      exec(command, execOptions, (error: any, stdout: string, stderr: string) => {
        executeCommandDebug(`Command executed with exec. stdout: ${stdout}, stderr: ${stderr}`);
        if (error) {
          executeCommandDebug(`Error during command execution with exec: ${error.message}`);
          const out = String(stdout || '');
          const err = String(stderr || '');
          const isMax = /maxBuffer/i.test(error?.message || '');
          const exitCode = typeof error?.code === 'number' ? error.code : 1;
          return reject({ stdout: out, stderr: err, presentWorkingDirectory: directory });
        } else {
          resolve({ stdout, stderr, presentWorkingDirectory: directory });
        }
      });
    }
  });
}

export default { executeCommand };
