import { LocalServerHandler } from './LocalServerHandler';
import { BaseServerHandler } from '../BaseServerHandler';
import { loadActions } from '../../utils/loadActions';
import { SystemInfo, PaginatedResponse } from '../../types';

const actions = loadActions(__dirname + '/actions');

class LocalServer extends BaseServerHandler implements LocalServerHandler {
  code = false;

  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    return actions.executeCommand(command, timeout, directory);
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return actions.getSystemInfo();
  }

  async amendFile(filePath: string, content: string): Promise<boolean> {
    const result = actions.amendFile(filePath, content);
    if (this.code) {
      await actions.executeCommand('code', 0, filePath);
    }
    return result;
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    // Implementing createFile function for local protocol
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(directory, filename);

    if (backup && fs.existsSync(filePath)) {
      const backupPath = `${filePath}.bak`;
      fs.copyFileSync(filePath, backupPath);
    }

    fs.writeFileSync(filePath, content);

    if (this.code) {
      await this.executeCommand(`code ${filePath}`);
    }
    return true;
  }

  async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
    return actions.listFiles(params);
  }

  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    const result = actions.updateFile(filePath, pattern, replacement, backup);
    if (this.code) {
      await actions.executeCommand('code', 0, filePath);
    }
    return result;
  }

  async changeDirectory(directory: string): Promise<boolean> {
    return actions.changeDirectory(directory);
  }

  async presentWorkingDirectory(): Promise<string> {
    return actions.presentWorkingDirectory();
  }
}

export default LocalServer;
