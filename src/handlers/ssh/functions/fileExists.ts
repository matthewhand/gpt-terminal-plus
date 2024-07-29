import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';

export async function fileExists(client: Client, config: ServerConfig, filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    client.exec(`test -f ${filePath} && echo "exists"`, (err, stream) => {
      if (err) return reject(err);
      let data: string = '';
      stream.on('data', chunk => {
        data += chunk;
      });
      stream.on('end', () => {
        resolve(data.trim() === 'exists');
      });
    });
  });
}
