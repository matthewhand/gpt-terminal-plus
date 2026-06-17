export interface ExecutionResult {
  stdout: string;
  stderr: string;
  error?: boolean | string;
  success?: boolean;
  exitCode?: number;
  truncated?: boolean;
  terminated?: boolean;
  output?: string;
}
