import { ServerConfig } from '../../types/ServerConfig';

export interface SsmServerConfig extends ServerConfig {
  protocol: 'ssm';
  instanceId: string;
  region: string;
}
