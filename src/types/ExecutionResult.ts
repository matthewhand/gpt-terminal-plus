export interface ExecutionResult {
  stdout: string;
  stderr: string;
  /**
   * Convenience flag expected by some tests; true when exitCode === 0 and no error condition.
   */
  success?: boolean;
  error?: boolean;
  exitCode?: number;
}
