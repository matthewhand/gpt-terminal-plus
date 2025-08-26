import Debug from 'debug';
import { AbstractServerHandler } from '../AbstractServerHandler';
import { ServerConfig } from '../../types/ServerConfig';
import { SystemInfo } from '../../types/SystemInfo';
import { ExecutionResult } from '../../types/ExecutionResult';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { ListParams } from '../../types/ListParams';
import { FileReadResult } from '../../types/FileReadResult';

import { executeCommand as executeCommandAction } from './actions/executeCommand';
import { executeLocalCode as executeCodeAction } from './actions/executeCode';
import { createFile as createFileAction } from './actions/createFile.local';
import { readFile as readFileAction } from './actions/readFile.local';
import { amendFile as amendFileAction } from './actions/amendFile.local';
import listFilesAction from './actions/listFiles.local';
import { getSystemInfo as getSystemInfoAction } from './actions/getSystemInfo';
import { presentWorkingDirectory as presentWorkingDirectoryAction } from './actions/presentWorkingDirectory';
import { changeDirectory as changeDirectoryAction } from './actions/changeDirectory.local';

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

  async createFile(filePath: string, content: string = '', backup: boolean = true): Promise<boolean> {
    return await createFileAction(filePath, content, backup, this.serverConfig.directory);
  }

  async readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult> {
    return await readFileAction(filePath, this.serverConfig.directory, options);
  }

  async amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean> {
    return await amendFileAction(filePath, content, options?.backup, this.serverConfig.directory);
  }

  async listFiles(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
    const { files, total } = await listFilesAction(params);
    return {
      items: files,
      total,
      limit: params.limit ?? files.length,
      offset: params.offset ?? 0,
    };
  }

  async listFilesWithDefaults(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
    const directory = params.directory && String(params.directory).trim() !== '' ? String(params.directory) : '.';
    const limit = typeof params.limit === 'number' && params.limit > 0 ? params.limit : 100;
    const offset = typeof params.offset === 'number' && params.offset >= 0 ? params.offset : 0;
    const orderBy = params.orderBy === 'datetime' ? 'datetime' as const : 'filename' as const;
    return this.listFiles({ directory, limit, offset, orderBy });
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
    const success = await changeDirectoryAction(directory, this.serverConfig.directory || process.cwd());
    if (success) {
      this.serverConfig.directory = directory;
    }
    return success;
  }
}
