import { Client } from 'ssh2';

export async function fileExists(sshClient: Client, remotePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    sshClient.exec('test -f ' + remotePath + ' && echo "exists"', (err, stream) => {
      if (err) return reject(err);
      stream.on('data', (data) => {
        resolve(data.toString().trim() === 'exists');
      }).on('close', () => {
        sshClient.end();
      }).stderr.on('data', (data) => {
        console.error('STDERR: ' + data);
        reject(new Error(data.toString()));
      });
    });
  });
}
