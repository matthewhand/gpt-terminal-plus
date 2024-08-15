import { ServerConfig } from '../types/ServerConfig';
import { SystemInfo } from '../types/SystemInfo';
import { PaginatedResponse } from '../types/PaginatedResponse';
import { ServerHandler } from '../types/ServerHandler';
import { ExecutionResult } from '../types/ExecutionResult'; // Added this import
import debug from 'debug';
import { presentWorkingDirectory, changeDirectory } from '../utils/GlobalStateHelper';

const ServerHandlerDebug = debug('app:AbstractServerHandler');

/**
 * Abstract base class for server handlers.
 * Provides common methods and properties for managing server interactions.
 */
export abstract class AbstractServerHandler implements ServerHandler {
  public identifier: string;
  protected serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    this.identifier = serverConfig.hostname;
    ServerHandlerDebug('ServerHandler created for ' + this.identifier);
  }

  /**
   * Retrieves the server configuration.
   * @returns {ServerConfig} - The current server configuration.
   */
  getServerConfig(): ServerConfig {
    ServerHandlerDebug('Retrieving server configuration');
    return this.serverConfig;
  }

  /**
   * Sets the server configuration.
   * @param {ServerConfig} serverConfig - The new server configuration.
   */
  setServerConfig(serverConfig: ServerConfig): void {
    this.serverConfig = serverConfig;
    this.identifier = serverConfig.hostname;
    ServerHandlerDebug('Server configuration updated for ' + this.identifier);
  }

  /**
   * Changes the current working directory.
   * @param {string} directory - The directory to change to.
   * @returns {Promise<boolean>} - Resolves to true if the directory is changed successfully.
   */
  async changeDirectory(directory: string): Promise<boolean> {
    changeDirectory(directory);
    ServerHandlerDebug('Current directory set globally to ' + directory);
    return true;
  }

  /**
   * Retrieves the current working directory.
   * @returns {Promise<string>} - Resolves to the current working directory.
   */
  async presentWorkingDirectory(): Promise<string> {
    const directory = presentWorkingDirectory();
    ServerHandlerDebug('Retrieving current directory globally: ' + directory);
    return directory;
  }

  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;

  /**
   * Lists files in a specified directory.
   * @param {object} params - Parameters for listing files.
   * @param {string} params.directory - The directory to list files in.
   * @param {number} [params.limit] - Maximum number of files to return.
   * @param {number} [params.offset] - Offset for pagination.
   * @param {'datetime' | 'filename'} [params.orderBy] - Criteria to order the files by.
   * @returns {Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>>} - The list of files.
   */
  abstract listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'datetime' | 'filename' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>>;

  /**
   * Creates or replaces a file.
   * @param {string} filePath - The full path of the file to create or replace.
   * @param {string} content - The content to write to the file.
   * @param {boolean} backup - Whether to back up the existing file before creating or replacing the new one.
   * @returns {Promise<boolean>} - Resolves to true if the file is created or replaced successfully.
   */
  abstract createFile(filePath: string, content: string, backup: boolean): Promise<boolean>;

  /**
   * Updates an existing file by replacing specified patterns with new content.
   * @param {string} filePath - The full path of the file to update.
   * @param {string} pattern - The text pattern to be replaced in the file.
   * @param {string} replacement - The new text to replace the pattern.
   * @param {boolean} multiline - Whether to treat the pattern as multiline.
   * @returns {Promise<boolean>} - Resolves to true if the file is updated successfully.
   */
  abstract updateFile(filePath: string, pattern: string, replacement: string, multiline: boolean): Promise<boolean>;

  /**
   * Amends an existing file by appending new content to it.
   * @param {string} filePath - The full path of the file to amend.
   * @param {string} content - The content to append to the file.
   * @param {boolean} backup - Whether to back up the file before amending.
   * @returns {Promise<boolean>} - Resolves to true if the file is amended successfully.
   */
  abstract amendFile(filePath: string, content: string, backup: boolean): Promise<boolean>;

  /**
   * Retrieves system information.
   * @returns {Promise<SystemInfo>} - The system information.
   */
  abstract getSystemInfo(): Promise<SystemInfo>;

  async executeCode(
      code: string,
      language: string,
      timeout?: number,
      directory?: string
  ): Promise<ExecutionResult> {
      throw new Error('executeCode method not implemented in AbstractServerHandler');
  }

  abstract executeFile(
    filename: string, 
    directory?: string, 
    timeout?: number
  ): Promise<ExecutionResult>;

}
