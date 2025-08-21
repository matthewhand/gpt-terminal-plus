import { exec, execFile } from 'child_process';
import debug from 'debug';

const executeCommandDebug = debug('app:executeCommand');

// Configuration loaded from environment variables
const DEFAULT_TIMEOUT = parseInt(process.env.DEFAULT_TIMEOUT || '0', 10);
const DEFAULT_SHELL = process.env.DEFAULT_SHELL || '/bin/bash';
const USE_EXECFILE = process.env.USE_EXECFILE === 'true';

/**
 * Executes a shell command using either `exec` or `execFile`, depending on the configuration.
 * This function is designed to be compatible across POSIX and non-POSIX systems.
 *
 * @param {string} command - The shell command to execute.
 * @param {number} [timeout=DEFAULT_TIMEOUT] - Optional timeout in milliseconds for command execution.
 * @param {string} [directory='.'] - The working directory from which the command will be executed.
 * @param {string} [shell=DEFAULT_SHELL] - The shell environment to use. Defaults to `/bin/bash`.
 * @returns {Promise<{ stdout: string; stderr: string; presentWorkingDirectory: string }>} - A promise that resolves with the command's output.
 * @throws {Error} If command execution fails or if inputs are invalid.
 */
export async function executeCommand(
  command: string,
  timeout: number = DEFAULT_TIMEOUT,
  directory: string = '.',
  shell: string = DEFAULT_SHELL
): Promise<{ stdout: string; stderr: string; presentWorkingDirectory: string }> {
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

  // Determine how to prepare the command based on whether execFile is used
  if (USE_EXECFILE) {
    // For execFile, split the command into arguments manually
    const parts = command.split(' ');
    commandToExecute = parts.shift()!; // The first part becomes the command
    args = parts; // Remaining parts are arguments
    executeCommandDebug(`Prepared command for execFile: ${commandToExecute} with args: ${args.join(' ')}`);
  } else {
    // For exec, pass the command directly to the shell
    commandToExecute = `${shell} -c '${command.replace(/'/g, "'\\''")}'`;
    executeCommandDebug(`Prepared command for exec: ${commandToExecute}`);
  }

  // Execution options setup
  const execOptions = {
    cwd: directory,
    timeout: timeout || 0, // Default to no timeout if not specified
    shell: shell,
    env: { ...process.env }, // Pass current environment variables
  };
  executeCommandDebug(`Execution options: ${JSON.stringify(execOptions)}`);

  // Execute the command and return the result
  return new Promise((resolve, reject) => {
    if (USE_EXECFILE) {
      execFile(commandToExecute, args, execOptions, (error, stdout, stderr) => {
        const outStr = typeof stdout === 'string' ? stdout : String(stdout ?? '');
        const errStr = typeof stderr === 'string' ? stderr : String(stderr ?? '');
        executeCommandDebug(`Command executed with execFile. stdout: ${outStr}, stderr: ${errStr}`);
        if (error) {
          executeCommandDebug(`Error during command execution with execFile: ${error.message}`);
          reject({ stdout: outStr, stderr: errStr, presentWorkingDirectory: execOptions.cwd as string });
        } else {
          resolve({ stdout: outStr, stderr: errStr, presentWorkingDirectory: execOptions.cwd as string });
        }
      });
    } else {
      exec(commandToExecute, execOptions as any, (error, stdout, stderr) => {
        const outStr = typeof stdout === 'string' ? stdout : String(stdout ?? '');
        const errStr = typeof stderr === 'string' ? stderr : String(stderr ?? '');
        executeCommandDebug(`Command executed with exec. stdout: ${outStr}, stderr: ${errStr}`);
        if (error) {
          executeCommandDebug(`Error during command execution with exec: ${error.message}`);
          reject({ stdout: outStr, stderr: errStr, presentWorkingDirectory: execOptions.cwd as string });
        } else {
          resolve({ stdout: outStr, stderr: errStr, presentWorkingDirectory: execOptions.cwd as string });
        }
      });
    }
  });
}

export default { executeCommand };
