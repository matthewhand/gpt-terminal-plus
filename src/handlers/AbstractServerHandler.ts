
import { ServerConfig } from '../types/ServerConfig';
import { ExecutionResult } from '../types/ExecutionResult';
import { PaginatedResponse } from '../types/PaginatedResponse';
import { SystemInfo } from '../types/SystemInfo';
import { FileReadResult } from '../types/FileReadResult';

export abstract class AbstractServerHandler {
  protected serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
  }

  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult>;

  abstract executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult>;

  abstract createFile(filePath: string, content?: string, backup?: boolean): Promise<boolean | ExecutionResult>;

  abstract readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult>;

  abstract updateFile(filePath: string, pattern: string, replacement: string, options?: { backup?: boolean; multiline?: boolean }): Promise<boolean | ExecutionResult>;

  abstract amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean | ExecutionResult>;

  abstract getSystemInfo(): Promise<SystemInfo | ExecutionResult>;

  abstract listFiles(params: { directory?: string; limit?: number; offset?: number; orderBy?: string; recursive?: boolean; typeFilter?: 'files' | 'folders' }): Promise<PaginatedResponse<string>>;

  abstract setServerConfig(config: ServerConfig): void;

  abstract presentWorkingDirectory(): Promise<string>;

  abstract changeDirectory(directory: string): Promise<boolean>;
}
