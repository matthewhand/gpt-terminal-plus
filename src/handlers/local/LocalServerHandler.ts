import { AbstractServerHandler } from '../AbstractServerHandler';
import Debug from 'debug';
import { ExecutionResult } from '../../types/ExecutionResult';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { executeCode as executeLocalCode } from './actions/executeCode';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const localServerDebug = Debug('app:LocalServerHandler');

export class LocalServerHandler extends AbstractServerHandler {
  constructor(serverConfig: { protocol: string; code: boolean; hostname?: string }) {
    super(serverConfig);
    localServerDebug('Initialized LocalServerHandler with config:', serverConfig);
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    localServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);
    return executeLocalCode(command, 'bash', timeout, directory);
  }

  async listFiles(params: { directory: string, limit?: number, offset?: number }): Promise<PaginatedResponse<string>> {
    localServerDebug(`Listing files with params: ${JSON.stringify(params)}`);
    const { directory, limit = 10, offset = 0 } = params;

    try {
      const files = await readdir(directory);
      const paginatedFiles = files.slice(offset, offset + limit);
      return {
        items: paginatedFiles,
        total: files.length,
        limit,
        offset,
      };
    } catch (error) {
      localServerDebug(`Error listing files: ${(error as Error).message}`);
      throw new Error(`Failed to list files in directory '${directory}': ${(error as Error).message}`);
    }
  }
}

export { LocalServerHandler };
