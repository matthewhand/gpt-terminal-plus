import { createPaginatedResponse } from '../../../utils/PaginationUtils';
import { PaginatedResponse } from '../../../types/response';
import { exec } from 'child_process';
import util from 'util';
import Debug from 'debug';

// Initialize debug logger
const debug = Debug('localhost:listFiles');

// Promisify the exec function for easier async/await usage
const execPromise = util.promisify(exec);

/**
 * List files in a specified directory with pagination.
 * 
 * @param {string} directory - The directory to list files from.
 * @param {number} [limit=42] - The maximum number of files to return.
 * @param {number} [offset=0] - The number of files to skip before starting to collect the result set.
 * @param {string} [orderBy='filename'] - The attribute to order files by (currently not implemented).
 * @returns {Promise<PaginatedResponse>} - A promise that resolves to a paginated response of files.
 * @throws {Error} - Throws an error if the command fails.
 */
export async function listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: string = 'filename'): Promise<PaginatedResponse> {
  debug(`Listing files in directory: ${directory}, limit: ${limit}, offset: ${offset}, orderBy: ${orderBy}`);

  // Construct the command to list files in the specified directory
  const command = `ls -la ${directory}`;
  debug(`Executing command: ${command}`);

  try {
    // Execute the command and capture the output
    const { stdout, stderr } = await execPromise(command);
    debug(`Command executed successfully. Stdout: ${stdout}`);

    // Handle any errors returned by the command
    if (stderr) {
      debug(`Error encountered: ${stderr}`);
      throw new Error(`Failed to list files: ${stderr}`);
    }

    // Parse the output to extract file names
    const files = stdout.split('\n')
      .slice(1) // Remove the first line which contains the total count
      .map(line => line.split(/\s+/).pop()!) // Extract the file name from each line
      .filter(file => file); // Remove any empty entries

    debug(`Files found: ${files}`);

    // Create a paginated response
    const response = createPaginatedResponse(files, limit, offset);
    debug(`Paginated response created: ${JSON.stringify(response)}`);

    return response;

  } catch (err) {
    // Explicitly type the error as `Error`
    const error = err as Error;
    debug(`Error executing command: ${error.message}`);
    throw new Error(`Error listing files: ${error.message}`);
  }
}
