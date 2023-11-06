import * as fs from 'fs';
import * as path from 'path';
import config from 'config';
import { ServerConfig, SystemInfo } from '../types';

export abstract class ServerHandler {
    protected currentDirectory: string;
    protected serverConfig: ServerConfig;
    protected identifier: string;
  
    // Static property to hold the singleton instance
    private static instance: ServerHandler | null = null;
  
    constructor(serverConfig: ServerConfig) {
      this.serverConfig = serverConfig;
      this.identifier = `${serverConfig.username}@${serverConfig.host}`;
      this.currentDirectory = "";
    }
  
// Static method to get the singleton instance
public static async getInstance(host: string): Promise<ServerHandler> {
  if (!ServerHandler.instance) {
    const servers: ServerConfig[] = config.get('serverConfig');
    const serverConfig = servers.find((configItem: ServerConfig) => configItem.host === host);
    if (!serverConfig) {
      throw new Error(`No matching server configuration found for host: ${host}.`);
    }

    if (serverConfig.host === 'localhost') {
      // Dynamically import the LocalServerHandler module
      const { default: LocalServerHandler } = await import('./LocalServerHandler');
      ServerHandler.instance = new LocalServerHandler(serverConfig);
    } else {
      // Dynamically import the RemoteServerHandler module
      const { default: RemoteServerHandler } = await import('./RemoteServerHandler');
      ServerHandler.instance = new RemoteServerHandler(serverConfig);
    }
  }
  return ServerHandler.instance;
}

  // Abstract methods...
  abstract executeCommand(command: string, timeout?: number): Promise<{ stdout: string; stderr: string }>;
  abstract setCurrentDirectory(directory: string): boolean;
  abstract getCurrentDirectory(): Promise<string>;
  abstract listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<string[]>;
  abstract createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  abstract updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  abstract amendFile(filePath: string, content: string): Promise<boolean>;
  abstract getSystemInfo(): Promise<SystemInfo>;

  // Concrete method to check if a file exists
  fileExists(filePath: string): boolean {
    const fullPath = path.join(this.currentDirectory, filePath);
    return fs.existsSync(fullPath);
  }
}
