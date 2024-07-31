import { PaginatedResponse } from './PaginatedResponse';
import { SystemInfo } from './SystemInfo';

export interface ServerHandler {
  changeDirectory(directory: string): Promise<boolean>;
  createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  amendFile(filePath: string, content: string): Promise<boolean>;
  listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'datetime' | 'filename' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>>;
  presentWorkingDirectory(): Promise<string>;
  getSystemInfo(): Promise<SystemInfo>;
}
