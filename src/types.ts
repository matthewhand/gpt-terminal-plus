export interface SystemInfo {
  homeFolder: string;
  type: string;
  release: string;
  platform: string;
  architecture: string;
  totalMemory: number;
  freeMemory: number;
  uptime: number;
  currentFolder: string;
  pythonVersion?: string;
  powershellVersion?: string;
  cpuModel?: string;
}

export interface ServerConfig {
  host: string;
  privateKeyPath?: string;
  keyPath?: string;
  posix?: boolean;
  systemInfo?: 'python' | 'bash';
  port?: number;
  code?: boolean;
  username?: string;
  protocol?: 'ssh' | 'ssm' | 'local' | 'localhost'; // TODO choose one
  shell?: 'bash' | 'powershell' | null;
  region?: string;
  instanceId?: string;
  homeFolder?: string;
  cleanupScripts?: boolean;
  // New flags for execution strategy control
  useAdvancedExecution?: boolean; // Determines if advanced execution strategy should be used
  useScreen?: boolean;             // Use 'screen' for command execution
  useSftpTransfer?: boolean;       // Transfer command scripts via SFTP
}

export interface ServerHandlerInterface {
  identifier: string;
  getServerConfig(): ServerConfig;
  executeCommand(command: string, timeout?: number): Promise<{ stdout: string; stderr: string }>;
  getSystemInfo(): Promise<SystemInfo>;
  setCurrentDirectory(directory: string): boolean;
  getCurrentDirectory(): Promise<string>;
  listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<string[]>;
  createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  amendFile(filePath: string, content: string): Promise<boolean>;
}

export interface AppConfig {
  serverConfig: ServerConfig[];
  commandTimeout: number;
  maxResponse: number;
  port: number;
}

export interface ResponsePage {
  stdout: string;
  stderr: string;
  totalPages: number;
}

export interface PaginatedResponse {
  stdout: string[];
  stderr: string[];
  timestamp: number;
}
