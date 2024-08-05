import * as fs from "fs";
import * as path from "path";
import { presentWorkingDirectory } from "../../../utils/GlobalStateHelper";
import Debug from 'debug';

const debug = Debug('app:createFile');

/**
 * Creates a file with the specified content.
 * @param {string} filePath - The full path of the file to create.
 * @param {string} content - The content to write to the file.
 * @param {boolean} backup - Whether to back up the existing file before creating or replacing the new one.
 * @returns {Promise<boolean>} - Resolves to true if the file is created successfully.
 */
export async function createFile(filePath: string, content: string, backup: boolean): Promise<boolean> {
  debug("Received parameters:", { filePath, content, backup });

  // Validate inputs
  if (!filePath || typeof filePath !== 'string') {
    const errorMessage = 'File path must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!content || typeof content !== 'string') {
    const errorMessage = 'Content must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  // Correct the full path
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(presentWorkingDirectory(), filePath);
  debug('Creating file at ' + fullPath + ' with content: ' + content);

  try {
    if (backup && fs.existsSync(fullPath)) {
      const backupPath = `${fullPath}.bak`;
      await fs.promises.copyFile(fullPath, backupPath);
      debug('Backup created at ' + backupPath);
    }
    await fs.promises.writeFile(fullPath, content);
    debug('File created successfully at ' + fullPath);
    return true;
  } catch (error) {
    const errorMessage = 'Failed to create file ' + fullPath + ': ' + (error instanceof Error ? error.message : 'Unknown error');
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
