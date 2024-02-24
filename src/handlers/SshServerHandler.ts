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
  private commandExecutor?: SSHCommandExecutor;
  private fileOperations?: SSHFileOperations;
  private systemInfoRetriever?: SSHSystemInfoRetriever;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    debug(`Initializing SshServerHandler with serverConfig: ${JSON.stringify(serverConfig, null, 2)}`);
    this.initializeSSHConnections(serverConfig);
  }

  private initializeSSHConnections(serverConfig: ServerConfig): void {
    // Ensuring the privateKey is read correctly based on the provided path or default path
    const privateKeyPath = serverConfig.privateKeyPath ?? path.join(process.env.HOME || '', '.ssh', 'id_rsa');
    debug(`Private key path resolved to: ${privateKeyPath}`);

    try {
      const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
      debug(`Private key successfully read from ${privateKeyPath}`);

      this.conn.on('ready', () => {
        debug('SSH Client Ready. Initializing components with server configuration...');
        
        this.commandExecutor = new SSHCommandExecutor(this.conn, serverConfig);
        debug('SSHCommandExecutor initialized.');

        this.fileOperations = new SSHFileOperations(this.conn, serverConfig);
        debug('SSHFileOperations initialized.');

        this.systemInfoRetriever = new SSHSystemInfoRetriever(this.conn, serverConfig);
        debug('SSHSystemInfoRetriever initialized.');
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

      debug(`Attempting to connect to SSH server with the following configuration: Host: ${serverConfig.host}, Port: ${serverConfig.port ?? 22}, Username: ${serverConfig.username}`);
      
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

  async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<string[]> {
    if (!this.fileOperations) throw new Error("SSHFileOperations is not initialized.");
  
    // Fetch all files from the directory
    const allFiles = await this.fileOperations.listFiles(directory);
  
    // Apply ordering
    const orderedFiles = orderBy === "filename" ? 
                         allFiles.sort() : 
                         // If you had file metadata with datetime, you would sort based on it
                         allFiles; // Placeholder, as sorting by datetime requires additional metadata
  
    // Apply limit and offset
    const slicedFiles = orderedFiles.slice(offset, offset + limit);
  
    return slicedFiles;
  }
  
  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    if (!this.fileOperations) throw new Error("SSHFileOperations is not initialized.");
    await this.fileOperations.createFile(path.join(directory, filename), Buffer.from(content), backup);
    return true;
  }

  async readFile(remotePath: string): Promise<string> {
    if (!this.fileOperations) throw new Error("SSHFileOperations is not initialized.");
    const buffer = await this.fileOperations.readFile(remotePath);
    return buffer.toString('utf8');
  }

  async updateFile(remotePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    if (!this.fileOperations) throw new Error("SSHFileOperations is not initialized.");
    
    const sftp = await this.fileOperations.connectSFTP();
    try {
      if (backup) await this.backupFile(remotePath); 

        const tempDirPath = path.join(os.tmpdir(), 'ssh-updates');
        const tempFilePath = path.join(tempDirPath, path.basename(remotePath));

        // Ensure temp directory exists
        if (!fs.existsSync(tempDirPath)) fs.mkdirSync(tempDirPath);

        // Download the file to a temporary location
        await sftp.fastGet(remotePath, tempFilePath);

        // Apply the replacement
        let content = fs.readFileSync(tempFilePath, 'utf8');
        content = content.replace(new RegExp(pattern, 'g'), replacement);

        // Write the updated content back to the temp file
        fs.writeFileSync(tempFilePath, content, 'utf8');

        // Upload the updated file
        await sftp.fastPut(tempFilePath, remotePath);

        // Cleanup: Delete the local temp file
        fs.unlinkSync(tempFilePath);
        return true;
    } catch (error) {
        debug(`Error updating file ${remotePath}: ${error}`);
        return false;
    } finally {
        await sftp.end();
    }
}

private async backupFile(remotePath: string): Promise<void> {
  if (!this.fileOperations) throw new Error("SSHFileOperations is not initialized.");

    const sftp = await this.fileOperations.connectSFTP();
    const backupPath = `${remotePath}.${Date.now()}.bak`;

    // Check if the original file exists
    const exists = await this.fileOperations.fileExists(remotePath); // Use remotePath
    if (exists) {
      // Rename the original file to create a backup
      await sftp.rename(remotePath, backupPath);
    }

    await sftp.end(); // Ensure the SFTP connection is closed after the operation
  }

  async deleteFile(remotePath: string): Promise<boolean> {
    if (!this.fileOperations) throw new Error("SSHFileOperations is not initialized.");
    await this.fileOperations.deleteFile(remotePath);
    return true;
  }

  async fileExists(remotePath: string): Promise<boolean> {
    if (!this.fileOperations) throw new Error("SSHFileOperations is not initialized.");
    return this.fileOperations.fileExists(remotePath);
  }

  async getSystemInfo(): Promise<SystemInfo> {
    if (!this.systemInfoRetriever) {
      // Instead of rejecting, log the error and return a default SystemInfo object
      debug('SSHSystemInfoRetriever is not initialized. Returning default system info.');
      return {
        homeFolder: '/',
        type: 'Unknown',
        release: 'N/A',
        platform: 'N/A',
        architecture: 'N/A',
        totalMemory: 0,
        freeMemory: 0,
        uptime: 0,
        currentFolder: '/',
      };
    }
    return this.systemInfoRetriever.getSystemInfo();
  }
  
  async amendFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
    if (!this.fileOperations) throw new Error("SSHFileOperations is not initialized.");
    await this.fileOperations.amendFile(filePath, Buffer.from(content), backup);
    return true;
  }

  // Example adjustment to SshServerHandler to match ServerHandler's abstract signature
  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    if (!this.commandExecutor) throw new Error("SSHCommandExecutor is not initialized.");
    // Example use of timeout, or you could ignore it if not relevant
    return this.commandExecutor.executeCommand(command, { cwd: directory });
  }
}
