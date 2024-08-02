import { AbstractServerHandler } from '../AbstractServerHandler';
import { executeCommand } from './actions/executeCommand';
import { getSystemInfo } from './actions/getSystemInfo';
import { amendFile } from './actions/amendFile';
import { createFile } from './actions/createFile';
import { listFiles } from './actions/listFiles';
import { updateFile } from './actions/updateFile';
import { setSelectedServer, changeDirectory, presentWorkingDirectory } from '../../utils/GlobalStateHelper';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { SsmTargetConfig } from '../../types/ServerConfig';
import debug from 'debug';

const ssmServerDebug = debug('app:SsmServer');

class SsmServer extends AbstractServerHandler {
  private instanceId: string;
  private region: string;

  constructor(serverConfig: SsmTargetConfig) {
    super(serverConfig);
    this.instanceId = serverConfig.instanceId;
    this.region = serverConfig.region;
    setSelectedServer(serverConfig.host);
    ssmServerDebug(`Initialized SsmServer with config: ${JSON.stringify(serverConfig)}`);
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    ssmServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}, region: ${this.region}, instanceId: ${this.instanceId}`);
    return executeCommand(command, timeout, directory, this.region, this.instanceId);
  }

  async getSystemInfo(): Promise<SystemInfo> {
    ssmServerDebug(`Retrieving system info for region: ${this.region}, instanceId: ${this.instanceId}`);
    return getSystemInfo(this.region, this.instanceId);
  }

  async amendFile(filename: string, content: string, backup: boolean = true): Promise<boolean> {
    ssmServerDebug(`Amending file at filename: ${filename}, content: ${content}, backup: ${backup}, region: ${this.region}, instanceId: ${this.instanceId}`);
    return amendFile(filename, content, backup, this.region, this.instanceId);
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    ssmServerDebug(`Creating file in directory: ${directory}, filename: ${filename}, content: ${content}, backup: ${backup}, region: ${this.region}, instanceId: ${this.instanceId}`);
    return createFile(directory, filename, content, backup, this.region, this.instanceId);
  }

  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    ssmServerDebug(`Listing files with params: ${JSON.stringify(params)}, region: ${this.region}, instanceId: ${this.instanceId}`);
    return listFiles({ ...params, region: this.region, instanceId: this.instanceId });
  }

  async updateFile(filename: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    ssmServerDebug(`Updating file at filename: ${filename}, pattern: ${pattern}, replacement: ${replacement}, backup: ${backup}, region: ${this.region}, instanceId: ${this.instanceId}`);
    return updateFile(filename, pattern, replacement, backup, this.region, this.instanceId);
  }

  async changeDirectory(directory: string): Promise<boolean> {
    ssmServerDebug(`Changing directory to: ${directory}, region: ${this.region}, instanceId: ${this.instanceId}`);
    changeDirectory(directory);
    return true;
  }

  async presentWorkingDirectory(): Promise<string> {
    ssmServerDebug(`Retrieving present working directory, region: ${this.region}, instanceId: ${this.instanceId}`);
    const pwd = await presentWorkingDirectory();
    changeDirectory(pwd);
    return pwd;
  }
}

export default SsmServer;
