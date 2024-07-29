import { Client } from 'ssh2';
import Debug from 'debug';
import SSHCommandExecutor from '../components/SSHCommandExecutor';
import SSHFileOperations from '../components/SSHFileOperations';
import SSHSystemInfoRetriever from '../components/SSHSystemInfoRetriever';
import { ServerConfig } from '../../../types/index';

const debug = Debug('app:SshServerHandler');
export async function initializeSSHClient(conn: Client, ServerConfig: ServerConfig) {
  debug('Initializing SSH client for ' + ServerConfig.host);
  conn.on('ready', () => {
    debug('SSH Connection is ready.');
    new SSHCommandExecutor(conn, ServerConfig);
    new SSHFileOperations(conn, ServerConfig);
    new SSHSystemInfoRetriever(conn, ServerConfig);
  }).on('error', (err) => {
    if (err instanceof Error) {
      debug('SSH Connection error: ' + err.message);
    } else {
      debug('SSH Connection error: ' + JSON.stringify(err));
    }
  }).on('end', () => {
    debug('SSH Connection has ended.');
  });
}

