import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types/index';
import { escapeRegExp } from '../utils/escapeRegExp';
import { getCurrentFolder, setCurrentFolder } from '../utils/GlobalStateHelper';
import { psSystemInfoCmd } from './psSystemInfoCommand'; // Importing PowerShell command
import { shSystemInfoCmd } from './shSystemInfoCommand'; // Importing Shell command

export default class LocalServerHandler extends ServerHandler {
    protected serverConfig: ServerConfig;
    private execAsync = promisify(exec);

    constructor(serverConfig: ServerConfig) {
        super(serverConfig);
        this.serverConfig = serverConfig;
    }

    async getSystemInfo(): Promise<SystemInfo> {
        let shellCommand, execShell;

        if (this.serverConfig.shell) {
            shellCommand = this.serverConfig.shell === 'powershell' ? psSystemInfoCmd : shSystemInfoCmd;
            execShell = this.serverConfig.shell;
        } else {
            shellCommand = process.platform === 'win32' ? psSystemInfoCmd : shSystemInfoCmd;
        }

        try {
            const execOptions = execShell ? { shell: execShell } : {};
            const { stdout } = await this.execAsync(shellCommand, execOptions);

            const systemInfoObj = stdout.trim().split('\n').reduce((acc: {[key: string]: string}, line) => {
              const [key, value] = line.split(':').map(part => part.trim());
              acc[key] = value;
              return acc;
            }, {});

            return this.constructSystemInfo(systemInfoObj);
        } catch (error) {
            console.error(`Error getting system information:`, error);
            return this.getDefaultSystemInfo();
        }
    }

    protected getDefaultSystemInfo(): SystemInfo {
      return {
          homeFolder: process.env.HOME || process.env.USERPROFILE || '/',
          type: process.platform,
          release: 'N/A',
          platform: 'N/A',
          powershellVersion: 'N/A',
          architecture: process.arch,
          totalMemory: Math.round(os.totalmem() / 1024 / 1024), // In MB
          freeMemory: Math.round(os.freemem() / 1024 / 1024), // In MB
          uptime: process.uptime(), // In seconds
          currentFolder: getCurrentFolder() // Use GlobalStateHelper for current folder
      };
  }
  
  private constructSystemInfo(rawData: Partial<SystemInfo>): SystemInfo {
      // Merge rawData with defaultInfo ensuring all SystemInfo fields are populated
      const defaultInfo = this.getDefaultSystemInfo();
      return { ...defaultInfo, ...rawData };
  }
  
  async executeCommand(command: string, timeout: number = 5000, directory?: string): Promise<{ stdout: string; stderr: string }> {
      const execOptions = {
          timeout,
          cwd: directory || getCurrentFolder(), // Use GlobalStateHelper for current directory
          shell: this.serverConfig.shell || undefined
      };
  
      try {
          const { stdout, stderr } = await this.execAsync(command, execOptions);
          return { stdout, stderr };
      } catch (error) {
          if (error instanceof Error) {
              throw new Error(`Error executing command: ${error.message}`);
          } else {
              throw new Error('An unknown error occurred while executing the command.');
          }
      }
  }
  
  async listFiles(directory: string = '', limit: number = 42, offset: number = 0, orderBy: 'filename' | 'datetime' = 'filename'): Promise<string[]> {
      const targetDirectory = directory || getCurrentFolder();
      try {
          const entries = await fs.promises.readdir(targetDirectory, { withFileTypes: true });
          let files = entries.filter(entry => entry.isFile()).map(entry => entry.name);
  
          // Sorting logic based on orderBy parameter
          if (orderBy === 'datetime') {
              const fileStats = await Promise.all(files.map(async file => ({
                  name: file,
                  stats: await fs.promises.stat(path.join(targetDirectory, file))
              })));
  
              files = fileStats.sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime()).map(file => file.name);
          } else {
              files.sort(); // Default to sorting by filename
          }
  
          // Pagination
          return files.slice(offset, offset + limit);
      } catch (error) {
          console.error(`Failed to list files in directory '${targetDirectory}': ${error}`);
          throw error;
      }
  }
  
  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
      const fullPath = path.join(directory || getCurrentFolder(), filename);
      try {
          if (backup && fs.existsSync(fullPath)) {
              const backupPath = `${fullPath}.bak`;
              await fs.promises.copyFile(fullPath, backupPath);
          }
  
          await fs.promises.writeFile(fullPath, content);
          return true;
      } catch (error) {
          console.error(`Failed to create file '${fullPath}': ${error}`);
          return false;
      }
  }
  
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
      const fullPath = path.join(getCurrentFolder(), filePath);
      try {
          if (backup && fs.existsSync(fullPath)) {
              const backupPath = `${fullPath}.bak`;
              await fs.promises.copyFile(fullPath, backupPath);
          }
  
          let content = await fs.promises.readFile(fullPath, 'utf8');
          const regex = new RegExp(escapeRegExp(pattern), 'g');
          content = content.replace(regex, replacement);
          await fs.promises.writeFile(fullPath, content);
          return true;
      } catch (error) {
          console.error(`Failed to update file '${fullPath}': ${error}`);
          return false;
      }
  }
  
  async amendFile(filePath: string, content: string): Promise<boolean> {
      const fullPath = path.join(getCurrentFolder(), filePath);
      try {
          await fs.promises.appendFile(fullPath, content);
          return true;
      } catch (error) {
          console.error(`Failed to amend file '${fullPath}': ${error}`);
          return false;
      }
  }
  
}