import { ServerHandlerInterface } from '../types/ServerHandlerInterface';
import { PaginatedResponse } from '../types/PaginatedResponse';
import { SystemInfo } from '../types/SystemInfo';
import debug from 'debug';

const log = debug('test-server-handler');

/**
 * Test Server Handler for simulating server operations.
 */
export class TestServerHandler implements ServerHandlerInterface {
  /**
   * Executes a command and returns simulated output.
   * @param {string} command - The command to execute.
   * @param {number} [timeout=60] - The timeout for command execution.
   * @returns {Promise<{ stdout: string; stderr: string }>} - The simulated output.
   */
  async executeCommand(command: string, timeout: number = 60): Promise<{ stdout: string; stderr: string }> {
    log('Executing command: ' + command + ' with timeout: ' + timeout);
    return { stdout: 'Simulated output for: ' + command, stderr: '' };
  }

  /**
   * Creates a file and returns success.
   * @param {string} directory - The directory to create the file in.
   * @param {string} filename - The name of the file.
   * @returns {Promise<boolean>} - Whether the file creation was successful.
   */
  async createFile(directory: string, filename: string): Promise<boolean> {
    log('Creating file: ' + filename + ' in directory: ' + directory);
    return true;
  }

  /**
   * Updates a file and returns success.
   * @param {string} filePath - The path of the file.
   * @returns {Promise<boolean>} - Whether the file update was successful.
   */
  async updateFile(filePath: string): Promise<boolean> {
    log('Updating file: ' + filePath);
    return true;
  }

  /**
   * Amends a file and returns success.
   * @param {string} filePath - The path of the file.
   * @returns {Promise<boolean>} - Whether the file amendment was successful.
   */
  async amendFile(filePath: string): Promise<boolean> {
    log('Amending file: ' + filePath);
    return true;
  }

  /**
   * Lists files in a directory.
   * @param {string} [directory=''] - The directory to list files from.
   * @param {number} [limit=42] - The limit of files to list.
   * @param {number} [offset=0] - The offset for file listing.
   * @param {'filename' | 'datetime'} [orderBy='filename'] - The order criterion.
   * @returns {Promise<PaginatedResponse<string>>} - The list of files.
   */
  async listFiles(directory: string = '', limit: number = 42, offset: number = 0, orderBy: 'filename' | 'datetime' = 'filename'): Promise<PaginatedResponse<string>> {
    log('Listing files in directory: ' + directory + ' with limit: ' + limit + ', offset: ' + offset + ', orderBy: ' + orderBy);
    const simulatedFiles = Array.from({ length: limit }, (_, i) => 'file' + (offset + i) + '.txt');
    return {
      items: simulatedFiles,
      totalPages: 1,
      responseId: 'test-response-id',
      stdout: [],
      stderr: [],
    };
  }

  /**
   * Retrieves system information.
   * @returns {Promise<SystemInfo>} - The system information.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    log('Getting system info');
    return { type: 'Linux', platform: 'x64', freeMemory: 1024, totalMemory: 2048, cpuLoad: [0.1, 0.2, 0.3], uptime: 3600 };
  }
}
