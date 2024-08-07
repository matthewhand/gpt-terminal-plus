import { SsmTargetConfig } from '../../types/ServerConfig';

/**
 * SsmServerConfig interface for SSM server configuration.
 */
export interface SsmServerConfig extends SsmTargetConfig {
  protocol: 'ssm';
  instanceId: string;
  region: string;
}
