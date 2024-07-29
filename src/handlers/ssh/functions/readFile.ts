import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';

export async function readFile(client: Client, config: ServerConfig, filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.exec(`cat ${filePath}`, (err, stream) => {
      if (err) return reject(err);
      let data: string = '';
      stream.on('data', (chunk: any) => {
        data += chunk;
      });
      stream.on('end', () => {
        resolve(data);
      });
    });
  });
}
