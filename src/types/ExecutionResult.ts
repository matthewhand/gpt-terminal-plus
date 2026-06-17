export interface ExecutionResult {
  stdout: string;
  stderr: string;
  error?: boolean;
  success?: boolean;
  exitCode?: number;
  truncated?: boolean;
  terminated?: boolean;
}
