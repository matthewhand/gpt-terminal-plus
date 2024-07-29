import { Client } from 'ssh2';

export async function deleteFile(sshClient: Client, remotePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    sshClient.exec('rm -f ' + remotePath, (err, stream) => {
      if (err) return reject(err);
      stream.on('close', () => {
        sshClient.end();
        resolve();
      }).stderr.on('data', (data) => {
        console.error('STDERR: ' + data);
        reject(new Error(data.toString()));
      });
    });
  });
}
