import { ServerHandler } from '../../src/handlers/ServerHandler';
import { ServerConfig, SystemInfo } from '../../src/types';

// Mock implementation of ServerHandler for testing
class TestServerHandler extends ServerHandler {
  constructor(serverConfig: ServerConfig) {

    // Check if the serverConfig is empty or undefined
    if (!serverConfig || Object.keys(serverConfig).length === 0) {
      throw new Error('Server configuration is not defined in the config.');
    }

    // Check if the host is not 'localhost'
    if (serverConfig.host !== 'localhost') {
      throw new Error('No matching server configuration found for localhost.');
    }
    super(serverConfig);
    // Set the currentDirectory or any other initial setup
    this.currentDirectory = '/mock/directory';
  }

  // Mock implementations for abstract methods
  executeCommand(command: string, timeout?: number): Promise<{ stdout: string; stderr: string }> {
    // Return a dummy response or use jest.fn() to mock the implementation
    return Promise.resolve({ stdout: 'Mocked stdout', stderr: 'Mocked stderr' });
  }

  setCurrentDirectory(directory: string): boolean {
    // Mock setting the current directory
    this.currentDirectory = directory;
    return true;
  }

  getCurrentDirectory(): Promise<string> {
    // Return the mocked current directory
    return Promise.resolve(this.currentDirectory);
  }

  listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<string[]> {
    // Return a dummy list of files or use jest.fn() to mock the implementation
    return Promise.resolve(['file1.txt', 'file2.txt']);
  }

  createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
    // Mock file creation
    return Promise.resolve(true);
  }

  updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
    // Mock file update
    return Promise.resolve(true);
  }

  amendFile(filePath: string, content: string): Promise<boolean> {
    // Mock file amendment
    return Promise.resolve(true);
  }

  getSystemInfo(): Promise<SystemInfo> {
    // Return a dummy SystemInfo object
    return Promise.resolve({
      homeFolder: '/mock/home',
      type: 'MockOS',
      release: '1.0.0',
      platform: 'mock',
      arch: 'x64',
      hostname: 'mockhost',
      pythonVersion: '3.8.1',
      architecture: 'x64',
      totalMemory: 8192,
      freeMemory: 4096,
      uptime: 10000,
      currentFolder: this.currentDirectory
    });
  }

}

export default TestServerHandler;
