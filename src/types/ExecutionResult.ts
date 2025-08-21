export interface ExecutionResult {
  stdout: string;
  stderr: string;
  error?: boolean;
  exitCode?: number;
}
