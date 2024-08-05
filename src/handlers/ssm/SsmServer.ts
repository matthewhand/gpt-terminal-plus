import { AbstractServerHandler } from '../AbstractServerHandler';
import { executeCommand, ExecuteCommandParams } from './actions/executeCommand';
import { getSystemInfo } from './actions/getSystemInfo';
import { amendFile } from './actions/amendFile';
import { createFile } from './actions/createFile';
import { listFiles } from './actions/listFiles';
import { updateFile } from './actions/updateFile';
import { setSelectedServer, changeDirectory, presentWorkingDirectory } from '../../utils/GlobalStateHelper';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { SsmTargetConfig } from '../../types/ServerConfig';
import { SSMClient } from '@aws-sdk/client-ssm';
import debug from 'debug';

const ssmServerDebug = debug('app:SsmServer');

const DEFAULT_SSM_DOCUMENT_NAME = process.env.SSM_DOCUMENT_NAME || 'AWS-RunShellScript';

class SsmServer extends AbstractServerHandler {
  private ssmClient: SSMClient;
  private instanceId: string;
  private region: string;

  constructor(serverConfig: SsmTargetConfig) {
    super(serverConfig);
    this.instanceId = serverConfig.instanceId;
    this.region = serverConfig.region;
    this.ssmClient = new SSMClient({ region: this.region });
    setSelectedServer(serverConfig.host);
    ssmServerDebug(`Initialized SsmServer with config: ${JSON.stringify(serverConfig)}`);
  }

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    ssmServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}, region: ${this.region}, instanceId: ${this.instanceId}`);
    const params: ExecuteCommandParams = {
      ssmClient: this.ssmClient,
      command,
      instanceId: this.instanceId,
      documentName: DEFAULT_SSM_DOCUMENT_NAME,
      timeout: timeout ?? 60,
      directory: directory ?? '',
    };
    const result = await executeCommand(params);
    return { stdout: result.stdout || '', stderr: result.stderr || '' };
  }

  async getSystemInfo(): Promise<SystemInfo> {
    ssmServerDebug(`Retrieving system info for region: ${this.region}, instanceId: ${this.instanceId}`);
    const info = await getSystemInfo(this.ssmClient, 'bash', 'path/to/system_info.sh', this.instanceId);
    return JSON.parse(info) as SystemInfo;
  }

  async amendFile(filename: string, content: string, backup: boolean = true): Promise<boolean> {
    ssmServerDebug(`Amending file at filename: ${filename}, content: ${content}, backup: ${backup}, region: ${this.region}, instanceId: ${this.instanceId}`);
    return amendFile(this.ssmClient, filename, content, backup.toString());
  }

  async createFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
    ssmServerDebug(`Creating filePath: ${filePath}, content: ${content}, backup: ${backup}, region: ${this.region}, instanceId: ${this.instanceId}`);
    return createFile(this.ssmClient, filePath, content, backup.toString());
  }

  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    ssmServerDebug(`Listing files with params: ${JSON.stringify(params)}, region: ${this.region}, instanceId: ${this.instanceId}`);
    const command = `ls -l ${params.directory}`;
    const result = await this.executeCommand(command);
    const files = result.stdout.split('\n').map(line => {
      const parts = line.split(/\s+/);
      const isDirectory = parts[0].startsWith('d');
      const name = parts.slice(8).join(' ');
      return { name, isDirectory };
    });
    return {
      items: files,
      limit: params.limit ?? 10,
      offset: params.offset ?? 0,
      total: files.length,
    };
  }

  async updateFile(filename: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    ssmServerDebug(`Updating file at filename: ${filename}, pattern: ${pattern}, replacement: ${replacement}, backup: ${backup}, region: ${this.region}, instanceId: ${this.instanceId}`);
    return updateFile(this.ssmClient, filename, pattern, replacement, backup.toString());
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
