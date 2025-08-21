/**
 * SessionDriver Interface
 *
 * Defines the lifecycle contract for a stateful execution environment.
 * Supports multiple backends (shell, python, typescript, llm).
 *
 * Responsibilities:
 * - start: allocate a new session
 * - exec: run a command/input in that session
 * - stop: terminate and clean up
 * - logs: retrieve past outputs
 *
 * Every driver must persist logs into `data/activity/` under its sessionId.
 */

export interface SessionDriver {
  /** Start a new session */
  start(opts: any): Promise<SessionMeta>;

  /** Execute an input/command in an existing session */
  exec(id: string, input: string): Promise<ExecutionResult>;

  /** Stop and clean up a session */
  stop(id: string): Promise<void>;

  /** Retrieve logs for a session */
  logs(id: string, since?: string): Promise<ExecutionLog[]>;
}

/**
 * Metadata returned when a session starts.
 */
export interface SessionMeta {
  id: string;
  mode: string;
  server: string;
  startedAt: string;
}

/**
 * Structured output from an execution.
 */
export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timestamp: string;
}

/**
 * Logged execution entry.
 */
export interface ExecutionLog extends ExecutionResult {
  command?: string;
}
