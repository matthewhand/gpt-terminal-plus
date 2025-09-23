import { AbstractServerHandler } from '../AbstractServerHandler';
import { ServerConfig } from '../../types/ServerConfig';
import { SystemInfo } from '../../types/SystemInfo';
import { ExecutionResult } from '../../types/ExecutionResult';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { ListParams } from '../../types/ListParams';
import { FileReadResult } from '../../types/FileReadResult';
import { SearchResult, SearchParams } from '../../types/ServerHandler';

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
import listFilesAction from './actions/listFiles.local';

export class LocalServerHandler extends AbstractServerHandler {
  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    const cwd = directory || getPresentWorkingDirectory() || this.serverConfig.directory || process.cwd();
    const childProc = require('child_process');
    const spawn = childProc.spawn as (cmd: string, args: string[], opts: any) => any;
    const shell = '/bin/bash';
    const args = ['-lc', command];
    const opts = { cwd, env: { ...process.env }, stdio: ['ignore', 'pipe', 'pipe'] };
    return await new Promise<ExecutionResult>((resolve) => {
      const child = spawn(shell, args, opts);
      let stdout = '';
      let stderr = '';
      child.stdout?.on('data', (d: any) => { stdout += String(d || ''); });
      child.stderr?.on('data', (d: any) => { stderr += String(d || ''); });
      let settled = false;
      let t: any;
      if (typeof timeout === 'number' && timeout > 0) {
        t = setTimeout(() => {
          try { child.kill('SIGKILL'); } catch {}
          if (!settled) {
            settled = true;
            resolve({ stdout, stderr: (stderr || '') + '\n[timeout]', exitCode: 124, error: true, truncated: false, terminated: true } as any);
          }
        }, timeout);
      }
      child.on('close', (code: number) => {
        if (t) clearTimeout(t);
        if (!settled) {
          settled = true;
          const exitCode = typeof code === 'number' ? code : 0;
          resolve({ stdout, stderr, exitCode, error: exitCode !== 0 } as any);
        }
      });
    });
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

  async listFiles(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
    const directory = params.directory ?? '.';
    const limit = typeof params.limit === 'number' ? params.limit : undefined;
    const offset = typeof params.offset === 'number' ? params.offset : 0;
    // Normalize orderBy to handle both 'name' and 'filename'
    const orderBy = (params.orderBy === 'name' as any ? 'filename' : params.orderBy) ?? 'filename';
    const recursive = !!params.recursive;
    const typeFilter = params.typeFilter;

    // Delegate to the action to keep behavior consistent with other tests
    const { files, total } = await listFilesAction({ directory, limit, offset, orderBy, recursive, typeFilter });
    const items = files.map(f => ({ name: f.name, isDirectory: f.isDirectory }));
    return { items, total, limit: limit ?? total, offset };
  }

  async listFilesWithDefaults(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
    // Validate parameters
    if (params.directory !== undefined && (typeof params.directory !== 'string' || params.directory.trim() === '')) {
      throw new Error('Directory must be a non-empty string');
    }
    if (params.limit !== undefined && (typeof params.limit !== 'number' || params.limit <= 0)) {
      throw new Error('Limit must be a positive number');
    }
    if (params.offset !== undefined && (typeof params.offset !== 'number' || params.offset < 0)) {
      throw new Error('Offset must be a non-negative number');
    }

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

  async searchFiles(params: SearchParams): Promise<PaginatedResponse<SearchResult>> {
    const { pattern, path: searchPath, caseSensitive = false, limit = 100, offset = 0 } = params;

    if (!pattern || typeof pattern !== 'string') {
      throw new Error('Pattern is required and must be a string');
    }

    if (!searchPath || typeof searchPath !== 'string') {
      throw new Error('Path is required and must be a string');
    }

    const dir = this.serverConfig.directory || process.cwd();
    const fullSearchPath = path.resolve(dir, searchPath);

    // Validate regex pattern
    let regex: RegExp;
    try {
      regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
    } catch (error) {
      throw new Error(`Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`);
    }

    const results: SearchResult[] = [];

    // Recursive function to search files
    const searchInDirectory = async (currentPath: string): Promise<void> => {
      try {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
          const entryPath = path.join(currentPath, entry.name);

          if (entry.isDirectory()) {
            // Skip common directories that shouldn't be searched
            if (!['node_modules', '.git', '.vscode', 'dist', 'build'].includes(entry.name)) {
              await searchInDirectory(entryPath);
            }
          } else if (entry.isFile()) {
            try {
              const content = await fs.readFile(entryPath, 'utf8');
              const lines = content.split('\n');

              lines.forEach((line, index) => {
                if (regex.test(line)) {
                  results.push({
                    filePath: path.relative(dir, entryPath),
                    lineNumber: index + 1,
                    content: line.trim()
                  });
                }
              });
            } catch (error) {
              // Skip files that can't be read (binary files, permission issues, etc.)
              console.debug('Skipping file during search:', entryPath, error);
            }
          }
        }
      } catch (error) {
        // Skip directories that can't be read
        console.debug('Skipping directory during search:', currentPath, error);
      }
    };

    await searchInDirectory(fullSearchPath);

    // Apply pagination
    const total = results.length;
    const paginatedResults = results.slice(offset, offset + limit);

    return {
      items: paginatedResults,
      total,
      limit,
      offset
    };
  }
}
