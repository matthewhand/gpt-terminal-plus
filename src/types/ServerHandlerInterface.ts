import { PaginatedResponse } from '../types/PaginatedResponse';
import { SystemInfo } from '../types/SystemInfo';

export interface ServerHandlerInterface {
    executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>; 
    listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<PaginatedResponse<string>>;
    createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
    updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
    amendFile(filePath: string, content: string): Promise<boolean>;
    getSystemInfo(): Promise<SystemInfo>;
}
