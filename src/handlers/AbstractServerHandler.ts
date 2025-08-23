
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

  abstract executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult>;

  abstract createFile(filePath: string, content?: string, backup?: boolean): Promise<boolean | ExecutionResult>;

  abstract readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult>;

  abstract updateFile(filePath: string, pattern: string, replacement: string, options?: { backup?: boolean; multiline?: boolean }): Promise<boolean | ExecutionResult>;

  abstract amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean | ExecutionResult>;

  abstract getSystemInfo(): Promise<SystemInfo | ExecutionResult>;

  abstract listFiles(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>>;

  /**
   * List files with standardized default directory handling and parameter validation.
   * This method ensures consistent behavior across all handler implementations.
   */
  async listFilesWithDefaults(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
    // Validate orderBy parameter
    const validOrderByValues = ['filename', 'datetime'] as const;
    const orderBy = params.orderBy || 'filename';
    if (!validOrderByValues.includes(orderBy as any)) {
      throw new Error(`Invalid orderBy value: ${orderBy}. Must be one of: ${validOrderByValues.join(', ')}`);
    }

    // Validate typeFilter parameter
    const validTypeFilterValues = ['files', 'folders'] as const;
    const typeFilter = params.typeFilter;
    if (typeFilter && !validTypeFilterValues.includes(typeFilter as any)) {
      throw new Error(`Invalid typeFilter value: ${typeFilter}. Must be one of: ${validTypeFilterValues.join(', ')}`);
    }

    const normalizedParams = {
      ...params,
      directory: params.directory || '.',
      // Clamp limit between 1 and 5000
      limit: Math.min(Math.max(params.limit || 100, 1), 5000),
      // Clamp offset to non-negative values
      offset: Math.max(params.offset || 0, 0),
      orderBy: orderBy as 'filename' | 'datetime',
      typeFilter: typeFilter as 'files' | 'folders' | undefined
    };
    return this.listFiles(normalizedParams);
  }

  abstract setServerConfig(config: ServerConfig): void;

  abstract presentWorkingDirectory(): Promise<string>;

  abstract changeDirectory(directory: string): Promise<boolean>;
}
