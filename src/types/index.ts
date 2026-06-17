export type SupportedLanguages = 'python' | 'typescript';

export interface ExecutionResult {
    stdout: string;
    stderr: string;
    error: boolean;
}

export interface ServerHandlerOptions {
  // Define the options here
}

export interface ListFilesParams {
  directory: string;
  limit?: number;
  offset?: number;
  orderBy?: 'datetime' | 'filename';
}

export interface File {
  name: string;
  size: number;
  modified: Date;
}

export interface PaginatedRequest {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// Re-export engine interfaces for barrel compatibility in tests
export type { FileOperation } from '../engines/fileEngine';
export interface SystemInfo {
  platform?: string;
  arch?: string;
  cpus?: number;
  memory?: any;
  hostname?: string;
  [key: string]: any;
}
export interface ChatMessage { role: string; content: string; }
export interface ChatRequest { messages: ChatMessage[]; model?: string; stream?: boolean; }
export interface ChatResponse { content?: string; [key: string]: any; }
export interface CommandRequest { command: string; [key: string]: any; }
