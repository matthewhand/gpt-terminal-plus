import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import { Client } from 'ssh2';
import SSHCommandExecutor from '../utils/SSHCommandExecutor';
import SSHFileOperations from '../utils/SSHFileOperations';
import SSHSystemInfoRetriever from '../utils/SSHSystemInfoRetriever';
import Debug from 'debug';
import fs from 'fs';
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
    this.initializeSSHConnections(serverConfig);
  }

  private initializeSSHConnections(serverConfig: ServerConfig): void {
    const privateKeyPath = serverConfig.privateKeyPath ?? path.join(process.env.HOME || '', '.ssh', 'id_rsa');
    debug(`Private key path resolved to: ${privateKeyPath}`);

    try {
      const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
      this.conn.on('ready', () => {
        debug('SSH Client Ready. Initializing components with server configuration...');
        this.commandExecutor = new SSHCommandExecutor(this.conn, serverConfig);
        this.fileOperations = new SSHFileOperations(this.conn, serverConfig);
        this.systemInfoRetriever = new SSHSystemInfoRetriever(this.conn, serverConfig);
        debug('SSHCommandExecutor, SSHFileOperations, and SSHSystemInfoRetriever initialized.');
      })
      .on('error', (error) => {
        debug(`SSH Client Error: ${error}`);
      })
      .on('close', () => {
        debug('SSH connection closed.');
      })
      .on('end', () => {
        debug('SSH connection ended.');
      });

      this.conn.connect({
        host: serverConfig.host,
        port: serverConfig.port ?? 22,
        username: serverConfig.username,
        privateKey: privateKey,
      });
    } catch (error) {
      debug(`Error initializing SSH connections: ${error}`);
      throw new Error('Failed to initialize SSH connections due to an error reading the private key.');
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
      await this.fileOperations.createFile(path.join(directory, filename), content, backup);
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
      debug(`File ${remotePath} read successfully.`);
      return content;
    } catch (error) {
      debug(`Error reading file ${remotePath}: ${error}`);
      throw new Error('Failed to read file.');
    }
  }

  async updateFile(remotePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }
  
    try {
      await this.fileOperations.updateFile(remotePath, pattern, replacement, backup);
      debug(`File ${remotePath} updated successfully.`);
      return true; // Indicate success
    } catch (error) {
      debug(`Error updating file ${remotePath}: ${error}`);
      throw new Error('Failed to update file.');
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

  async amendFile(filePath: string, content: string, backup: boolean = true): Promise<void> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      await this.fileOperations.amendFile(filePath, content, backup);
      debug(`File ${filePath} amended successfully.`);
    } catch (error) {
      debug(`Error amending file ${filePath}: ${error}`);
      throw new Error('Failed to amend file.');
    }
  }

  async executeCommand(command: string, timeout: number = 60000, directory?: string): Promise<{ stdout: string; stderr: string }> {
    if (!this.commandExecutor) {
      debug('SSHCommandExecutor not initialized.');
      throw new Error("SSHCommandExecutor is not initialized.");
    }

    try {
      const { stdout, stderr } = await this.commandExecutor.executeCommand(command, { cwd: directory, timeout });
      debug(`Command executed successfully: ${command}`);
      return { stdout, stderr };
    } catch (error) {
      debug(`Error executing command ${command}: ${error}`);
      throw new Error('Failed to execute command.');
    }
  }
}
