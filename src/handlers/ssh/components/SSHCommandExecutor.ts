import { Client, ConnectConfig } from 'ssh2';
import debug from 'debug';

const log = debug('ssh-command-executor');

export class SSHCommandExecutor {
  private client: Client;
  private timeout: number;

  constructor(timeout: number = 10000) {
    this.client = new Client();
    this.timeout = timeout;
  }

  /**
   * Connects to an SSH server and executes a command with a timeout.
   * @param {ConnectConfig} config - The connection configuration.
   * @param {string} command - The command to execute.
   * @returns {Promise<{ stdout: string; stderr: string }>} - The result of the command execution.
   */
  public execute(config: ConnectConfig, command: string): Promise<{ stdout: string; stderr: string }> {
    log('Connecting to SSH server with config: ', config);

    return new Promise((resolve, reject) => {
      const onReady = () => {
        log('SSH connection ready. Executing command: ' + command);

        this.client.exec(command, (err, stream) => {
          if (err) {
            reject(err);
            return;
          }

          let stdout = '';
          let stderr = '';

          stream
            .on('close', (code: number, signal: string) => {
              log('Command executed. Exit code: ' + code + ', Signal: ' + signal);
              this.client.end();
              resolve({ stdout, stderr });
            })
            .on('data', (data: Buffer) => {
              stdout += data.toString();
            })
            .stderr.on('data', (data: Buffer) => {
              stderr += data.toString();
            });

          // Implementing timeout logic
          setTimeout(() => {
            stream.close();
            log('Command execution timed out after ' + this.timeout + 'ms');
            resolve({ stdout, stderr: stderr + '\nExecution timed out.' });
          }, this.timeout);
        });
      };

      const onError = (err: Error) => {
        log('SSH connection error: ', err);
        reject(err);
      };

      this.client.on('ready', onReady).on('error', onError).connect(config);
    });
  }
}
