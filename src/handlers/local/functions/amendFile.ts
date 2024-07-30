import * as fs from "fs";
import * as path from "path";
import { presentWorkingDirectory } from "../../../utils/GlobalStateHelper";
import Debug from 'debug';

const debug = Debug('app:amendFile');

/**
 * Appends content to a file.
 * @param {string} filePath - The path of the file to amend.
 * @param {string} content - The content to append.
 * @returns {Promise<boolean>} - True if the file was amended successfully, false otherwise.
 */
export async function amendFile(filePath: string, content: string): Promise<boolean> {
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

  const fullPath = path.join(presentWorkingDirectory(), filePath);
  debug('Amending file at ' + fullPath + ' with content: ' + content);
  try {
    await fs.promises.appendFile(fullPath, content);
    debug('File amended successfully at ' + fullPath);
    return true;
  } catch (error) {
    const errorMessage = 'Failed to amend file ' + fullPath + ': ' + (error instanceof Error ? error.message : 'Unknown error');
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
