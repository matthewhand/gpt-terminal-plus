export interface ServerConfig {
  directory?: string;
    hostname: string;
    protocol: 'local' | 'ssh' | 'ssm';
    code?: boolean;
    'post-command'?: string;
    llm?: {
        provider?: 'ollama' | 'lmstudio' | 'openai';
        baseUrl?: string;
        apiKey?: string;
        modelMap?: Record<string, string>;
    };
}

export interface LocalServerConfig extends ServerConfig {
    protocol: 'local';
    code: boolean; // Required for local servers
    'post-command'?: string;
}

export interface SshHostConfig extends ServerConfig {
    protocol: 'ssh';
    port: number;
    username: string;
    privateKeyPath: string;
}

export interface SsmTargetConfig extends ServerConfig {
    protocol: 'ssm';
    instanceId: string;
    region: string;
}
