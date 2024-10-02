// Configuration for local server
export interface LocalServerConfig {
  code: boolean;
  protocol: 'local';
  hostname?: string;
  // Add other properties if necessary
}

// Configuration for SSH hosts
export interface SshHostConfig {
  hostname: string;
  port: number;
  username: string;
  privateKeyPath: string;
  protocol?: 'ssh';
  // Other SSH-specific properties
}

// Configuration for SSM targets
export interface SsmTargetConfig {
  instanceId: string;
  region: string;
  hostname?: string;
  protocol?: 'ssm';
  // Other SSM-specific properties
}

// Unified configuration type that encompasses all server types
export type ServerConfig = LocalServerConfig | SshHostConfig | SsmTargetConfig;
