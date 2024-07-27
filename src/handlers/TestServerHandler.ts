import { ServerHandler } from '../../src/handlers/ServerHandler';
import { ServerConfig, SystemInfo, PaginatedResponse, ServerHandlerInterface } from '../../src/types/index';

/**
 * Mock implementation of ServerHandler for testing purposes.
 * Provides mock responses for all abstract methods.
 */
class TestServerHandler extends ServerHandler implements ServerHandlerInterface {
  private currentDirectory: string = '/'; // Defaulting to root, adjust as needed

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
   * @param command - The command to execute.
   * @param timeout - Optional timeout for the command execution.
   * @returns The command's stdout and stderr output.
   */
  executeCommand(command: string, timeout?: number): Promise<{ stdout: string; stderr: string }> {
    // Return a dummy response
    return Promise.resolve({ stdout: 'Mocked stdout', stderr: 'Mocked stderr' });
  }

  /**
   * Sets the current directory on the mock server.
   * @param directory - The directory to set.
   * @returns True if the directory was set successfully.
   */
  setCurrentDirectory(directory: string): boolean {
    // Mock setting the current directory
    this.currentDirectory = directory;
    return true;
  }

  /**
   * Gets the current directory on the mock server.
   * @returns The current directory.
   */
  getCurrentDirectory(): Promise<string> {
    // Return the mocked current directory
    return Promise.resolve(this.currentDirectory);
  }

  /**
   * Lists files in a specified directory on the mock server.
   * @param directory - The directory to list files in.
   * @param limit - Maximum number of files to return.
   * @param offset - Number of files to skip before starting to collect the result set.
   * @param orderBy - Criteria to order files by.
   * @returns A paginated response containing files in the directory.
   */
  listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: "filename" | "datetime" = "filename"): Promise<PaginatedResponse> {
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
   * @param content - The content to write to the file.
   * @param backup - Whether to create a backup of the file if it exists.
   * @returns True if the file is created successfully.
   */
  createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    // Mock file creation
    return Promise.resolve(true);
  }

  /**
   * Updates a file on the mock server by replacing a pattern with a replacement string.
   * @param filePath - The path of the file to update.
   * @param pattern - The pattern to replace.
   * @param replacement - The replacement string.
   * @param backup - Whether to create a backup of the file before updating.
   * @returns True if the file is updated successfully.
   */
  updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    // Mock file update
    return Promise.resolve(true);
  }

  /**
   * Appends content to a file on the mock server.
   * @param filePath - The path of the file to amend.
   * @param content - The content to append.
   * @returns True if the file is amended successfully.
   */
  amendFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
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
