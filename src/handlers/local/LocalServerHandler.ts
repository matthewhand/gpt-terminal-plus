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
import { updateFile as updateFileAction } from './actions/updateFile.local';
import fs from 'fs/promises';
import path from 'path';
import { getPresentWorkingDirectory } from '../../utils/GlobalStateHelper';
import { exec as _exec } from 'child_process';
import { getSystemInfo as getSystemInfoAction } from './actions/getSystemInfo';
import { presentWorkingDirectory as presentWorkingDirectoryAction } from './actions/presentWorkingDirectory';
import { changeDirectory as changeDirectoryAction } from './actions/changeDirectory.local';

export class LocalServerHandler extends AbstractServerHandler {
  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    const cwd = directory || getPresentWorkingDirectory() || this.serverConfig.directory || process.cwd();
    // Execute via local shell to capture proper exit codes
    return await (executeCommandAction as any)(command, typeof timeout === 'number' ? timeout : 0, cwd, '/bin/bash');
  }

  async executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    if (!code || !language) {
      throw new Error('Code and language are required for execution.');
    }
    const effectiveTimeout = typeof timeout === 'number' ? timeout : 5000;
    const cwd = directory || this.serverConfig.directory || '/tmp';
    return await executeCodeAction(code, language, effectiveTimeout, cwd);
  }

  async createFile(filePath: string, content: string = '', backup: boolean = true): Promise<boolean> {
    const ok = await createFileAction(filePath, content, backup, this.serverConfig.directory);
    const post = (this.serverConfig as any)['post-command'];
    if (ok && post && typeof post === 'string' && post.trim() !== '') {
      try {
        const execAny = _exec as unknown as (...args: any[]) => any;
        execAny(`${post} ${filePath}`, () => {});
      } catch {/* ignore post-command failures */}
    }
    return ok;
  }

  async readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult> {
    return await readFileAction(filePath, this.serverConfig.directory, options);
  }

  async amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean> {
    return await amendFileAction(filePath, content, options?.backup, this.serverConfig.directory);
  }

  async listFiles(params: ListParams): Promise<PaginatedResponse<string>> {
    const directory = params.directory ?? '.';
    const limit = typeof params.limit === 'number' ? params.limit : 10;
    const offset = typeof params.offset === 'number' ? params.offset : 0;
    const recursive = !!params.recursive;
    const typeFilter = params.typeFilter; // 'files' | 'folders' | undefined

    const items: string[] = [];
    const walk = async (dirAbs: string, relPrefix = ''): Promise<void> => {
      const entries = await fs.readdir(dirAbs, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dirAbs, entry.name);
        const rel = relPrefix ? path.join(relPrefix, entry.name) : entry.name;
        const isDir = entry.isDirectory();
        if (!typeFilter || (typeFilter === 'folders' && isDir) || (typeFilter === 'files' && !isDir)) {
          items.push(rel);
        }
        if (recursive && isDir) {
          await walk(full, rel);
        }
      }
    };

    await walk(directory);
    items.sort((a, b) => a.localeCompare(b));
    const total = items.length;
    const paged = items.slice(offset, offset + limit);
    return { items: paged, total, limit, offset };
  }

  async listFilesWithDefaults(params: ListParams): Promise<PaginatedResponse<string>> {
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

  async updateFile(filePath: string, pattern: string, replacement: string, options?: { backup?: boolean; multiline?: boolean }): Promise<boolean> {
    const backup = options?.backup !== false; // default true
    const multiline = !!options?.multiline;
    const dir = this.serverConfig.directory || process.cwd();
    return await updateFileAction(filePath, pattern, replacement, backup, multiline, dir);
  }

  async getFileContent(filePath: string): Promise<string> {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('filePath is required');
    }
    const dir = this.serverConfig.directory || process.cwd();
    const fullPath = path.join(dir, filePath);
    const data = await fs.readFile(fullPath, 'utf8');
    return data;
  }
}
