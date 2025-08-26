import { ServerConfig } from '../types/ServerConfig';
import { ExecutionResult } from '../types/ExecutionResult';
import { PaginatedResponse } from '../types/PaginatedResponse';
import { SystemInfo } from '../types/SystemInfo';
import { FileReadResult } from '../types/FileReadResult';
import { ListParams } from '../types/ListParams';

export abstract class AbstractServerHandler {
  protected serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
  }

  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult>;

  // Modify listFiles to accept an object parameter
  abstract listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: 'datetime' | 'filename' }): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>>;

  abstract setServerConfig(config: ServerConfig): void;

  abstract presentWorkingDirectory(): Promise<string>;

  abstract changeDirectory(directory: string): Promise<boolean>;
}