import { ServerConfig } from '../types/ServerConfig';
import { SystemInfo } from '../types/SystemInfo';
import { PaginatedResponse } from '../types/PaginatedResponse';
import { ServerHandlerInterface } from '../types/ServerHandlerInterface';
import debug from 'debug';
import { presentWorkingDirectory, changeDirectory } from '../utils/GlobalStateHelper';

const serverHandlerDebug = debug('app:ServerHandler');

/**
 * Abstract base class for server handlers.
 * Provides common methods and properties for managing server interactions.
 */
export abstract class ServerHandler implements ServerHandlerInterface {
  public identifier: string;
  protected ServerConfig: ServerConfig;

  /**
   * Constructs a ServerHandler instance.
   * @param {ServerConfig} ServerConfig - The server configuration.
   */
  constructor(ServerConfig: ServerConfig) {
    this.ServerConfig = ServerConfig;
    this.identifier = `${ServerConfig.username}@${ServerConfig.host}`;
    serverHandlerDebug(`ServerHandler created for ${this.identifier}`);
  }

  /**
   * Gets the server configuration.
   * @returns {ServerConfig} - The server configuration.
   */
  getServerConfig(): ServerConfig {
    serverHandlerDebug('Retrieving server configuration');
    return this.ServerConfig;
  }

  /**
   * Changes the current directory.
   * @param {string} directory - The directory to change to.
   * @returns {boolean} - True if the directory was changed successfully.
   */
  changeDirectory(directory: string): boolean {
    changeDirectory(directory);
    serverHandlerDebug(`Current directory set globally to ${directory}`);
    return true;
  }

  /**
   * Retrieves the current working directory.
   * @returns {Promise<string>} - The current working directory.
   */
  async presentWorkingDirectory(): Promise<string> {
    const directory = presentWorkingDirectory();
    serverHandlerDebug(`Retrieving current directory globally: ${directory}`);
    return directory;
  }

  /**
   * Abstract method to execute a command on the server.
   * @param {string} command - The command to execute.
   * @param {number} [timeout] - Optional timeout for the command execution.
   * @param {string} [directory] - Optional directory to execute the command in.
   * @returns {Promise<{ stdout: string; stderr: string }>} - The command's stdout and stderr output.
   */
  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;

  /**
   * Abstract method to list files in a directory on the server.
   * @param {string} directory - The directory to list files in.
   * @param {number} [limit] - Maximum number of files to return.
   * @param {number} [offset] - Number of files to skip before starting to collect the result set.
   * @param {string} [orderBy] - Criteria to order files by.
   * @returns {Promise<PaginatedResponse<string>>} - A paginated response containing files in the directory.
   */
  abstract listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<PaginatedResponse<string>>;

  /**
   * Abstract method to create a file on the server.
   * @param {string} directory - The directory to create the file in.
   * @param {string} filename - The name of the file to create.
   * @param {string} content - The content to write to the file.
   * @param {boolean} backup - Whether to create a backup of the file if it exists.
   * @returns {Promise<boolean>} - True if the file is created successfully.
   */
  abstract createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;

  /**
   * Abstract method to update a file on the server.
   * @param {string} filePath - The path of the file to update.
   * @param {string} pattern - The pattern to replace.
   * @param {string} replacement - The replacement string.
   * @param {boolean} backup - Whether to create a backup of the file before updating.
   * @returns {Promise<boolean>} - True if the file is updated successfully.
   */
  abstract updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;

  /**
   * Abstract method to append content to a file on the server.
   * @param {string} filePath - The path of the file to amend.
   * @param {string} content - The content to append.
   * @param {boolean} backup - Whether to create a backup of the file before amending.
   * @returns {Promise<boolean>} - True if the file is amended successfully.
   */
  abstract amendFile(filePath: string, content: string): Promise<boolean>;

  /**
   * Abstract method to retrieve system information from the server.
   * @returns {Promise<SystemInfo>} - System information.
   */
  abstract getSystemInfo(): Promise<SystemInfo>;
}
