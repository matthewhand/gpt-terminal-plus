// Define the base configuration interface
interface BaseConfig {
  protocol: 'local' | 'ssh' | 'ssm';
  hostname: string; // Changed from 'host' to 'hostname'
  selected?: boolean;
}

// Define the local server configuration interface extending the base configuration
export interface LocalConfig extends BaseConfig {
  protocol: 'local';
  code: boolean;
}

// Define the SSH server configuration interface extending the base configuration
export interface SshHostConfig extends BaseConfig {
  protocol: 'ssh';
  port: number;
  username: string;
  privateKeyPath: string;
  shell?: string; // Optional shell property
}

// Define the SSM server configuration interface extending the base configuration
export interface SsmTargetConfig extends BaseConfig {
  protocol: 'ssm';
  instanceId: string;
  region: string;  // Add the required 'region' property
  shell?: string;  // Optional shell property
}

// Define the SSM configuration interface
export interface SsmConfig {
  region: string;
  targets: SsmTargetConfig[];
}

// Define the unified server configuration type
export type ServerConfig = LocalConfig | SshHostConfig | SsmTargetConfig;
