import { Client } from 'ssh2';
import Debug from 'debug';
import { v4 as uuidv4 } from 'uuid';
import SFTPClient from 'ssh2-sftp-client';
import { getPrivateKey } from './getPrivateKey';
import { ServerConfig } from '../../../types/index';

const debug = Debug('app:AdvancedExecutionStrategy');

export class AdvancedExecutionStrategy {
  async executeCommand(config: ServerConfig, client: Client, command: string, options: { cwd?: string, timeout?: number, filePath?: string, fileContent?: string } = {}): Promise<{ stdout: string; stderr: string; timeout?: boolean }> {
    const { cwd, timeout = 60000, filePath, fileContent } = options;
    const uniqueId = uuidv4();
    const logPath = '/tmp/' + uniqueId + '.log';
    const screenSessionName = 'session_' + uniqueId;
    const escapedCommand = command.replace(/\/g, '\'); // Escaping backslashes
    const execCommand = cwd ? 'cd ' + cwd + ' && ' : '';
    const screenCommand = execCommand + 'screen -dmSL ' + screenSessionName + ' bash -c \' + escapedCommand + ' > ' + logPath + ' 2>&1\'';

    if (filePath && fileContent) {
      const sftp = new SFTPClient();
      try {
        await sftp.connect({
          host: config.host,
          port: config.port ?? 22,
          username: config.username,
          privateKey: await getPrivateKey(config),
        });
        debug('Connected to SFTP server. Uploading file to: ' + filePath);
        await sftp.put(Buffer.from(fileContent), filePath);
        debug('File uploaded successfully.');
      } catch (error) {
        debug('Error during SFTP operation: ' + error);
        throw new Error('SFTP operation failed: ' + error);
      } finally {
        await sftp.end();
        debug('SFTP session ended.');
      }
    }

    debug('Executing command in screen session: ' + escapedCommand);
    return new Promise((resolve, reject) => {
      client.exec(screenCommand, (err, stream) => {
        if (err) {
          debug('Execution error: ' + err.message);
          return reject(new Error('Execution error: ' + err.message));
        }

        stream.on('close', (code: number) => {
          if (code === 0) {
            debug('Command executed successfully in screen session: ' + screenSessionName);
          } else {
            debug('Execution failed for command in screen session: ' + screenSessionName + ', Exit Code: ' + code);
          }
          resolve({ stdout: 'Command executed in screen session. Log file: ' + logPath, stderr: '', timeout: false });
        });
      });
    });
  }
}

