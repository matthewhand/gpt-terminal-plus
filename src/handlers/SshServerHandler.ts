/**
 * The SshServerHandler class encapsulates the management of SSH connections to remote servers,
 * offering a comprehensive suite of functionalities to execute commands, manage files, and retrieve
 * system information. It leverages the SSH2 library for establishing secure shell connections, providing
 * a high-level API for interacting with remote servers. This class is designed with a focus on ease of use,
 * security, and extensibility, making it a valuable tool for applications that require remote server management
 * capabilities.
 *
 * Key Components:
 * - SSHCommandExecutor: Facilitates the execution of commands on the remote server. This component is responsible
 *   for sending commands over the SSH connection and capturing the output, handling both stdout and stderr streams.
 *
 * - SSHFileOperations: Provides a set of methods for performing file operations on the remote server. This includes
 *   creating, reading, updating, and deleting files, as well as checking for their existence and listing directory contents.
 *   It uses the SFTP protocol for secure file transfer between the local and remote systems.
 *
 * - SSHSystemInfoRetriever: Executes specific commands on the remote server to gather system information such as OS type,
 *   architecture, memory usage, and more. The retrieved information is parsed and returned in a structured format.
 *
 * Core Methods:
 * - getInstance(serverConfig): A static method that ensures a singleton instance of SshServerHandler per server configuration.
 *   This approach prevents multiple connections to the same server, conserving resources and simplifying connection management.
 *
 * - executeCommand(command, timeout): Executes the specified command on the remote server. It allows for setting a custom
 *   execution timeout and handles command execution asynchronously, returning a promise that resolves with the command's output.
 *
 * - createFile(directory, filename, content, backup): Creates or replaces a file on the remote server with the provided content.
 *   It supports optional file backup before overwrite operations, enhancing data safety.
 *
 * - readFile(filePath): Reads the content of a specified file from the remote server, returning the file's contents as a string.
 *
 * - updateFile(filePath, pattern, replacement, backup): Updates a file on the remote server by replacing specified patterns
 *   within the file's content. Similar to createFile, it supports backing up the original file.
 *
 * - deleteFile(remotePath): Deletes a specified file from the remote server, ensuring that file management capabilities
 *   are comprehensive and aligned with common file operation needs.
 *
 * - fileExists(remotePath): Checks whether a specified file exists on the remote server, returning a boolean to indicate
 *   the existence of the file.
 *
 * - getSystemInfo(): Retrieves detailed system information from the remote server, including OS details, memory usage,
 *   and uptime. This method is crucial for applications that require insights into the server's state and configuration.
 *
 * This class abstracts the complexity of SSH and SFTP interactions into a coherent and easy-to-use interface, making it
 * a cornerstone for building robust applications that manage or interact with remote servers over SSH.
 */


import { getCurrentFolder, setCurrentFolder } from '../utils/GlobalStateHelper';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import { Client } from 'ssh2';
import SSHCommandExecutor from '../utils/SSHCommandExecutor';
import SSHFileOperations from '../utils/SSHFileOperations';
import SSHSystemInfoRetriever from '../utils/SSHSystemInfoRetriever';
import Debug from 'debug';
import path from 'path';

const debug = Debug('app:SshServerHandler');

export default class SshServerHandler extends ServerHandler {
  private static instances: Record<string, SshServerHandler> = {};
  private _commandExecutor: SSHCommandExecutor | null = null;
  private _fileOperations: SSHFileOperations | null = null;
  private _systemInfoRetriever: SSHSystemInfoRetriever | null = null;
  private conn: Client = new Client();

  public constructor(serverConfig: ServerConfig) {
      super(serverConfig);
      this._commandExecutor = new SSHCommandExecutor(this.conn, this.serverConfig);
      // Initialize the file operations and system info retriever here
      this._fileOperations = new SSHFileOperations(this.conn, this.serverConfig);
      this._systemInfoRetriever = new SSHSystemInfoRetriever(this.conn, this.serverConfig);
  }


    // Singleton instance getter
    // Adjusted getInstance to support parameterized instantiation
    public static async getInstance(serverConfig: ServerConfig): Promise<SshServerHandler> {
      const identifier = `${serverConfig.host}:${serverConfig.port}`;
      if (!this.instances[identifier]) {
          const instance = new SshServerHandler(serverConfig);
          this.instances[identifier] = instance;
      }
      return this.instances[identifier];
  }

// Updated executeCommand method with enhanced error handling and debugging
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

    async listFiles(directory: string = '', limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<string[]> {
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
                orderedFiles.sort(); // Placeholder for future implementation
            } else {
                orderedFiles.sort(); // Assuming it sorts by filename for now
            }
    
            const slicedFiles = orderedFiles.slice(offset, offset + limit);
            debug(`Files sliced according to limit and offset. Returned files count: ${slicedFiles.length}`);
    
            // Optionally update the current folder in the global state
            setCurrentFolder(targetDirectory);
            return slicedFiles;
        } catch (error) {
            debug(`Error listing files in ${targetDirectory}: ${error}`);
            throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    
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
  
  async readFile(filePath: string): Promise<string> {
    const fullFilePath = path.isAbsolute(filePath) ? filePath : path.join(getCurrentFolder(), filePath);
    debug(`Attempting to read file: ${fullFilePath}`);

    if (!this._fileOperations) {
        const error = new Error("SSHFileOperations is not initialized.");
        debug(error.message);
        throw error;
    }

    try {
        const content = await this._fileOperations.readFile(fullFilePath); // Corrected line
        debug(`File ${fullFilePath} read successfully.`);
        return content.toString(); // Ensuring the returned value is a string
    } catch (error) {
        debug(`Error reading file ${fullFilePath}: ${error}`);
        throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}  
    public async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = false): Promise<boolean> {
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
