import { AbstractServerHandler } from "../AbstractServerHandler";
import { ServerConfig } from "../../types/ServerConfig";
import { ExecutionResult } from "../../types/ExecutionResult";
import { PaginatedResponse } from "../../types/PaginatedResponse";
import { SystemInfo } from "../../types/SystemInfo";
import listFilesAction from "./actions/listFiles";
import { createFile as createFileAction } from "./actions/createFile";
import { getFileContent as getFileContentAction } from "./actions/getFileContent";
import { updateFile as updateFileAction } from "./actions/updateFile";
import { amendFile as amendFileAction } from "./actions/amendFile";
import { getSystemInfo as getSystemInfoAction } from "./actions/getSystemInfo";
import { presentWorkingDirectory as presentWorkingDirectoryAction } from "./actions/presentWorkingDirectory";
import { executeCommand as executeCommandAction } from "./actions/executeCommand";
import { executeCode as executeCodeAction } from "./actions/executeCode";

export class LocalServerHandler extends AbstractServerHandler {
  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
  }

  /**
   * Execute a raw shell command.
   */
  async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    return await executeCommandAction(command, timeout, directory || this.serverConfig.directory || process.cwd());
  }

  /**
   * Execute a code snippet.
   */
  async executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    return await executeCodeAction(code, language, timeout, directory || this.serverConfig.directory || process.cwd());
  }

  /**
   * Create or overwrite a local file.
   */
  async createFile(filePath: string, content?: string, backup: boolean = true): Promise<boolean> {
    return await createFileAction(filePath, content || '', backup, this.serverConfig.directory);
  }

  /**
   * Read and return the content of a local file.
   */
  async getFileContent(filePath: string): Promise<string> {
    return await getFileContentAction(filePath, this.serverConfig.directory);
  }

  /**
   * Update file content with regex replacement.
   */
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true, multiline: boolean = false): Promise<boolean> {
    return await updateFileAction(filePath, pattern, replacement, backup, multiline, this.serverConfig.directory);
  }

  /**
   * Append content to a local file.
   */
  async amendFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
    return await amendFileAction(filePath, content, backup, this.serverConfig.directory);
  }

  /**
   * List files relative to the configured directory.
   */
  async listFiles(params: { directory?: string; limit?: number; offset?: number; orderBy?: string }): Promise<PaginatedResponse<string>> {
    const effectiveParams = {
      ...params,
      directory: params.directory || this.serverConfig.directory || process.cwd(),
    };
    const raw = await listFilesAction(effectiveParams as any);
    return {
      items: raw.files.map((f: any) => f.name),
      total: raw.total,
      limit: effectiveParams.limit ?? raw.files.length,
      offset: effectiveParams.offset ?? 0,
    };
  }

  /**
   * Retrieve system information.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    return await getSystemInfoAction();
  }

  /**
   * Update the server’s configuration.
   */
  setServerConfig(config: ServerConfig): void {
    this.serverConfig = config;
  }

  /**
   * Return the present working directory.
   */
  async presentWorkingDirectory(): Promise<string> {
    return await presentWorkingDirectoryAction();
  }
}
