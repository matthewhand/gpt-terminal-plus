import { ServerHandler } from '../../src/handlers/ServerHandler';
import { ServerConfig } from '../../src/types/ServerConfig';
import { SystemInfo } from '../../src/types/SystemInfo';
import { PaginatedResponse } from '../../src/types/PaginatedResponse';
import { ServerHandlerInterface } from '../../src/types/ServerHandlerInterface';

/**
 * Mock implementation of ServerHandler for testing purposes.
 * Provides mock responses for all abstract methods.
 */
class TestServerHandler extends ServerHandler implements ServerHandlerInterface {
  private currentDirectory: string = '/'; // Defaulting to root, adjust as needed
  private defaultDirectory: string = '/mock/default'; // Add this property

  constructor(ServerConfig: ServerConfig) {
    // Check if the ServerConfig is empty or undefined
    if (!ServerConfig || Object.keys(ServerConfig).length === 0) {
      throw new Error('Server configuration is not defined in the config.');
    }

    // Check if the host is not 'localhost'
    if (ServerConfig.host !== 'localhost') {
      throw new Error('No matching server configuration found for localhost.');
    }
    super(ServerConfig);
    // Set the currentDirectory or any other initial setup
    this.currentDirectory = '/mock/directory';
  }

  /**
   * Executes a command on the mock server.
   * @returns The command's stdout and stderr output.
   */
  executeCommand(): Promise<{ stdout: string; stderr: string }> { // Removed unused parameters
    // Return a dummy response
    return Promise.resolve({ stdout: 'Mocked stdout', stderr: 'Mocked stderr' });
  }

  /**
   * Changes the current directory on the mock server.
   * @param directory - The directory to change to.
   * @returns True if the directory was changed successfully.
   */
  changeDirectory(directory: string): boolean {
    // Mock setting the current directory
    this.currentDirectory = directory;
    return true;
  }

  /**
   * Retrieves the current working directory on the mock server.
   * @returns The current working directory.
   */
  presentWorkingDirectory(): Promise<string> {
    // Return the mocked current directory
    return Promise.resolve(this.currentDirectory);
  }

  /**
   * Changes the default directory on the mock server.
   * @param directory - The directory to change to.
   * @returns True if the directory was changed successfully.
   */
  changeDefaultDirectory(directory: string): boolean {
    // Mock setting the default directory
    this.defaultDirectory = directory;
    return true;
  }

  /**
   * Retrieves the default directory on the mock server.
   * @returns The default directory.
   */
  presentDefaultDirectory(): Promise<string> {
    // Return the mocked default directory
    return Promise.resolve(this.defaultDirectory);
  }

  /**
   * Lists files in a specified directory on the mock server.
   * @param directory - The directory to list files in.
   * @returns A paginated response containing files in the directory.
   */
  listFiles(directory: string): Promise<PaginatedResponse<string>> { // Removed unused parameters
    return Promise.resolve({
      items: ['file1.txt', 'file2.txt'],
      totalPages: 1,
      responseId: 'mock-id',
      stdout: [],
      stderr: [],
      timestamp: Date.now()
    });
  }

  /**
   * Creates a file on the mock server.
   * @param directory - The directory to create the file in.
   * @param filename - The name of the file to create.
   * @returns True if the file is created successfully.
   */
  createFile(directory: string, filename: string): Promise<boolean> { // Removed unused parameters
    // Mock file creation
    return Promise.resolve(true);
  }

  /**
   * Updates a file on the mock server by replacing a pattern with a replacement string.
   * @param filePath - The path of the file to update.
   * @param pattern - The pattern to replace.
   * @param replacement - The replacement string.
   * @returns True if the file is updated successfully.
   */
  updateFile(filePath: string, pattern: string, replacement: string): Promise<boolean> { // Removed unused parameters
    // Mock file update
    return Promise.resolve(true);
  }

  /**
   * Appends content to a file on the mock server.
   * @param filePath - The path of the file to amend.
   * @param content - The content to append.
   * @returns True if the file is amended successfully.
   */
  amendFile(filePath: string, content: string): Promise<boolean> { // Removed unused parameters
    // Mock file amendment
    return Promise.resolve(true);
  }

  /**
   * Retrieves system information from the mock server.
   * @returns System information.
   */
  getSystemInfo(): Promise<SystemInfo> {
    // Return a dummy SystemInfo object
    return Promise.resolve({
      homeFolder: '/mock/home',
      type: 'MockOS',
      release: '1.0.0',
      platform: 'mock',
      architecture: 'x64',
      totalMemory: 8192,
      freeMemory: 4096,
      uptime: 10000,
      currentFolder: this.currentDirectory
    });
  }
}

export default TestServerHandler;
