import fs from 'fs/promises'; // Use the promise-based version of fs
import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import { Client } from 'ssh2';
import SSHCommandExecutor from '../utils/SSHCommandExecutor';
import SSHFileOperations from '../utils/SSHFileOperations';
import SSHSystemInfoRetriever from '../utils/SSHSystemInfoRetriever';
import Debug from 'debug';
import path from 'path';
import os from 'os';

const debug = Debug('app:SshServerHandler');

export default class SshServerHandler extends ServerHandler {
  private conn: Client = new Client();
  private commandExecutor?: SSHCommandExecutor;
  private fileOperations?: SSHFileOperations;
  private systemInfoRetriever?: SSHSystemInfoRetriever;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    debug(`Initializing SshServerHandler with serverConfig: ${JSON.stringify(serverConfig, null, 2)}`);
    this.initializeSSHConnections(serverConfig);
  }

  private async initializeSSHConnections(serverConfig: ServerConfig): Promise<void> {
    const privateKeyPath = serverConfig.privateKeyPath ?? path.join(os.homedir(), '.ssh', 'id_rsa');
    debug(`Private key path resolved to: ${privateKeyPath}`);
  
    try {
      // Reading the private key as a string might be incorrect if your SSH client expects a Buffer.
      const privateKey = await fs.readFile(privateKeyPath); // This returns a Buffer by default
      this.conn.on('ready', () => {
        debug('SSH Client Ready. Initializing components with server configuration...');

        this.commandExecutor = new SSHCommandExecutor(this.conn, serverConfig);
        this.fileOperations = new SSHFileOperations(this.conn, serverConfig);
        this.systemInfoRetriever = new SSHSystemInfoRetriever(this.conn, serverConfig);
        
        })
      .connect({
        host: serverConfig.host,
        port: serverConfig.port ?? 22,
        username: serverConfig.username,
        privateKey: privateKey.toString('utf8'), // Convert to string if necessary
      });
    } catch (error) {
      debug(`Error during SSH connection initialization: ${error}`);
      throw new Error('Failed to initialize SSH connections due to an error.');
    }
  }

  // Updated listFiles method
  async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<string[]> {
    debug(`Listing files in directory: ${directory}, limit: ${limit}, offset: ${offset}, orderBy: ${orderBy}`);
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const allFiles = await this.fileOperations.listFiles(directory);

      // Placeholder for orderBy implementation, assuming allFiles is an array of filenames
      let orderedFiles = allFiles;
      if (orderBy === "datetime") {
        // Implement sorting by datetime if metadata available
        debug('Ordering by datetime not implemented.');
      } else {
        orderedFiles = allFiles.sort();
      }

      const slicedFiles = orderedFiles.slice(offset, offset + limit);
      return slicedFiles;
    } catch (error) {
      debug(`Error listing files in ${directory}: ${error}`);
      throw new Error('Failed to list files.');
    }
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }
  
    try {
      await this.fileOperations.createFile(path.join(directory, filename), Buffer.from(content), backup);
      debug(`File ${filename} created successfully in ${directory}.`);
      return true; // Return true to indicate success
    } catch (error) {
      debug(`Error creating file ${filename} in ${directory}: ${error}`);
      throw new Error('Failed to create file.');
    }
  }
  
  async readFile(remotePath: string): Promise<string> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }
  
    try {
      const content = await this.fileOperations.readFile(remotePath);
      return content.toString(); // Convert Buffer to string before returning
    } catch (error) {
      debug(`Error reading file ${remotePath}: ${error}`);
      throw new Error('Failed to read file.');
    }
  }
  
  public async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = false): Promise<boolean> {
    if (!this.fileOperations) {
        debug('SSHFileOperations not initialized.');
        throw new Error("SSHFileOperations is not initialized.");
    }

    // Assuming the `pattern` isn't used and the entire content is replaced by `replacement`.
    // Adjust the logic if you need to use `pattern` for a more complex operation.
    try {
        // Convert `replacement` to a Buffer if it's a string.
        const content = Buffer.isBuffer(replacement) ? replacement : Buffer.from(replacement);
        await this.fileOperations.updateFile(filePath, content, backup);
        return true; // Indicate success
    } catch (error) {
        debug(`Error updating file ${filePath}: ${error}`);
        return false; // Indicate failure
    }
}


  
  // Continue with other methods such as deleteFile, fileExists, getSystemInfo, and amendFile.
  async deleteFile(remotePath: string): Promise<void> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      await this.fileOperations.deleteFile(remotePath);
      debug(`File ${remotePath} deleted successfully.`);
    } catch (error) {
      debug(`Error deleting file ${remotePath}: ${error}`);
      throw new Error('Failed to delete file.');
    }
  }

  async fileExists(remotePath: string): Promise<boolean> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const exists = await this.fileOperations.fileExists(remotePath);
      debug(`File ${remotePath} exists check: ${exists}`);
      return exists;
    } catch (error) {
      debug(`Error checking if file ${remotePath} exists: ${error}`);
      throw new Error('Failed to check if file exists.');
    }
  }

  async getSystemInfo(): Promise<SystemInfo> {
    if (!this.systemInfoRetriever) {
      debug('SSHSystemInfoRetriever not initialized.');
      throw new Error("SSHSystemInfoRetriever is not initialized.");
    }

    try {
      const systemInfo = await this.systemInfoRetriever.getSystemInfo();
      debug('System information retrieved successfully:', systemInfo);
      return systemInfo;
    } catch (error) {
      debug('Error retrieving system information:', error);
      throw new Error('Failed to retrieve system information.');
    }
  }

  // async amendFile(filePath: string, content: string, backup: boolean = true): Promise<void> {
  //   if (!this.fileOperations) {
  //     debug('SSHFileOperations not initialized.');
  //     throw new Error("SSHFileOperations is not initialized.");
  //   }

  //   try {
  //     await this.fileOperations.amendFile(filePath, content, backup);
  //     debug(`File ${filePath} amended successfully.`);
  //   } catch (error) {
  //     debug(`Error amending file ${filePath}: ${error}`);
  //     throw new Error('Failed to amend file.');
  //   }
  // }

  async executeCommand(command: string, timeout: number = 60000, directory?: string): Promise<{ stdout: string; stderr: string }> {
    if (!this.commandExecutor) {
      debug('SSHCommandExecutor not initialized.');
      throw new Error("SSHCommandExecutor is not initialized.");
    }
  
    // Ensuring directory is only included if provided, to match expected type structure.
    const execOptions: { cwd?: string; timeout: number } = { timeout };
    if (directory) {
      execOptions.cwd = directory;
    }
  
    try {
      // Adjusted for potential correction in command execution logic
      const { stdout, stderr } = await this.commandExecutor.executeCommand(command, execOptions);
      debug(`Command executed successfully: ${command}`);
      return { stdout, stderr };
    } catch (error) {
      debug(`Error executing command ${command}: ${error}`);
      throw new Error('Failed to execute command.');
    }
  }
}
