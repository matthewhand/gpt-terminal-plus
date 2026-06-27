
import { PaginatedResponse } from './PaginatedResponse.js';
import { SystemInfo } from './SystemInfo.js';
import { ServerConfig } from './ServerConfig.js';
import { ExecutionResult } from './ExecutionResult.js';
import { FileReadResult } from './FileReadResult.js';
import { ListParams } from './ListParams.js';

export interface SearchResult {
  filePath: string;
  lineNumber: number;
  content: string;
}

export interface SearchParams {
  pattern: string;
  path: string;
  caseSensitive?: boolean;
  limit?: number;
  offset?: number;
}

export interface ServerHandler {
  setServerConfig(serverConfig: ServerConfig): void;
  getSystemInfo(): Promise<SystemInfo>;
  changeDirectory(directory: string): Promise<boolean>;
  presentWorkingDirectory(): Promise<string>;
  executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult>;
  executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult>;
  executeFile(filename: string, directory?: string, timeout?: number): Promise<ExecutionResult>;
  createFile(filePath: string, content: string, backup: boolean): Promise<boolean>;
  readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult>;
  updateFile(filePath: string, pattern: string, replacement: string, options?: { backup?: boolean; multiline?: boolean }): Promise<boolean>;
  amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean>;
  listFiles(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>>;
  listFilesWithDefaults(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>>;
  searchFiles(params: SearchParams): Promise<PaginatedResponse<SearchResult>>;
}
