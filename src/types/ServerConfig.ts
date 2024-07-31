export interface ServerConfig {
  protocol: 'ssh' | 'ssm' | 'local';
  host: string;
  systemInfo?: 'local' | 'python' | 'powershell' | 'auto'; // TODO: Review 'auto'
  shell?: string;
  defaultDirectory?: string;  // New property for default directory
  username?: string;          // Add username
  privateKeyPath?: string;    // Add privateKeyPath
  port?: number;              // Add port
  instanceId?: string;        // Add instanceId for SSM
  region?: string;            // Add region for SSM
}
