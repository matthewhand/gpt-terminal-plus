import { AbstractServerHandler } from '../AbstractServerHandler';
import { loadActions } from '../../utils/loadActions';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { LocalConfig } from '../../types/ServerConfig';
import debug from 'debug';

const actions = loadActions(__dirname + '/actions');
const localServerDebug = debug('app:LocalServer');

class LocalServer extends AbstractServerHandler {
  code: boolean;

  /**
   * Initializes the LocalServer with a given server configuration.
   * @param serverConfig - The configuration of the local server.
   */
  constructor(serverConfig: LocalConfig) {
    super(serverConfig);
    this.code = serverConfig.code ?? false; // Provide a default value if code is undefined
    localServerDebug(`Initialized LocalServer with config: ${JSON.stringify(serverConfig)}`);
  }

  /**
   * Executes a command on the local server.
   * @param command - The command to execute.
   * @param timeout - The optional timeout for the command execution.
   * @param directory - The optional directory to execute the command in.
   * @returns The command execution result.
   */
  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    localServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);
    return actions.executeCommand(command, timeout, directory);
  }

  /**
   * Retrieves the system information of the local server.
   * @returns The system information.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    localServerDebug(`Retrieving system info`);
    return actions.getSystemInfo();
  }

  /**
   * Amends a file on the local server.
   * @param filePath - The path of the file to amend.
   * @param content - The content to append to the file.
   * @returns Whether the file was successfully amended.
   */
  async amendFile(filePath: string, content: string): Promise<boolean> {
    localServerDebug(`Amending file at path: ${filePath}, content: ${content}`);
    return actions.amendFile(filePath, content);
  }

  /**
   * Creates a file on the local server.
   * @param directory - The directory to create the file in.
   * @param filename - The name of the file to create.
   * @param content - The content of the file.
   * @param backup - Whether to create a backup of the file.
   * @returns Whether the file was successfully created.
   */
  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    localServerDebug(`Creating file in directory: ${directory}, filename: ${filename}, content: ${content}, backup: ${backup}`);
    return actions.createFile(directory, filename, content, backup);
  }

  /**
   * Lists files in a directory on the local server.
   * @param params - The parameters for listing files.
   * @returns A paginated response with the list of files.
   */
  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    localServerDebug(`Listing files with params: ${JSON.stringify(params)}`);
    return actions.listFiles(params);
  }

  /**
   * Updates a file on the local server.
   * @param filePath - The path of the file to update.
   * @param pattern - The pattern to replace in the file.
   * @param replacement - The replacement for the pattern.
   * @param backup - Whether to create a backup of the file.
   * @returns Whether the file was successfully updated.
   */
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    localServerDebug(`Updating file at path: ${filePath}, pattern: ${pattern}, replacement: ${replacement}, backup: ${backup}`);
    return actions.updateFile(filePath, pattern, replacement, backup);
  }

  /**
   * Changes the working directory on the local server.
   * @param directory - The directory to change to.
   * @returns Whether the directory was successfully changed.
   */
  async changeDirectory(directory: string): Promise<boolean> {
    localServerDebug(`Changing directory to: ${directory}`);
    return actions.changeDirectory(directory);
  }

  /**
   * Retrieves the present working directory on the local server.
   * @returns The present working directory.
   */
  async presentWorkingDirectory(): Promise<string> {
    localServerDebug(`Retrieving present working directory`);
    return actions.presentWorkingDirectory();
  }
}

export default LocalServer;
