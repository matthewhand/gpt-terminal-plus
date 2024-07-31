import { AbstractServerHandler } from '../AbstractServerHandler';
import { loadActions } from '../../utils/loadActions';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { SsmTargetConfig } from '../../types/ServerConfig';

const actions = loadActions(__dirname + '/actions');

class SsmServer extends AbstractServerHandler {
  instanceId: string;
  region: string;

  constructor(serverConfig: SsmTargetConfig) { 
    super(serverConfig);
    this.instanceId = serverConfig.instanceId;
    this.region = serverConfig.region;
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    return actions.executeCommand(command, timeout, directory, this.region, this.instanceId);
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return actions.getSystemInfo(this.region, this.instanceId);
  }

  async amendFile(filePath: string, content: string): Promise<boolean> {
    return actions.amendFile(filePath, content, this.region, this.instanceId);
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    return actions.createFile(directory, filename, content, backup, this.region, this.instanceId);
  }

  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    return actions.listFiles({ ...params, region: this.region, instanceId: this.instanceId });
  }

  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    return actions.updateFile(filePath, pattern, replacement, backup, this.region, this.instanceId);
  }

  async changeDirectory(directory: string): Promise<boolean> {
    return actions.changeDirectory(directory, this.region, this.instanceId);
  }

  async presentWorkingDirectory(): Promise<string> {
    return actions.presentWorkingDirectory(this.region, this.instanceId);
  }
}

export default SsmServer;
