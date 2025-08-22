
import { AbstractServerHandler } from "../AbstractServerHandler";
import { ServerConfig } from "../../types/ServerConfig";
import { ExecutionResult } from "../../types/ExecutionResult";
import { PaginatedResponse } from "../../types/PaginatedResponse";
import { SystemInfo } from "../../types/SystemInfo";
import { FileReadResult } from "../../types/FileReadResult";
import listFilesAction from "./actions/listFiles";
import { createFile as createFileAction } from "./actions/createFile";
import { readFile as readFileAction } from "./actions/readFile";
import { updateFile as updateFileAction } from "./actions/updateFile";
import { amendFile as amendFileAction } from "./actions/amendFile";
import { getSystemInfo as getSystemInfoAction } from "./actions/getSystemInfo";
import { presentWorkingDirectory as presentWorkingDirectoryAction } from "./actions/presentWorkingDirectory";
import { executeCommand as executeCommandAction } from "./actions/executeCommand";
import { executeCode as executeCodeAction } from "./actions/executeCode";
import { changeDirectory as changeDirectoryAction } from "./actions/changeDirectory";

export class LocalServerHandler extends AbstractServerHandler {
  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    return await executeCommandAction(command, timeout, directory || this.serverConfig.directory || process.cwd());
  }

  async executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    return await executeCodeAction(code, language, timeout, directory || this.serverConfig.directory || process.cwd());
  }

  async createFile(filePath: string, content?: string, backup: boolean = true): Promise<boolean> {
    return await createFileAction(filePath, content || '', backup, this.serverConfig.directory);
  }

  async readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult> {
    return await readFileAction(filePath, this.serverConfig.directory, options);
  }

  async updateFile(filePath: string, pattern: string, replacement: string, options?: { backup?: boolean; multiline?: boolean }): Promise<boolean> {
    return await updateFileAction(filePath, pattern, replacement, options?.backup, options?.multiline, this.serverConfig.directory);
  }

  async amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean> {
    return await amendFileAction(filePath, content, options?.backup, this.serverConfig.directory);
  }

  async listFiles(params: { directory?: string; limit?: number; offset?: number; orderBy?: string }): Promise<PaginatedResponse<string>> {
    const effectiveParams = {
      ...params,
      directory: params.directory || '.',
    };
    const raw = await listFilesAction(effectiveParams as any);
    return {
      items: raw.files.map((f: any) => f.name),
      total: raw.total,
      limit: effectiveParams.limit ?? raw.files.length,
      offset: effectiveParams.offset ?? 0,
    };
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return await getSystemInfoAction();
  }

  setServerConfig(config: ServerConfig): void {
    this.serverConfig = config;
  }

  async presentWorkingDirectory(): Promise<string> {
    return await presentWorkingDirectoryAction();
  }

  async changeDirectory(directory: string): Promise<boolean> {
    return await changeDirectoryAction(directory, this.serverConfig.directory);
  }
}
