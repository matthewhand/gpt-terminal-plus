import { executeLocalCode } from './actions/executeCode';
import { createFile as createLocalFile } from './actions/createFile';
import { AbstractServerHandler } from '../AbstractServerHandler';
import { LocalServerConfig, ServerConfig } from '../../types/ServerConfig';
import { SystemInfo } from '../../types/SystemInfo';
import { ExecutionResult } from '../../types/ExecutionResult';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import listFilesAction from './actions/listFiles';
import { ListParams } from '../../types/ListParams';
import { exec } from 'child_process';
import { getPresentWorkingDirectory } from '../../utils/GlobalStateHelper';
import Debug from 'debug';

const localServerDebug = Debug('app:LocalServerHandler');

export class LocalServerHandler extends AbstractServerHandler {
  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    return await executeCommandAction(command, timeout, directory || this.serverConfig.directory || process.cwd());
  }

  async executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    return await executeCodeAction(code, language, timeout, directory || this.serverConfig.directory || process.cwd());
  }

  async createFile(filePath: string, content?: string, backup: boolean = true): Promise<boolean> {
    return await createFileAction(filePath, content || '', backup, this.serverConfig.directory);
  }

  async readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult> {
    return await readFileAction(filePath, this.serverConfig.directory, options);
  }

    /**
     * Lists files in a specified directory.
     */
    async listFiles(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
        const { directory = '.', limit = 50, offset = 0, orderBy } = params;
        localServerDebug(`Listing files in directory: ${directory} with limit: ${limit}, offset: ${offset}`);
        try {
            const { files, total } = await listFilesAction({ directory, limit, offset, orderBy });
            return {
                items: files,
                total,
                limit,
                offset,
            };
        } catch (error) {
            localServerDebug('Error listing files:', error);
            throw new Error('Failed to list files: ' + (error as Error).message);
        }
    }

  async amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean> {
    return await amendFileAction(filePath, content, options?.backup, this.serverConfig.directory);
  }

  async listFiles(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
    // Note: directory defaults are now handled by AbstractServerHandler.listFilesWithDefaults()
    const raw = await listFilesAction(params as any);
    return {
      items: raw.files,
      total: raw.total,
      limit: params.limit ?? raw.files.length,
      offset: params.offset ?? 0,
    };
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return await getSystemInfoAction();
  }

  setServerConfig(config: ServerConfig): void {
    this.serverConfig = config;
  }

  async presentWorkingDirectory(): Promise<string> {
    return await presentWorkingDirectoryAction();
  }

  async changeDirectory(directory: string): Promise<boolean> {
    const success = await changeDirectoryAction(directory, this.serverConfig.directory);
    if (success) {
      this.serverConfig.directory = directory;
    }
    return success;
  }
}