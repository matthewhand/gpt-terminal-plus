
import { PaginatedResponse } from './PaginatedResponse';
import { SystemInfo } from './SystemInfo';
import { ServerConfig } from './ServerConfig';
import { ExecutionResult } from './ExecutionResult';
import { FileReadResult } from './FileReadResult';

export interface ServerHandler {
  setServerConfig(serverConfig: ServerConfig): void;
  getSystemInfo(): Promise<SystemInfo>;
  changeDirectory(directory: string): Promise<boolean>;
  presentWorkingDirectory(): Promise<string>;
  executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult>;
  executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult>;
  createFile(filePath: string, content: string, backup: boolean): Promise<boolean>;
  readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult>;
  updateFile(filePath: string, pattern: string, replacement: string, options?: { backup?: boolean; multiline?: boolean }): Promise<boolean>;
  amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean>;
  listFiles(params: { directory?: string, limit?: number, offset?: number, orderBy?: 'datetime' | 'filename', recursive?: boolean, typeFilter?: 'files' | 'folders' }): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>>;
  listFilesWithDefaults(params: { directory?: string, limit?: number, offset?: number, orderBy?: 'datetime' | 'filename', recursive?: boolean, typeFilter?: 'files' | 'folders' }): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>>;
}
