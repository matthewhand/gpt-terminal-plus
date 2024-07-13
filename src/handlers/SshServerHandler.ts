import { getCurrentFolder, setCurrentFolder } from '../utils/GlobalStateHelper';
import { createPaginatedResponse } from '../utils/PaginationUtils';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo, PaginatedResponse, ServerHandlerInterface } from '../types/index';
import { Client } from 'ssh2';
import SSHCommandExecutor from '../utils/SSHCommandExecutor';
import SSHFileOperations from '../utils/SSHFileOperations';
import SSHSystemInfoRetriever from '../utils/SSHSystemInfoRetriever';
import Debug from 'debug';
import path from 'path';

const debug = Debug('app:SshServerHandler');

/**
 * The SshServerHandler class encapsulates the management of SSH connections to remote servers,
 * offering a comprehensive suite of functionalities to execute commands, manage files, and retrieve
 * system information. It leverages the SSH2 library for establishing secure shell connections, providing
 * a high-level API for interacting with remote servers. This class is designed with a focus on ease of use,
 * security, and extensibility, making it a valuable tool for applications that require remote server management
 * capabilities.
 */
export default class SshServerHandler extends ServerHandler implements ServerHandlerInterface {
  private static instances: Record<string, SshServerHandler> = {};
  private _commandExecutor: SSHCommandExecutor | null = null;
  private _fileOperations: SSHFileOperations | null = null;
  private _systemInfoRetriever: SSHSystemInfoRetriever | null = null;
  private conn: Client = new Client();

