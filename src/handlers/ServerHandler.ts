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

  private responseStorage: { [id: string]: string[] } = {};
  private responseCounter: number = 0;

  protected generateResponseId(): string {
    return (this.responseCounter++).toString();
  }

  protected storeResponse(responseString: string): string {
    const responseId = this.generateResponseId();
    const maxResponseSize = 1024; // Set the maximum response size per page
    const numPages = Math.ceil(responseString.length / maxResponseSize);
    this.responseStorage[responseId] = [];

    for (let i = 0; i < numPages; i++) {
      const start = i * maxResponseSize;
      const end = start + maxResponseSize;
      this.responseStorage[responseId].push(responseString.substring(start, end));
    }

    return responseId;
  }

  public getResponsePage(responseId: string, page: number): { page: number; data: string } | null {
    const pages = this.responseStorage[responseId];
    if (!pages || page < 0 || page >= pages.length) {
      return null;
    }
    return { page, data: pages[page] };
  }

  // Abstract methods...
  abstract executeCommand(command: string, timeout?: number): Promise<{ stdout: string; stderr: string }>;
  abstract setCurrentDirectory(directory: string): boolean;
  abstract getCurrentDirectory(): Promise<string>;
  abstract listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<string[]>;
  abstract createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  abstract updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  public abstract amendFile(filePath: string, content: string): Promise<boolean>;
  abstract getSystemInfo(): Promise<SystemInfo>;

  // Concrete method to check if a file exists
  fileExists(filePath: string): boolean {
    const fullPath = path.join(this.currentDirectory, filePath);
    return fs.existsSync(fullPath);
  }
}
