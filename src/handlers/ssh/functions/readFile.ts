import { Client } from 'ssh2';
import * as path from 'path';
import { getCurrentFolder } from '../../../utils/GlobalStateHelper';

export async function readFile(sshClient: Client, filePath: string): Promise<string> {
  const fullFilePath = path.isAbsolute(filePath) ? filePath : path.join(getCurrentFolder(), filePath);
  return new Promise((resolve, reject) => {
    let fileContent = '';
    sshClient.exec('cat ' + fullFilePath, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', (data) => {
        fileContent += data.toString();
      }).on('close', () => {
        sshClient.end();
        resolve(fileContent);
      }).stderr.on('data', (data) => {
        console.error('STDERR: ' + data);
        reject(new Error(data.toString()));
      });
    });
  });
}
