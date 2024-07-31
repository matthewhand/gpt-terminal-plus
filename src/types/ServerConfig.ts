export interface ServerConfig {
  host: string;
  username?: string;
  protocol?: 'ssh' | 'ssm' | 'local';
  posix?: boolean;
  cleanupScripts?: boolean;
  privateKeyPath?: string;
  port?: number;
  region?: string;
  instanceId?: string;
  systemInfo?: 'local' | 'python' | 'powershell' | 'auto';
  shell?: string;
}
