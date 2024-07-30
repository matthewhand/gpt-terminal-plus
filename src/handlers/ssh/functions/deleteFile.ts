import { Client } from 'ssh2';
import Debug from 'debug';

const debug = Debug('app:deleteFile');

/**
 * Deletes a file from the remote server.
 * @param {Client} sshClient - The SSH client instance.
 * @param {string} remotePath - The remote path of the file to delete.
 * @returns {Promise<void>} A promise that resolves when the file is deleted.
 */
export async function deleteFile(sshClient: Client, remotePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!remotePath) {
      const errorMessage = 'Remote path is required to delete a file.';
      debug(errorMessage);
      return reject(new Error(errorMessage));
    }

    const command = `rm -f ${remotePath}`;
    debug(`Executing command: ${command}`);

    sshClient.exec(command, (err, stream) => {
      if (err) {
        debug(`Error executing command: ${err.message}`);
        return reject(err);
      }

      stream.on('close', (code, signal) => {
        if (code === 0) {
          debug(`Command executed successfully: ${command}`);
          sshClient.end();
          resolve();
        } else {
          const error = `Command failed with code ${code}, signal ${signal}`;
          debug(error);
          reject(new Error(error));
        }
      }).stderr.on('data', (data) => {
        const error = `STDERR: ${data.toString()}`;
        debug(error);
        reject(new Error(error));
      });
    });
  });
}
