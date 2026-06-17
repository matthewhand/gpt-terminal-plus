// Centralized API types for better type safety

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  error: boolean;
  success: boolean;
  truncated?: boolean;
  terminated?: boolean;
}

export interface CommandRequest {
  command: string;
  args?: string[];
  shell?: string;
  timeout?: number;
  directory?: string;
}

export interface CodeRequest {
  code: string;
  language: string;
  timeout?: number;
  directory?: string;
}

export interface FileRequest {
  filePath: string;
  content?: string;
  backup?: boolean;
  encoding?: string;
  maxBytes?: number;
  startLine?: number;
  endLine?: number;
}

export interface LlmRequest {
  instructions: string;
  model?: string;
  stream?: boolean;
  dryRun?: boolean;
  confirm?: boolean;
  engine?: string;
  costUsd?: number;
}

export interface SecurityEvent {
  timestamp: string;
  ip: string;
  userAgent: string | undefined;
  method: string;
  path: string;
  event: string;
  details?: any;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: string;
  retryAfter?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}