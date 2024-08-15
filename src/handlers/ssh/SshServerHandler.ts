import { AbstractServerHandler } from '../AbstractServerHandler';
import { connect } from './actions/connect';
import { disconnect } from './actions/disconnect';
import { executeCommand } from './actions/executeCommand';
import { getSystemInfo } from './actions/getSystemInfo';
import { amendFile } from './actions/amendFile';
import { createFile } from './actions/createFile';
import { deleteFile } from './actions/deleteFile';
import { fileExists } from './actions/fileExists';
import { getFileContent } from './actions/getFileContent';
import { listFiles } from './actions/listFiles';
import { readFile } from './actions/readFile';
import { transferFile } from './actions/transferFile';
import { updateFile } from './actions/updateFile';
import { executeFile as executeRemoteFile } from './actions/executeFile'; 
import { setSelectedServer, changeDirectory, presentWorkingDirectory } from '../../utils/GlobalStateHelper';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { SshHostConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { Client } from 'ssh2';
import debug from 'debug';

const sshServerDebug = debug('app:SshServer');

class SshServer extends AbstractServerHandler {
  private sshClient: Client;
  private privateKeyPath: string;
  private port: number;
  private username: string;
  private host: string;

  constructor(serverConfig: SshHostConfig) {
    super(serverConfig);
    this.privateKeyPath = serverConfig.privateKeyPath;
    this.port = serverConfig.port ?? 22; // Provide a default value if port is undefined
    this.username = serverConfig.username;
    this.host = serverConfig.hostname;
    this.sshClient = new Client();
    setSelectedServer(serverConfig.hostname);
    sshServerDebug(`Initialized SshServer with config: ${JSON.stringify(serverConfig)}`);
  }

  async connect(): Promise<void> {
    this.sshClient = await connect({ hostname: this.host, port: this.port, username: this.username, privateKeyPath: this.privateKeyPath, protocol: 'ssh' });
  }

  async disconnect(): Promise<void> {
    await disconnect(this.sshClient);
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    sshServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);
    return executeCommand(this.sshClient, { hostname: this.host, port: this.port, username: this.username, privateKeyPath: this.privateKeyPath, protocol: 'ssh' }, command, { cwd: directory, timeout });
  }

  async getSystemInfo(): Promise<SystemInfo> {
    sshServerDebug('Retrieving system info');
    return getSystemInfo(this.sshClient, 'bash', 'path/to/system_info.sh');
  }

  async amendFile(filename: string, content: string, backup: boolean = true): Promise<boolean> {
    sshServerDebug(`Amending file at filename: ${filename}, content: ${content}, backup: ${backup}`);
    return amendFile(this.sshClient, filename, content);
  }

  async createFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
    sshServerDebug(`Creating filePath: ${filePath}, content: ${content}, backup: ${backup}`);
    return createFile(this.sshClient, `${filePath}`, content);
  }

  async deleteFile(filePath: string): Promise<void> {
    sshServerDebug(`Deleting file at path: ${filePath}`);
    return deleteFile(this.sshClient, filePath);
  }

  async fileExists(filePath: string): Promise<boolean> {
    sshServerDebug(`Checking if file exists at path: ${filePath}`);
    return fileExists(this.sshClient, { hostname: this.host, port: this.port, username: this.username, privateKeyPath: this.privateKeyPath, protocol: 'ssh' }, filePath);
  }

  async getFileContent(filePath: string): Promise<string> {
    sshServerDebug(`Getting content of file at path: ${filePath}`);
    return getFileContent(this.sshClient, { hostname: this.host, port: this.port, username: this.username, privateKeyPath: this.privateKeyPath, protocol: 'ssh' }, filePath);
  }

  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    sshServerDebug(`Listing files with params: ${JSON.stringify(params)}`);
    const files = await listFiles(this.sshClient, { hostname: this.host, port: this.port, username: this.username, privateKeyPath: this.privateKeyPath, protocol: 'ssh' }, params);
    return {
      items: files.map(name => ({ name, isDirectory: false })),
      limit: params.limit ?? 10,
      offset: params.offset ?? 0,
      total: files.length,
    };
  }

  async readFile(filePath: string): Promise<string> {
    sshServerDebug(`Reading file at path: ${filePath}`);
    return readFile(this.sshClient, { hostname: this.host, port: this.port, username: this.username, privateKeyPath: this.privateKeyPath, protocol: 'ssh' }, filePath);
  }

  async transferFile(localPath: string, remotePath: string, direction: 'upload' | 'download'): Promise<void> {
    sshServerDebug(`Transferring file ${direction} with localPath: ${localPath}, remotePath: ${remotePath}`);
    return transferFile(this.sshClient, { hostname: this.host, port: this.port, username: this.username, privateKeyPath: this.privateKeyPath, protocol: 'ssh' }, localPath, remotePath, direction);
  }

  async updateFile(filename: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    sshServerDebug(`Updating file at filename: ${filename}, pattern: ${pattern}, replacement: ${replacement}, backup: ${backup}`);
    return updateFile(this.sshClient, filename, pattern, replacement, backup);
  }

  async changeDirectory(directory: string): Promise<boolean> {
    sshServerDebug(`Changing directory to: ${directory}`);
    changeDirectory(directory);
    return true;
  }

  async presentWorkingDirectory(): Promise<string> {
    sshServerDebug('Retrieving present working directory');
    const pwd = await presentWorkingDirectory();
    changeDirectory(pwd);
    return pwd;
  }

  /**
   * Executes a file on the remote SSH server.
   * 
   * @param {string} filename - The name of the file to execute.
   * @param {string} [directory] - The directory where the file is located.
   * @param {number} [timeout] - Optional timeout for file execution.
   * @returns {Promise<ExecutionResult>} - A promise that resolves with the execution result.
   */
  async executeFile(
    filename: string,
    directory?: string,
    timeout?: number
  ): Promise<ExecutionResult> {
    if (!filename) {
      sshServerDebug(`No filename provided for execution.`);
      throw new Error('Filename is required for file execution.');
    }

    sshServerDebug(`Executing file: ${filename} on SSH server, directory: ${directory}, timeout: ${timeout}`);

    return executeRemoteFile(this.sshClient, filename, directory, timeout);
  }
}

export default SshServer;
