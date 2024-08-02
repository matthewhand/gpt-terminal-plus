import { AbstractServerHandler } from '../AbstractServerHandler';
import { loadActions } from '../../utils/loadActions';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { SshHostConfig } from '../../types/ServerConfig';
import debug from 'debug';

const sshServerDebug = debug('app:SshServer');
const actions = loadActions(__dirname + '/actions');

/**
 * Implementation of the SSH server handler.
 */
class SshServer extends AbstractServerHandler {
  privateKeyPath: string;
  port: number;
  username: string;

  /**
   * Initializes the SshServer with a given server configuration.
   * @param serverConfig - The configuration of the SSH server.
   */
  constructor(serverConfig: SshHostConfig) {
    super(serverConfig);
    this.privateKeyPath = serverConfig.privateKeyPath;
    this.port = serverConfig.port ?? 22; // Provide a default value if port is undefined
    this.username = serverConfig.username;
    sshServerDebug(`Initialized SshServer with config: ${JSON.stringify(serverConfig)}`);
  }

  /**
   * Executes a command on the SSH server.
   * @param command - The command to execute.
   * @param timeout - The optional timeout for the command execution.
   * @param directory - The optional directory to execute the command in.
   * @returns The command execution result.
   */
  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    sshServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);
    if (!actions.executeCommand) {
      throw new Error('executeCommand action not found');
    }
    return actions.executeCommand(command, timeout, directory);
  }

  /**
   * Retrieves the system information of the SSH server.
   * @returns The system information.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    sshServerDebug('Retrieving system info');
    if (!actions.getSystemInfo) {
      throw new Error('getSystemInfo action not found');
    }
    return actions.getSystemInfo();
  }

  /**
   * Amends a file on the SSH server.
   * @param filePath - The path of the file to amend.
   * @param content - The content to append to the file.
   * @param backup - Whether to back up the file before amending.
   * @returns Whether the file was successfully amended.
   */
  async amendFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
    sshServerDebug(`Amending file at path: ${filePath}, content: ${content}, backup: ${backup}`);
    if (!actions.amendFile) {
      throw new Error('amendFile action not found');
    }
    return actions.amendFile(filePath, content, backup);
  }

  /**
   * Creates a file on the SSH server.
   * @param directory - The directory to create the file in.
   * @param filename - The name of the file to create.
   * @param content - The content of the file.
   * @param backup - Whether to create a backup of the file.
   * @returns Whether the file was successfully created.
   */
  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    sshServerDebug(`Creating file in directory: ${directory}, filename: ${filename}, content: ${content}, backup: ${backup}`);
    if (!actions.createFile) {
      throw new Error('createFile action not found');
    }
    return actions.createFile(directory, filename, content, backup);
  }

  /**
   * Lists files in a directory on the SSH server.
   * @param params - The parameters for listing files.
   * @returns A paginated response with the list of files.
   */
  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    sshServerDebug(`Listing files with params: ${JSON.stringify(params)}`);
    if (!actions.listFiles) {
      throw new Error('listFiles action not found');
    }
    return actions.listFiles(params);
  }

  /**
   * Updates a file on the SSH server.
   * @param filePath - The path of the file to update.
   * @param pattern - The pattern to replace in the file.
   * @param replacement - The replacement for the pattern.
   * @param backup - Whether to create a backup of the file.
   * @returns Whether the file was successfully updated.
   */
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    sshServerDebug(`Updating file at path: ${filePath}, pattern: ${pattern}, replacement: ${replacement}, backup: ${backup}`);
    if (!actions.updateFile) {
      throw new Error('updateFile action not found');
    }
    return actions.updateFile(filePath, pattern, replacement, backup);
  }

  /**
   * Changes the working directory on the SSH server.
   * @param directory - The directory to change to.
   * @returns Whether the directory was successfully changed.
   */
  async changeDirectory(directory: string): Promise<boolean> {
    sshServerDebug(`Changing directory to: ${directory}`);
    if (!actions.changeDirectory) {
      throw new Error('changeDirectory action not found');
    }
    return actions.changeDirectory(directory);
  }

  /**
   * Retrieves the present working directory on the SSH server.
   * @returns The present working directory.
   */
  async presentWorkingDirectory(): Promise<string> {
    sshServerDebug('Retrieving present working directory');
    if (!actions.presentWorkingDirectory) {
      throw new Error('presentWorkingDirectory action not found');
    }
    return actions.presentWorkingDirectory();
  }
}

export default SshServer;
