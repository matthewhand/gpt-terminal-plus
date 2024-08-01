import { SshHostConfig } from '../../types/ServerConfig';

/**
 * SshServerConfig interface for SSH server configuration.
 */
export interface SshServerConfig extends Omit<SshHostConfig, 'port'> {
  protocol: 'ssh';
  username: string;
  privateKeyPath: string;
  port?: number;
}
