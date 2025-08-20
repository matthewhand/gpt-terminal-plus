import { PaginatedResponse } from './PaginatedResponse';
import { SystemInfo } from './SystemInfo';
import { ServerConfig } from './ServerConfig';
import { ExecutionResult } from './ExecutionResult';

export interface ServerHandler {
  setServerConfig(serverConfig: ServerConfig): void;
  getSystemInfo(): Promise<SystemInfo>;
  changeDirectory(directory: string): Promise<boolean>;
  presentWorkingDirectory(): Promise<string>;
  executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult>;
  executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult>;
  createFile(filePath: string, content: string, backup: boolean): Promise<boolean>;
  updateFile(filePath: string, pattern: string, replacement: string, multiline: boolean): Promise<boolean>;
  amendFile(filePath: string, content: string, backup: boolean): Promise<boolean>;
  listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'datetime' | 'filename' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>>;
}
