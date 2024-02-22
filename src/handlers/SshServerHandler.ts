import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import { Client } from 'ssh2';
import SSHCommandExecutor from '../utils/SSHCommandExecutor';
import SSHFileOperations from '../utils/SSHFileOperations';
import SSHSystemInfoRetriever from '../utils/SSHSystemInfoRetriever';
import Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';

const debug = Debug('app:SshServerHandler');

export default class SshServerHandler extends ServerHandler {
  private conn: Client;
  private commandExecutor: SSHCommandExecutor;
  private fileOperations: SSHFileOperations;
  private systemInfoRetriever: SSHSystemInfoRetriever;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.conn = new Client();
    this.conn.on('ready', () => {
      debug('SSH Client Ready');
      this.setupUtilityClasses();
    }).on('error', (error) => debug(`SSH Client Error: ${error}`))
    .connect({
      host: serverConfig.host,
      port: serverConfig.port || 22,
      username: serverConfig.username,
      privateKey: fs.readFileSync(serverConfig.privateKeyPath || path.join(process.env.HOME || '', '.ssh', 'id_rsa')),
    });
  }

  private setupUtilityClasses(): void {
    this.commandExecutor = new SSHCommandExecutor(this.conn);
    this.fileOperations = new SSHFileOperations(this.conn);
    this.systemInfoRetriever = new SSHSystemInfoRetriever(this.serverConfig, this.conn);
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    return this.commandExecutor.executeCommand(command, { cwd: directory, timeout });
  }

  async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<string[]> {
    // This method would need to be updated if specific listing functionality is added to SSHFileOperations
    throw new Error("listFiles method not implemented in SSHFileOperations");
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    return this.fileOperations.createFile(path.join(directory, filename), Buffer.from(content), backup);
  }

  async readFile(remotePath: string): Promise<string> {
    return this.fileOperations.readFile(remotePath);
  }

  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
    // The original abstract method signature requires pattern and replacement, which SSHFileOperations does not support directly.
    // This would require implementing or adjusting the method to perform the desired text replacement, possibly through command execution.
    throw new Error("updateFile method needs to be implemented to support pattern replacement.");
  }


  async deleteFile(remotePath: string): Promise<boolean> {
    return this.fileOperations.deleteFile(remotePath);
  }

  async fileExists(remotePath: string): Promise<boolean> {
    // Implementation depends on whether SSHFileOperations includes a fileExists method
    throw new Error("fileExists method not implemented in SSHFileOperations");
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return this.systemInfoRetriever.getSystemInfo();
  }

  async amendFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
    // This functionality needs to be implemented in utility classes if it's specific.
    throw new Error("amendFile method not implemented in utility classes");
  }
}
