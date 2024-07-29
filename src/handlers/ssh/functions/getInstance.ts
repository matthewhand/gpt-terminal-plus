import { Client } from 'ssh2';
import { ServerConfig } from '../../../types/ServerConfig';
import { initializeSSHClient } from './initializeSSHClient';

export async function getInstance(ServerConfig: ServerConfig): Promise<Client> {
  const conn = new Client();
  await initializeSSHClient(conn, ServerConfig);
  return conn;
}
