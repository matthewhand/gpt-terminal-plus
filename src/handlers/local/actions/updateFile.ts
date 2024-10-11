import * as fs from "fs";
import * as path from "path";
import { getPresentWorkingDirectory } from "../../../utils/GlobalStateHelper";
import Debug from 'debug';

const debug = Debug('app:updateFile');

/**
 * Updates an existing file by replacing specified patterns with new content.
 * @param {string} filePath - The full path of the file to update.
 * @param {string} pattern - The text pattern to be replaced in the file.
 * @param {string} replacement - The new text to replace the pattern.
 * @param {boolean} multiline - Whether to treat the pattern as multiline.
 * @returns {Promise<boolean>} - Resolves to true if the file is updated successfully.
 */
export async function updateFile(filePath: string, pattern: string, replacement: string, multiline: boolean): Promise<boolean> {
  debug("Received parameters:", { filePath, pattern, replacement, multiline });

  // Validate inputs
  if (!filePath || typeof filePath !== 'string') {
    const errorMessage = 'File path must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!pattern || typeof pattern !== 'string') {
    const errorMessage = 'Pattern must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
  if (!replacement || typeof replacement !== 'string') {
    const errorMessage = 'Replacement must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  // Correct the full path
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(getPresentWorkingDirectory(), filePath);
  debug('Updating file at ' + fullPath + ' with pattern: ' + pattern + ' and replacement: ' + replacement);

  try {
    const content = await fs.promises.readFile(fullPath, "utf8");
    const updatedContent = content.replace(new RegExp(pattern, multiline ? "gm" : "g"), replacement);
    await fs.promises.writeFile(fullPath, updatedContent);
    debug('File updated successfully at ' + fullPath);
    return true;
  } catch (error) {
    const errorMessage = 'Failed to update file ' + fullPath + ': ' + (error instanceof Error ? error.message : 'Unknown error');
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
