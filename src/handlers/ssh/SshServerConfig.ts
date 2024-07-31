import { ServerConfig } from '../../types/ServerConfig';

export interface SshServerConfig extends ServerConfig {
  privateKeyPath?: string;
  port?: number;
}
