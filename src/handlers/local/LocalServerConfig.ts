import { ServerConfig } from '../../types/ServerConfig';

export interface LocalServerConfig extends ServerConfig {
  systemInfo?: 'local' | 'python' | 'powershell' | 'auto';
  shell?: string;
}
