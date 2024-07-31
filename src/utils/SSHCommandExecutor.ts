import { Client } from 'ssh2';
import { SshHostConfig } from '../../types/ServerConfig';  // Use SshHostConfig
import Debug from 'debug';

const debug = Debug('app:ssh-command-executor');

export async function executeCommand(client: Client, config: SshHostConfig, command: string, options: { cwd?: string, timeout?: number } = {}): Promise<{ stdout: string; stderr: string; timeout?: boolean }> {
  // Validate inputs
  if (!client || !(client instanceof Client)) {
    const errorMessage = 'SSH client must be provided and must be an instance of Client.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!config || typeof config !== 'object') {
    const errorMessage = 'SSH server configuration must be provided and must be an object.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!command || typeof command !== 'string') {
    const errorMessage = 'Command must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (options.cwd !== undefined && typeof options.cwd !== 'string') {
    const errorMessage = 'CWD must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (options.timeout !== undefined && typeof options.timeout !== 'number') {
    const errorMessage = 'Timeout must be a number.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  const { cwd, timeout = 60000 } = options;
  const escapedCommand = command.replace(/(["'`\\])/g, '\\$1');
  const execCommand = cwd ? 'cd ' + cwd + ' && ' + escapedCommand : escapedCommand;

  debug('Executing command: ' + escapedCommand);
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const execTimeout = setTimeout(() => {
      debug('Timeout reached for command: ' + escapedCommand);
      resolve({ stdout, stderr, timeout: true });
    }, timeout);

    client.exec(execCommand, (err, stream) => {
      if (err) {
        clearTimeout(execTimeout);
        debug('Execution error: ' + err.message);
        return reject(new Error('Execution error: ' + err.message));
      }

      stream.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      stream.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      stream.on('close', (code: number) => {
        clearTimeout(execTimeout);
        if (code === 0) {
          debug('Command executed successfully: ' + escapedCommand);
        } else {
          debug('Execution failed for command: ' + escapedCommand + ', Exit Code: ' + code);
        }
        resolve({ stdout, stderr, timeout: false });
      });
    });
  });
}
