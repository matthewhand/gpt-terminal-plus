import { ServerHandler } from '../../types/ServerHandler';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';

export interface LocalServerHandler extends ServerHandler {
  executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;
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
