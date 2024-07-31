import { ServerHandler } from '../../types/ServerHandler';
import { SystemInfo, PaginatedResponse } from '../../types';

export interface LocalServerHandler extends ServerHandler {
  executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;  // Common methods
  getSystemInfo(): Promise<SystemInfo>;
  amendFile(filePath: string, content: string): Promise<boolean>;
  createFile(directory: string, filename: string, content: string, backup?: boolean): Promise<boolean>;
  listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>>;
  updateFile(filePath: string, pattern: string, replacement: string, backup?: boolean): Promise<boolean>;
  changeDirectory(directory: string): Promise<boolean>;
  presentWorkingDirectory(): Promise<string>;

  // Unique parameters
  code?: boolean;  // Run 'code' command to open in VSCode
}

export const defaultLocalServerHandler: LocalServerHandler = {
  code: false,
  executeCommand: async (command, timeout, directory) => ({ stdout: '', stderr: '' }),
  getSystemInfo: async () => ({ hostname: '', platform: '', release: '', arch: '', uptime: 0 }),
  amendFile: async (filePath, content) => true,
  createFile: async (directory, filename, content, backup) => true,
  listFiles: async (params) => ({ data: [], total: 0, limit: 0, offset: 0 }),
  updateFile: async (filePath, pattern, replacement, backup) => true,
  changeDirectory: async (directory) => true,
  presentWorkingDirectory: async () => '',
};
