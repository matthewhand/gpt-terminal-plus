export interface SshHostConfig {
  hostname: string;
  port: number;
  privateKeyPath: string;
  protocol: string;
  username: string;
}
