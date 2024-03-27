import fs from 'fs/promises';
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
  private commandExecutor: SSHCommandExecutor;
  private fileOperations: SSHFileOperations;
  private systemInfoRetriever: SSHSystemInfoRetriever;

  constructor(serverConfig: ServerConfig) {
      super(serverConfig);
      debug(`Initializing SshServerHandler with serverConfig: ${JSON.stringify(serverConfig, null, 2)}`);
      this.commandExecutor = new SSHCommandExecutor(this.conn, serverConfig);
      this.fileOperations = new SSHFileOperations(this.conn, serverConfig);
      this.systemInfoRetriever = new SSHSystemInfoRetriever(this.conn, serverConfig);
  }

  async initialize(): Promise<void> {
      debug(`Attempting to initialize SSH connection with configuration: ${JSON.stringify(this.serverConfig)}`);
      const privateKeyPath = this.serverConfig.privateKeyPath ?? path.join(os.homedir(), '.ssh', 'id_rsa');
      try {
          const privateKey = await fs.readFile(privateKeyPath);
          this.conn.on('ready', () => {
              debug('SSH Client is ready. Connection established successfully.');
          }).on('error', (err) => {
              debug(`SSH Client error: ${err.message}`);
          }).connect({
              host: this.serverConfig.host,
              port: this.serverConfig.port ?? 22,
              username: this.serverConfig.username,
              privateKey: privateKey,
          });

          await new Promise<void>((resolve, reject) => {
              this.conn.on('ready', () => {
                debug('SSH Client ready event triggered.');
                resolve();
              });
              this.conn.on('error', (err) => {
                debug(`SSH Client error event triggered: ${err.message}`);
                reject(err);
              });
          });
      } catch (error) {
          debug(`Error during SSH connection initialization: ${error}`);
          throw new Error('Failed to initialize SSH connection due to an error.');
      }
  }

  async executeCommand(command: string, timeout: number = 60000, directory?: string): Promise<{ stdout: string; stderr: string }> {
    debug(`Executing command: ${command}, Timeout: ${timeout}, Directory: ${directory}`);
    const options = { cwd: directory, timeout };
    
    const executionResult = await this.commandExecutor.executeCommand(command, options);
  
    if ('timeout' in executionResult && executionResult.timeout) {
      debug('Command execution timed out.');
    }
  
    return { stdout: executionResult.stdout, stderr: executionResult.stderr };
  }

  async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<string[]> {
    debug(`Listing files in directory: ${directory}, Limit: ${limit}, Offset: ${offset}, OrderBy: ${orderBy}`);
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const allFiles = await this.fileOperations.listFiles(directory);
      debug(`Files listed successfully in directory: ${directory}`);

      let orderedFiles = allFiles;
      if (orderBy === "datetime") {
        debug('Ordering by datetime not implemented yet.');
      } else {
        orderedFiles.sort();
        debug('Files sorted by filename.');
      }

      const slicedFiles = orderedFiles.slice(offset, offset + limit);
      debug(`Files sliced according to limit and offset. Count: ${slicedFiles.length}`);
      return slicedFiles;
    } catch (error) {
      debug(`Error listing files in ${directory}: ${error}`);
      throw new Error('Failed to list files.');
    }
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    debug(`Attempting to create file: ${filename} in directory: ${directory} with backup: ${backup}`);
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
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
    debug(`Attempting to read file: ${remotePath}`);
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
      throw new Error("SSHFileOperations is not initialized.");
    }
  
    try {
      const content = await this.fileOperations.readFile(remotePath);
      debug(`File ${remotePath} read successfully.`);
      return content.toString(); // Convert Buffer to string before returning
    } catch (error) {
      debug(`Error reading file ${remotePath}: ${error}`);
      throw new Error('Failed to read file.');
    }
  }
  
  public async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = false): Promise<boolean> {
    debug(`Attempting to update file: ${filePath} with pattern: ${pattern} and replacement: ${replacement}, backup: ${backup}`);
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const content = Buffer.isBuffer(replacement) ? replacement : Buffer.from(replacement);
      await this.fileOperations.updateFile(filePath, content, backup);
      debug(`File ${filePath} updated successfully.`);
      return true; // Indicate success
    } catch (error) {
      debug(`Error updating file ${filePath}: ${error}`);
      return false; // Indicate failure
    }
  }

  async deleteFile(remotePath: string): Promise<void> {
    debug(`Attempting to delete file: ${remotePath}`);
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
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
    debug(`Checking if file exists: ${remotePath}`);
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized. Throwing error.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const exists = await this.fileOperations.fileExists(remotePath);
      debug(`File exists check for ${remotePath}: ${exists}`);
      return exists;
    } catch (error) {
      debug(`Error checking if file ${remotePath} exists: ${error}`);
      throw new Error('Failed to check if file exists.');
    }
  }

  async getSystemInfo(): Promise<SystemInfo> {
    debug('Attempting to retrieve system information.');
    if (!this.systemInfoRetriever) {
      debug('SSHSystemInfoRetriever not initialized. Throwing error.');
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
}
     
