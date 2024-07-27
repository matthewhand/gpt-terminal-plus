import * as fs from "fs";
import * as path from "path";
import { getCurrentFolder } from "../../../utils/GlobalStateHelper";

/**
 * Creates a file with the specified content. Optionally backs up the existing file.
 * @param {string} directory - The directory to create the file in.
 * @param {string} filename - The name of the file.
 * @param {string} content - The content to write to the file.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @returns {Promise<boolean>} - True if the file was created successfully, false otherwise.
 */
export async function createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
  const fullPath = path.join(directory || getCurrentFolder(), filename);
  try {
    if (backup && fs.exists(fullPath)) {
      const backupPath = `${fullPath}.bak`;
      await fs.promises.copyFile(fullPath, backupPath);
    }

    await fs.promises.writeFile(fullPath, content);
    return true;
  } catch (error) {
    console.error(`Failed to create file : ${error}`);
    return false;
  }
}
