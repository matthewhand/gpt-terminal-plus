import { SshServerHandler } from './SshServerHandler';
import { BaseServerHandler } from '../BaseServerHandler';
import { loadActions } from '../../utils/loadActions';
import { SystemInfo, PaginatedResponse } from '../../types';

const actions = loadActions(__dirname + '/actions');

class SshServer extends BaseServerHandler implements SshServerHandler {
  privateKeyPath: string;
  port?: number;

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    return actions.executeCommand(command, timeout, directory);
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return actions.getSystemInfo();
  }

  async amendFile(filePath: string, content: string): Promise<boolean> {
    return actions.amendFile(filePath, content);
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    return actions.createFile(directory, filename, content, backup);
  }

  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    return actions.listFiles(params);
  }

  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    return actions.updateFile(filePath, pattern, replacement, backup);
  }

  async changeDirectory(directory: string): Promise<boolean> {
    return actions.changeDirectory(directory);
  }

  async presentWorkingDirectory(): Promise<string> {
    return actions.presentWorkingDirectory();
  }
}

export default SshServer;
