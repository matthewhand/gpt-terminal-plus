import { exec } from 'child_process';
import { promisify } from 'util';
import Debug from 'debug';
import { presentWorkingDirectory } from '../../../utils/GlobalStateHelper';

const execAsync = promisify(exec);
const debug = Debug('app:executeCommand');

// Get shell path from environment variable or fallback to default /bin/sh
const defaultShellPath = process.env.SHELL_PATH || '/bin/sh';

/**
 * Executes a command on the local server.
 * @param command - The command to execute.
 * @param timeout - Optional timeout for the command execution.
 * @param directory - Optional directory to execute the command in.
 * @param shell - Optional shell to use for command execution.
 * @returns The command's stdout and stderr output.
 */
export async function executeCommand(
  command: string,
  timeout: number = 5000,
  directory?: string,
  shell: string = defaultShellPath
): Promise<{ stdout: string; stderr: string }> {
  // Validate inputs
  if (!command || typeof command !== 'string') {
    const errorMessage = 'Command must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (timeout !== undefined && typeof timeout !== 'number') {
    const errorMessage = 'Timeout must be a number.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (directory !== undefined && typeof directory !== 'string') {
    const errorMessage = 'Directory must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (shell !== undefined && typeof shell !== 'string') {
    const errorMessage = 'Shell must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  const execOptions = {
    timeout,
    cwd: directory || presentWorkingDirectory(), // Use GlobalStateHelper for current directory
    shell: shell
  };

  debug('Executing command: ' + command + ' with options: ' + JSON.stringify(execOptions));
  try {
    const { stdout, stderr } = await execAsync(command, execOptions);
    debug('Command stdout: ' + stdout);
    debug('Command stderr: ' + stderr);
    return { stdout, stderr };
  } catch (error) {
    const errorMessage = 'Error executing command: ' + (error instanceof Error ? error.message : String(error));
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