  public constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this._commandExecutor = new SSHCommandExecutor(this.conn, this.serverConfig);
    this._fileOperations = new SSHFileOperations(this.conn, this.serverConfig);
    this._systemInfoRetriever = new SSHSystemInfoRetriever(this.conn, this.serverConfig);
  }

  /**
   * Singleton instance getter.
   * Ensures a single instance of SshServerHandler per server configuration.
   * @param serverConfig - The server configuration.
   * @returns A promise that resolves to the SshServerHandler instance.
   */
  public static async getInstance(serverConfig: ServerConfig): Promise<SshServerHandler> {
    const identifier = `${serverConfig.host}:${serverConfig.port}`;
    if (!this.instances[identifier]) {
      const instance = new SshServerHandler(serverConfig);
      this.instances[identifier] = instance;
    }
    return this.instances[identifier];
  }

  /**
   * Executes a command on the remote server.
   * @param command - The command to execute.
   * @param timeout - Optional timeout for the command execution.
   * @returns The command's stdout and stderr output.
   */
  public async executeCommand(command: string, timeout: number = 60000): Promise<{ stdout: string; stderr: string }> {
    debug(`Preparing to execute command: ${command} with timeout: ${timeout}`);

    if (!this._commandExecutor) {
      const error = new Error('SSHCommandExecutor is not initialized.');
      debug(`Execution attempt failed: ${error.message}`);
      throw error;
    }

    try {
      const result = await this._commandExecutor.executeCommand(command, { timeout });
      debug(`Command executed successfully. Command: ${command}, Result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      const errorMessage = `Error executing command: "${command}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      debug(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Lists files in a specified directory on the remote server.
   * @param directory - The directory to list files in.
   * @param limit - Maximum number of files to return.
   * @param offset - Number of files to skip before starting to collect the result set.
   * @param orderBy - Criteria to order files by.
   * @returns A paginated response containing files in the directory.
   */
  async listFiles(directory: string = '', limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<PaginatedResponse> {
    const targetDirectory = directory || getCurrentFolder();
    debug(`Listing files in directory: ${targetDirectory}, Limit: ${limit}, Offset: ${offset}, OrderBy: ${orderBy}`);

    if (!this._fileOperations) {
      const error = new Error("SSHFileOperations is not initialized.");
      debug(`Listing files failed: ${error.message}`);
      throw error;
    }

    try {
      const allFiles = await this._fileOperations.listFiles(targetDirectory);
      debug(`Files listed successfully in directory: ${targetDirectory}. Total files: ${allFiles.length}`);

      const orderedFiles = [...allFiles];
      if (orderBy === "datetime") {
        debug('Ordering by datetime not implemented yet. Defaulting to filename sorting.');
        orderedFiles.sort(); 
      } else {
        orderedFiles.sort();
      }

      const paginatedResponse = createPaginatedResponse(orderedFiles, limit, offset);
      debug(`Files paginated according to limit and offset. Returned files count: ${paginatedResponse.items.length}`);

      setCurrentFolder(targetDirectory);
      return paginatedResponse;
    } catch (error) {
      debug(`Error listing files in ${targetDirectory}: ${error}`);
      throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async amendFile(filePath: string, content: string, backup: boolean = false): Promise<boolean> {
    throw new Error("This operation is not supported by the current server handler.");
  }

  /**
   * Creates a file in the specified directory on the remote server.
   * @param directory - The directory to create the file in.
   * @param filename - The name of the file to create.
   * @param content - The content to write to the file.
   * @param backup - Whether to create a backup of the file if it exists.
   * @returns True if the file is created successfully.
   */
  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    debug(`Attempting to create file: ${filename} in directory: ${directory} with backup: ${backup}`);
    if (!this._fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      await this._fileOperations.createFile(path.join(directory, filename), Buffer.from(content), backup);
      debug(`File ${filename} created successfully in ${directory}.`);
      return true; // Return true to indicate success
    } catch (error) {
      debug(`Error creating file ${filename} in ${directory}: ${error}`);
      throw new Error('Failed to create file.');
    }
  }

  /**
   * Reads the content of a specified file from the remote server.
   * @param filePath - The path of the file to read.
   * @returns The content of the file as a string.
   */
  async readFile(filePath: string): Promise<string> {
    const fullFilePath = path.isAbsolute(filePath) ? filePath : path.join(getCurrentFolder(), filePath);
    debug(`Attempting to read file: ${fullFilePath}`);

    if (!this._fileOperations) {
      const error = new Error("SSHFileOperations is not initialized.");
      debug(error.message);
      throw error;
    }

    try {
      const content = await this._fileOperations.readFile(fullFilePath);
      debug(`File ${fullFilePath} read successfully.`);
      return content.toString(); // Ensuring the returned value is a string
    } catch (error) {
      debug(`Error reading file ${fullFilePath}: ${error}`);
      throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Updates a file on the remote server by replacing a pattern with a replacement string.
   * @param filePath - The path of the file to update.
   * @param pattern - The pattern to replace.
   * @param replacement - The replacement string.
   * @param backup - Whether to create a backup of the file before updating.
   * @returns True if the file is updated successfully.
   */
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = false): Promise<boolean> {
    debug(`Attempting to update file: ${filePath} with pattern: ${pattern} and replacement: ${replacement}, backup: ${backup}`);
    if (!this._fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const content = Buffer.isBuffer(replacement) ? replacement : Buffer.from(replacement);
      await this._fileOperations.updateFile(filePath, content, backup);
      debug(`File ${filePath} updated successfully.`);
      return true; // Indicate success
    } catch (error) {
      debug(`Error updating file ${filePath}: ${error}`);
      return false; // Indicate failure
    }
  }

  /**
   * Deletes a specified file from the remote server.
   * @param remotePath - The path of the file to delete.
   */
  async deleteFile(remotePath: string): Promise<void> {
    debug(`Attempting to delete file: ${remotePath}`);
    if (!this._fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      await this._fileOperations.deleteFile(remotePath);
      debug(`File ${remotePath} deleted successfully.`);
    } catch (error) {
      debug(`Error deleting file ${remotePath}: ${error}`);
      throw new Error('Failed to delete file.');
    }
  }

  /**
   * Checks whether a specified file exists on the remote server.
   * @param remotePath - The path of the file to check.
   * @returns True if the file exists, false otherwise.
   */
  async fileExists(remotePath: string): Promise<boolean> {
    debug(`Checking if file exists: ${remotePath}`);
    if (!this._fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const exists = await this._fileOperations.fileExists(remotePath);
      debug(`File exists check for ${remotePath}: ${exists}`);
      return exists;
    } catch (error) {
      debug(`Error checking if file ${remotePath} exists: ${error}`);
      throw new Error('Failed to check if file exists.');
    }
  }

  /**
   * Retrieves detailed system information from the remote server.
   * @returns A promise that resolves to the system information.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    debug('Attempting to retrieve system information.');
    // Check if _systemInfoRetriever is initialized
    if (!this._systemInfoRetriever) {
      debug('SSHSystemInfoRetriever not initialized.');
      // Return a default SystemInfo object indicating unavailability
      return {
        homeFolder: 'N/A',
        type: 'N/A',
        release: 'N/A',
        platform: 'N/A',
        architecture: 'N/A',
        totalMemory: 0,
        freeMemory: 0,
        uptime: 0,
        currentFolder: 'N/A',
        // Include other fields as necessary with placeholder values
      };
    }

    try {
      const systemInfo = await this._systemInfoRetriever.getSystemInfo();
      debug('System information retrieved successfully:', systemInfo);
      return systemInfo;
    } catch (error) {
      debug('Error retrieving system information:', error);
      // Return the default SystemInfo object on error as well
      return {
        homeFolder: 'N/A',
        type: 'N/A',
        release: 'N/A',
        platform: 'N/A',
        architecture: 'N/A',
        totalMemory: 0,
        freeMemory: 0,
        uptime: 0,
        currentFolder: 'N/A',
        // Include other fields as necessary with placeholder values
      };
    }
  }
}
