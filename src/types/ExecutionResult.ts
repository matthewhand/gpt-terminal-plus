export interface ExecutionResult {
  stdout: string;
  stderr: string;
  error?: boolean; // Make error optional
}
