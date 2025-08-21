import { ServerConfig } from '../types/ServerConfig';
import { ExecutionResult } from '../types/ExecutionResult';
import { PaginatedResponse } from '../types/PaginatedResponse';
import { SystemInfo } from '../types/SystemInfo';

/**
 * Base abstraction for all server handlers (Local, SSH, SSM).
 *
 * ### Directory Resolution Contract
 * - Every file or command execution method must honor the handler’s working directory:
 *   - If `this.serverConfig.directory` is set, all relative paths resolve against it.
 *   - If not set:
 *     - LocalHandler → defaults to `process.cwd()`.
 *     - SSH/SSMHandler → defaults to `/`.
 * - Handlers must reject operations that resolve paths outside of this base directory
 *   (e.g. via `..` traversal).
 *
 * ### Notes
 * - All methods should log their resolved paths and directories for debugging.
 * - Concrete implementations must enforce safety, backups, and consistent behavior.
 */
export abstract class AbstractServerHandler {
  protected serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
  }

  /**
   * Execute a raw shell command inside the handler’s working directory.
   */
  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult>;

  /**
   * Execute a code snippet in the given language inside the handler’s working directory.
   */
  abstract executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult>;

  /**
   * Create or overwrite a file relative to the handler’s working directory.
   * Must optionally create a timestamped backup if requested.
   */
  abstract createFile(filePath: string, content?: string, backup?: boolean): Promise<boolean | ExecutionResult>;

  /**
   * Read a file relative to the handler’s working directory.
   * Must throw if the file does not exist or path escapes the directory scope.
   */
  abstract getFileContent(filePath: string): Promise<string | ExecutionResult>;

  /**
   * Retrieve basic system information about the handler’s environment.
   */
  abstract getSystemInfo(): Promise<SystemInfo | ExecutionResult>;

  /**
   * List files relative to the handler’s working directory.
   * - Must support pagination (`limit`, `offset`).
   * - `orderBy` is constrained to known values (e.g. 'filename', 'datetime').
   */
  abstract listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: string }): Promise<PaginatedResponse<string>>;

  /**
   * Update the server’s configuration (e.g. change working directory).
   */
  abstract setServerConfig(config: ServerConfig): void;

  /**
   * Return the present working directory being used by this handler.
   */
  abstract presentWorkingDirectory(): Promise<string>;
}
