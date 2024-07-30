import * as fs from "fs";
import * as path from "path";
import { presentWorkingDirectory } from "../../../utils/GlobalStateHelper";
import { escapeRegExp } from "../../../utils/escapeRegExp";
import Debug from 'debug';

const debug = Debug('app:updateFile');

// Use an environment variable for backup file extension, default to ".bak" if not set
const backupExtension = process.env.BACKUP_EXTENSION || ".bak";

/**
 * Updates a file by replacing a pattern with a replacement string. Optionally backs up the existing file.
 * @param {string} filePath - The path of the file to update.
 * @param {string} pattern - The pattern to replace.
 * @param {string} replacement - The replacement string.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @returns {Promise<boolean>} - True if the file was updated successfully, false otherwise.
 */
export async function updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
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

  const fullPath = path.join(presentWorkingDirectory(), filePath);
  debug('Updating file at ' + fullPath + ' with pattern: ' + pattern + ', replacement: ' + replacement + ', backup: ' + backup);
  try {
    if (backup && fs.existsSync(fullPath)) {
      const backupPath = fullPath + backupExtension;
      await fs.promises.copyFile(fullPath, backupPath);
      debug('Backup created at ' + backupPath);
    }

    let content = await fs.promises.readFile(fullPath, "utf8");
    const regex = new RegExp(escapeRegExp(pattern), "g");
    content = content.replace(regex, replacement);
    await fs.promises.writeFile(fullPath, content);
    debug('File updated successfully at ' + fullPath);
    return true;
  } catch (error) {
    const errorMessage = 'Failed to update file ' + fullPath + ': ' + (error instanceof Error ? error.message : 'Unknown error');
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
