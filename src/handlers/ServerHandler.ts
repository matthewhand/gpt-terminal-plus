import * as fs from 'fs';
import * as path from 'path';
import { ServerConfig, SystemInfo } from '../types';
import config from 'config';

// Define an abstract class ServerHandler
export abstract class ServerHandler {
  protected currentDirectory: string;
  protected serverConfig: ServerConfig | null = null;
  protected servers: ServerConfig[] = config.get('serverConfig');
  protected identifier: string;

  constructor(identifier: string = "") {
    this.identifier = identifier;
    this.currentDirectory = "";
    this.loadServerConfig();
  }

  private loadServerConfig(): void {
    // Check if the server configuration is defined in the config
    if (!config.has('serverConfig')) {
      throw new Error('Server configuration is not defined in the config.');
    }
  
    // Find the server configuration for localhost, or default to null
    this.serverConfig = this.servers.find((configItem: ServerConfig) => configItem.connectionString === 'localhost') ?? null;
  
    if (!this.serverConfig) {
      throw new Error('No matching server configuration found for localhost.');
    }
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
