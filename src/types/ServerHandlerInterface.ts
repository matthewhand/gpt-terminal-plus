import { PaginatedResponse } from './PaginatedResponse';
import { SystemInfo } from './SystemInfo';

export interface ServerHandlerInterface {
    listFiles(directory: string, limit?: number, offset?: number, orderBy?: 'datetime' | 'filename'): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>>;
    // Other methods...
    getSystemInfo(): Promise<SystemInfo>;
}
