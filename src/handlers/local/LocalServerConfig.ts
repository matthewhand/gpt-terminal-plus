import { ServerConfig } from '../../types/ServerConfig';

export interface LocalServerConfig extends ServerConfig {
  protocol: 'local';
  code: string;
}
