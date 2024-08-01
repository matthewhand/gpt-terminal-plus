import { LocalConfig } from '../../types/ServerConfig';

/**
 * LocalServerConfig interface for local server configuration.
 */
export interface LocalServerConfig extends LocalConfig {
  protocol: 'local';
  code: boolean;
}
