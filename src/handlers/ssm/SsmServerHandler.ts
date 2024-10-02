import { AbstractServerHandler } from '../AbstractServerHandler';
import { SsmTargetConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import Debug from 'debug';

const ssmDebug = Debug('app:SsmServerHandler');

export class SsmServerHandler extends AbstractServerHandler {
  private ssmConfig: SsmTargetConfig;

  constructor(ssmConfig: SsmTargetConfig) {
    super({ hostname: ssmConfig.hostname || 'localhost', protocol: ssmConfig.protocol || 'ssm' });
    this.ssmConfig = ssmConfig;
    ssmDebug('Initialized SsmServerHandler with config:', ssmConfig);
  }

  async executeCommand(command: string, timeout: number = 5000): Promise<ExecutionResult> {
    ssmDebug(`Executing command: ${command} with timeout: ${timeout}`);
    // Simulated command execution logic for SSM
    return { stdout: 'Simulated SSM Command Output', stderr: '', error: false };
  }

  async listFiles(directory: string, limit: number = 10, offset: number = 0): Promise<PaginatedResponse<string>> {
    ssmDebug(`Listing files in directory: ${directory} with limit: ${limit}, offset: ${offset}`);
    // Simulated file listing logic for SSM
    const files = ['file1.txt', 'file2.txt', 'file3.txt']; // Example list of files
    return {
      items: files.slice(offset, offset + limit),
      total: files.length,
      limit,
      offset,
    };
  }
}
