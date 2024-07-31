import { ServerConfig } from '../../types/ServerConfig';

export interface SsmServerConfig extends ServerConfig {
  region?: string;
  instanceId?: string;
}
