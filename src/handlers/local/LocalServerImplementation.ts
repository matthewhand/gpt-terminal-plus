import { AbstractServerHandler } from '../AbstractServerHandler';
import { createFile } from './actions/createFile';
import { amendFile } from './actions/amendFile';
// import listFiles from './actions/listFiles';
import { getSystemInfo } from './actions/getSystemInfo';
import { updateFile } from './actions/updateFile';
import { executeCommand } from './actions/executeCommand';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { LocalConfig } from '../../types/ServerConfig';
import debug from 'debug';

const localServerDebug = debug('app:LocalServer');

/**
 * Implementation of the local server handler.
 */
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
   * @throws {Error} If the executeCommand action is not found.
   */
  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    localServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);
    if (!executeCommand) {
      throw new Error('executeCommand action not found');
    }
    return executeCommand(command, timeout, directory);
  }

  /**
   * Retrieves the system information of the local server.
   * @returns The system information.
   * @throws {Error} If the getSystemInfo action is not found.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    localServerDebug('Retrieving system info');
    if (!getSystemInfo) {
      throw new Error('getSystemInfo action not found');
    }
    return getSystemInfo('TODO','TODO');   // TODO chatgpt?
  }

  /**
   * Amends a file on the local server.
   * @param filePath - The path of the file to amend.
   * @param content - The content to append to the file.
   * @param backup - Whether to back up the file before amending.
   * @returns Whether the file was successfully amended.
   * @throws {Error} If the amendFile action is not found.
   */
  async amendFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
    localServerDebug(`Amending file at path: ${filePath}, content: ${content}, backup: ${backup}`);
    if (!amendFile) {
      throw new Error('amendFile action not found');
    }
    // return amendFile(filePath, content, backup);
    return amendFile(filePath, content);
  }

  /**
   * Creates a file on the local server.
   * @param directory - The directory to create the file in.
   * @param filename - The name of the file to create.
   * @param content - The content of the file.
   * @param backup - Whether to create a backup of the file.
   * @returns Whether the file was successfully created.
   * @throws {Error} If the createFile action is not found.
   */
  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    localServerDebug(`Creating file in directory: ${directory}, filename: ${filename}, content: ${content}, backup: ${backup}`);
    if (!createFile) {
      throw new Error('createFile action not found');
    }
    return createFile(directory, filename, content, backup);
  }

  /**
   * Lists files in a directory on the local server.
   * @param params - The parameters for listing files.
   * @returns A paginated response with the list of files.
   * @throws {Error} If the listFiles action is not found.
   */
  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    localServerDebug(`Listing files with params: ${JSON.stringify(params)}`);
    throw new Error('listFiles action not found');
  }

  /**
   * Updates a file on the local server.
   * @param filePath - The path of the file to update.
   * @param pattern - The pattern to replace in the file.
   * @param replacement - The replacement for the pattern.
   * @param backup - Whether to create a backup of the file.
   * @returns Whether the file was successfully updated.
   * @throws {Error} If the updateFile action is not found.
   */
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    localServerDebug(`Updating file at path: ${filePath}, pattern: ${pattern}, replacement: ${replacement}, backup: ${backup}`);
    if (!updateFile) {
      throw new Error('updateFile action not found');
    }
    return updateFile(filePath, pattern, replacement, backup);
  }

  /**
   * Changes the working directory on the local server.
   * @param directory - The directory to change to.
   * @returns Whether the directory was successfully changed.
   */
  async changeDirectory(directory: string): Promise<boolean> {
    localServerDebug(`Changing directory to: ${directory}`);
    return super.changeDirectory(directory);
  }

  /**
   * Retrieves the present working directory on the local server.
   * @returns The present working directory.
   */
  async presentWorkingDirectory(): Promise<string> {
    localServerDebug('Retrieving present working directory');
    return super.presentWorkingDirectory();
  }
}

export default LocalServer;
