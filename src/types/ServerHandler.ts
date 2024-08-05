import { PaginatedResponse } from './PaginatedResponse';
import { SystemInfo } from './SystemInfo';
import { ServerConfig } from './ServerConfig';

export interface ServerHandler {
  changeDirectory(directory: string): Promise<boolean>;
  createFile(filePath: string, content: string, backup: boolean): Promise<boolean>;
  updateFile(filePath: string, pattern: string, replacement: string, multiline: boolean): Promise<boolean>;
  amendFile(filePath: string, content: string, backup: boolean): Promise<boolean>;
  listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'datetime' | 'filename' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>>;
  presentWorkingDirectory(): Promise<string>;
  getSystemInfo(): Promise<SystemInfo>;
  executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;
  setServerConfig(serverConfig: ServerConfig): void;
}
