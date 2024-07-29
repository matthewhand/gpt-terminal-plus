import { Client } from 'ssh2';
import Debug from 'debug';
import { ServerConfig } from '../../../types/index';

const debug = Debug('app:SimpleExecutionStrategy');

export class SimpleExecutionStrategy {
  async executeCommand(config: ServerConfig, client: Client, command: string, options: { cwd?: string, timeout?: number } = {}): Promise<{ stdout: string; stderr: string; timeout?: boolean }> {
    const { cwd, timeout = 60000 } = options;
    const escapedCommand = command.replace(/\/g, '\'); // Escaping backslashes
    const execCommand = cwd ? 'cd ' + cwd + ' && ' + escapedCommand : escapedCommand;

    debug('Executing simple command: ' + escapedCommand);
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
}

