import { ServerConfig } from '../types/ServerConfig.js';
import { ExecutionResult } from '../types/ExecutionResult.js';
import { PaginatedResponse } from '../types/PaginatedResponse.js';
import { SearchResult, SearchParams } from '../types/ServerHandler.js';

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

  abstract searchFiles(params: SearchParams): Promise<PaginatedResponse<SearchResult>>;
}
