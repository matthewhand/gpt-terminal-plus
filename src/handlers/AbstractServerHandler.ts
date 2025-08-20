import { ServerConfig } from '../types/ServerConfig';
import { ExecutionResult } from '../types/ExecutionResult';
import { PaginatedResponse } from '../types/PaginatedResponse';
import { SystemInfo } from '../types/SystemInfo';

export abstract class AbstractServerHandler {
  protected serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
  }

  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult>;
  abstract executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult>;
  abstract createFile(filePath: string, content?: string, backup?: boolean): Promise<boolean | ExecutionResult>;
  abstract getFileContent(filePath: string): Promise<string | ExecutionResult>;
  abstract getSystemInfo(): Promise<SystemInfo | ExecutionResult>;

  // Modify listFiles to accept an object parameter
  abstract listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: string }): Promise<PaginatedResponse<string>>;

  abstract setServerConfig(config: ServerConfig): void;
  abstract presentWorkingDirectory(): Promise<string>;
}
