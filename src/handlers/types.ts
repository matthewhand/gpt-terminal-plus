export interface SystemInfo {
    homeFolder: string;
    type: string;
    release: string;
    platform: string;
    pythonVersion: string;
    cpuArchitecture: string;
    totalMemory: number;
    freeMemory: number;
    uptime: number;
    currentFolder: string;
  }
  
export interface ServerConfig {
  connectionString: string; // Includes both the username and the host
  privateKeyPath?: string;  // If not the default ~/.ssh/id_rsa or similar
  keyPath?: string;         // Path to the SSH key file
  posix?: boolean;          // Indicates if the server is POSIX-compliant
  remoteInfo?: boolean;     // Indicates if additional remote information should be fetched
  port?: number;            // If not TCP/22
  username?: string;        // Extracted from connectionString
  host?: string;            // Extracted from connectionString
}

export interface ServerHandlerInterface {
  setCurrentDirectory(directory: string): boolean;
  executeCommand(command: string, timeout?: number): Promise<{ stdout: string; stderr: string }>;
  createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  amendFile(filePath: string, content: string): Promise<boolean>;
  getSystemInfo(): Promise<SystemInfo>;
  fileExists(filePath: string): boolean;
}
