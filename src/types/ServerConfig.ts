import { SSMClient } from '@aws-sdk/client-ssm';

export interface ServerConfig {
  cleanupScripts?: boolean;
  host: string;
  privateKeyPath?: string;
  keyPath?: string;
  posix?: boolean;
  systemInfo?: 'python';
  port?: number;
  code?: boolean;
  username?: string;
  protocol?: 'ssh' | 'ssm' | 'local';
  shell?: string;
  region?: string;
  instanceId?: string;
  homeFolder?: string;
  containerId?: number;
  tasks?: string[];
  scriptFolder?: string;
  defaultFolder?: string;
  ssmClient?: SSMClient;
}

export interface SystemInfo {
    os: string;
    version: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalPages: number;
    responseId: string;
    stdout: string;
    stderr: string;
}

export interface ServerHandlerInterface {
    executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;
    createFile(directory: string, filename: string, content: string, backup?: boolean): Promise<boolean>;
    amendFile(filePath: string, content: string): Promise<boolean>;
    listFiles(directory?: string, limit?: number, offset?: number, orderBy?: string): Promise<PaginatedResponse<string>>;
    updateFile(filePath: string, pattern: string, replacement: string, backup?: boolean): Promise<boolean>;
    getSystemInfo(): Promise<SystemInfo>;
    determineScriptExtension(shell: string): string;
    createTempScript(scriptContent: string, scriptExtension: string, directory: string): Promise<string>;
}
