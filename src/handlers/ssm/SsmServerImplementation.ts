import { AbstractServerHandler } from '../AbstractServerHandler';
import { loadActions } from '../../utils/loadActions';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { SsmTargetConfig } from '../../types/ServerConfig';
import debug from 'debug';

const ssmServerDebug = debug('app:SsmServer');
const actions = loadActions(__dirname + '/actions');

/**
 * Implementation of the SSM server handler.
 */
class SsmServer extends AbstractServerHandler {
  instanceId: string;
  region: string;

  /**
   * Initializes the SsmServer with a given server configuration.
   * @param serverConfig - The configuration of the SSM server.
   */
  constructor(serverConfig: SsmTargetConfig) {
    super(serverConfig);
    this.instanceId = serverConfig.instanceId;
    this.region = serverConfig.region;
    ssmServerDebug(`Initialized SsmServer with config: ${JSON.stringify(serverConfig)}`);
  }

  /**
   * Executes a command on the SSM server.
   * @param command - The command to execute.
   * @param timeout - The optional timeout for the command execution.
   * @param directory - The optional directory to execute the command in.
   * @returns The command execution result.
   */
  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    ssmServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}, region: ${this.region}, instanceId: ${this.instanceId}`);
    if (!actions.executeCommand) {
      throw new Error('executeCommand action not found');
    }
    return actions.executeCommand(command, timeout, directory, this.region, this.instanceId);
  }

  /**
   * Retrieves the system information of the SSM server.
   * @returns The system information.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    ssmServerDebug(`Retrieving system info for region: ${this.region}, instanceId: ${this.instanceId}`);
    if (!actions.getSystemInfo) {
      throw new Error('getSystemInfo action not found');
    }
    return actions.getSystemInfo(this.region, this.instanceId);
  }

  /**
   * Amends a file on the SSM server.
   * @param filePath - The path of the file to amend.
   * @param content - The content to append to the file.
   * @param backup - Whether to back up the file before amending.
   * @returns Whether the file was successfully amended.
   */
  async amendFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
    ssmServerDebug(`Amending file at path: ${filePath}, content: ${content}, backup: ${backup}, region: ${this.region}, instanceId: ${this.instanceId}`);
    if (!actions.amendFile) {
      throw new Error('amendFile action not found');
    }
    return actions.amendFile(filePath, content, backup, this.region, this.instanceId);
  }

  /**
   * Creates a file on the SSM server.
   * @param directory - The directory to create the file in.
   * @param filename - The name of the file to create.
   * @param content - The content of the file.
   * @param backup - Whether to create a backup of the file.
   * @returns Whether the file was successfully created.
   */
  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    ssmServerDebug(`Creating file in directory: ${directory}, filename: ${filename}, content: ${content}, backup: ${backup}, region: ${this.region}, instanceId: ${this.instanceId}`);
    if (!actions.createFile) {
      throw new Error('createFile action not found');
    }
    return actions.createFile(directory, filename, content, backup, this.region, this.instanceId);
  }

  /**
   * Lists files in a directory on the SSM server.
   * @param params - The parameters for listing files.
   * @returns A paginated response with the list of files.
   */
  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    ssmServerDebug(`Listing files with params: ${JSON.stringify(params)}, region: ${this.region}, instanceId: ${this.instanceId}`);
    if (!actions.listFiles) {
      throw new Error('listFiles action not found');
    }
    return actions.listFiles({ ...params, region: this.region, instanceId: this.instanceId });
  }

  /**
   * Updates a file on the SSM server.
   * @param filePath - The path of the file to update.
   * @param pattern - The pattern to replace in the file.
   * @param replacement - The replacement for the pattern.
   * @param backup - Whether to create a backup of the file.
   * @returns Whether the file was successfully updated.
   */
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    ssmServerDebug(`Updating file at path: ${filePath}, pattern: ${pattern}, replacement: ${replacement}, backup: ${backup}, region: ${this.region}, instanceId: ${this.instanceId}`);
    if (!actions.updateFile) {
      throw new Error('updateFile action not found');
    }
    return actions.updateFile(filePath, pattern, replacement, backup, this.region, this.instanceId);
  }

  /**
   * Changes the working directory on the SSM server.
   * @param directory - The directory to change to.
   * @returns Whether the directory was successfully changed.
   */
  async changeDirectory(directory: string): Promise<boolean> {
    ssmServerDebug(`Changing directory to: ${directory}, region: ${this.region}, instanceId: ${this.instanceId}`);
    if (!actions.changeDirectory) {
      throw new Error('changeDirectory action not found');
    }
    return actions.changeDirectory(directory, this.region, this.instanceId);
  }

  /**
   * Retrieves the present working directory on the SSM server.
   * @returns The present working directory.
   */
  async presentWorkingDirectory(): Promise<string> {
    ssmServerDebug(`Retrieving present working directory, region: ${this.region}, instanceId: ${this.instanceId}`);
    if (!actions.presentWorkingDirectory) {
      throw new Error('presentWorkingDirectory action not found');
    }
    return actions.presentWorkingDirectory(this.region, this.instanceId);
  }
}

export default SsmServer;
