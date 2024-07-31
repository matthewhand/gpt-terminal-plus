import { ServerConfig } from '../../types/ServerConfig';

export interface SshServerConfig extends ServerConfig {
  protocol: 'ssh';
  username: string;
  privateKeyPath: string;
  port?: number;
}
