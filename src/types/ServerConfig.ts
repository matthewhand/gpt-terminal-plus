export interface ServerConfig {
  host: string;
  username: string;
  privateKeyPath: string;
  instanceId?: string;
  type: 'local' | 'ssh' | 'ssm'; // Ensure type is included
  protocol?: string; // Add this line
}
