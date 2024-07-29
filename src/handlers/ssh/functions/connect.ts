import { Client } from 'ssh2';
import Debug from 'debug';
import fs from 'fs/promises';
import { ServerConfig } from '../../../types/index';

const debug = Debug('app:SshServerHandler');
export async function connect(conn: Client, ServerConfig: ServerConfig) {
  try {
    const privateKeyPath = ServerConfig.privateKeyPath ?? 'path/to/default/privateKey';
    const privateKey = await fs.readFile(privateKeyPath);
    debug('Connecting to ' + ServerConfig.host + ' with username ' + ServerConfig.username);
    conn.connect({
      host: ServerConfig.host,
      port: ServerConfig.port || 22,
      username: ServerConfig.username,
      privateKey: privateKey.toString(),
    });
  } catch (error) {
    if (error instanceof Error) {
      debug('Error connecting to SSH server: ' + error.message);
    } else {
      debug('Error connecting to SSH server: ' + JSON.stringify(error));
    }
  }
}

