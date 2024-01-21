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

// Updated ServerConfig interface to include all possible properties
export interface ServerConfig {
  host: string;                // Dynamically extracted from connectionString
  privateKeyPath?: string;     // If not the default ~/.ssh/id_rsa or similar
  keyPath?: string;            // Path to the SSH key file
  posix?: boolean;             // Indicates if the server is POSIX-compliant
  systemInfo?: 'python';       // Indicates if additional remote information should be fetched and how
  port?: number;               // e.g. If not TCP/22 when using SSH
  code?: boolean;              // Whether to use code cmd when using files operations
  username?: string;           // Dynamically extracted from connectionString
  protocol?: 'ssh' | 'ssm';    // Supported protocols
  shell?: string;              // 'powershell' | null
  region?: string;             // e.g. us-east-2
  instanceId?: string;         // for SSM
}

export interface ServerHandlerInterface {
  setCurrentDirectory(directory: string): boolean;
  executeCommand(command: string, timeout?: number): Promise<{ stdout: string; stderr: string }>;
  createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  amendFile(filePath: string, content: string): Promise<boolean>;
  getSystemInfo(): Promise<SystemInfo>;
  // fileExists(filePath: string): boolean;
  listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<string[]>;
}

// Define an interface for the AppConfig that now includes all the properties
export interface AppConfig {
  serverConfig: ServerConfig[]; // Reflects the new structure with an array of ServerConfig
  commandTimeout: number;      // Time in milliseconds for command execution timeout
  maxResponse: number;         // Maximum size of the response
  port: number;                // Port number for the application to listen on
}

export interface ResponsePage {
  stdout: string;
  stderr: string;
  totalPages: number;
}

export interface PaginatedResponse {
  stdout: string[];
  stderr: string[];
  timestamp: number; // Timestamp for cleanup purposes
}
