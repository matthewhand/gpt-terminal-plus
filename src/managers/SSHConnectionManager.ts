import { SshHostConfig } from '../types/ServerConfig'; // Corrected import path
import Debug from 'debug';

type ConnectConfig = {
  host: string;
  port?: number;
  username?: string;
  privateKey?: Buffer | string | undefined;
};

const debug = Debug('app:ssh-connection-manager');

export class SSHConnectionManager {
  private client: any;

  constructor() {
     
    const { Client: SSHClient } = require('ssh2');
    this.client = new SSHClient();
  }

  /**
   * Connects to an SSH server using the provided configuration.
   * @param config - The SSH server configuration.
   * @returns A promise that resolves when the connection is established.
   */
  connect(config: SshHostConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const connectionConfig: ConnectConfig = {
        host: config.hostname,
        port: config.port ?? 22,  // Default to 22 if port is not provided
        username: config.username,
        privateKey: require('fs').readFileSync(config.privateKeyPath)
      };

      this.client.on('ready', () => {
        debug('SSH connection established');
        resolve();
      }).on('error', (err: Error) => {
        debug('SSH connection error: ' + err.message);
        reject(err);
      }).connect(connectionConfig);
    });
  }

  /**
   * Executes a command on the SSH server.
   * @param command - The command to execute.
   * @returns A promise that resolves with the command's output.
   */
  executeCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      this.client.exec(command, (err: Error | null, stream: any) => {
        if (err) {
          debug('Command execution error: ' + err.message);
          return reject(err);
        }

        let stdout = '';
        let stderr = '';

        // Attach listeners separately to avoid chaining onto stderr,
        // which prevented the 'close' handler from registering on the main stream.
        stream.on('data', (data: Buffer) => {
          stdout += data.toString();
        });
        if (stream.stderr && typeof stream.stderr.on === 'function') {
          stream.stderr.on('data', (data: Buffer) => {
            stderr += data.toString();
          });
        }
        stream.on('close', (code: number) => {
          if (code === 0) {
            resolve({ stdout, stderr });
          } else {
            reject(new Error(`Command failed with exit code ${code}`));
          }
        });
      });
    });
  }

  /**
   * Disconnects from the SSH server.
   */
  disconnect(): void {
    this.client.end();
    debug('SSH connection closed');
  }
}
