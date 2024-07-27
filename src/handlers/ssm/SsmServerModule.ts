import * as AWS from 'aws-sdk';
import { executeCommand } from './functions/executeCommand';
import { createFile } from './functions/createFile';
import { amendFile } from './functions/amendFile';
import { listFiles } from './functions/listFiles';
import { updateFile } from './functions/updateFile';
import { getSystemInfo } from './functions/getSystemInfo';
import { determineScriptExtension } from './functions/determineScriptExtension';
import { createTempScript } from './functions/createTempScript';
import { ServerHandlerInterface, SystemInfo } from '../../types/index';

/**
 * SSM Server Module to handle various SSM operations.
 */
export class SsmServerModule implements ServerHandlerInterface {
  private ssmClient: AWS.SSM;
  private instanceId: string;

  constructor(ssmClient: AWS.SSM, instanceId: string) {
    this.ssmClient = ssmClient;
    this.instanceId = instanceId;
  }

  async executeCommand(command: string, timeout: number = 60, directory?: string): Promise<{ stdout: string; stderr: string }> {
    const output = await executeCommand(this.ssmClient, command, this.instanceId, 'AWS-RunShellScript', timeout, directory);
    return { stdout: output.stdout || '', stderr: output.stderr || '' };
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    return createFile(this.ssmClient, this.instanceId, directory, filename, content, backup);
  }

  async amendFile(filePath: string, content: string): Promise<boolean> {
    return amendFile(this.ssmClient, this.instanceId, filePath, content);
  }

  async listFiles(directory: string = '', limit: number = 42, offset: number = 0, orderBy: 'filename' | 'datetime' = 'filename'): Promise<any> {
    return listFiles(this.ssmClient, this.instanceId, directory, limit, offset, orderBy);
  }

  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    return updateFile(this.ssmClient, this.instanceId, filePath, pattern, replacement, backup);
  }

  async getSystemInfo(): Promise<SystemInfo> {
    const output = await getSystemInfo(this.ssmClient, this.instanceId, 'bash', 'src/scripts/system-info.sh');
    return JSON.parse(output) as SystemInfo;
  }

  determineScriptExtension(shell: string): string {
    return determineScriptExtension(shell);
  }

  async createTempScript(scriptContent: string, scriptExtension: string, directory: string): Promise<string> {
    return createTempScript(scriptContent, scriptExtension, directory);
  }
}
