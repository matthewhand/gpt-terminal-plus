import { AbstractServerHandler } from '../AbstractServerHandler';
import { SshHostConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import Debug from 'debug';

const sshDebug = Debug('app:SshServerHandler');

export class SshServerHandler extends AbstractServerHandler {
  private sshConfig: SshHostConfig;

  constructor(sshConfig: SshHostConfig) {
    super({ hostname: sshConfig.hostname, protocol: 'ssh' });
    this.sshConfig = sshConfig;
  }

  async executeCommand(command: string, timeout: number = 5000): Promise<ExecutionResult> {
    sshDebug(`Executing SSH command: ${command} with timeout: ${timeout}`);
    // Simulated SSH command execution logic
    return { stdout: 'Simulated SSH Command Output', stderr: '', error: false };
  }

  async listFiles(directory: string, limit: number = 10, offset: number = 0): Promise<PaginatedResponse<string>> {
    sshDebug(`Listing files in directory: ${directory} with limit: ${limit}, offset: ${offset}`);
    // Simulated file listing logic for SSH
    const files = ['file1.txt', 'file2.txt', 'file3.txt']; // Example list of files
    return {
      items: files.slice(offset, offset + limit),
      total: files.length,
      limit,
      offset,
    };
  }
}
