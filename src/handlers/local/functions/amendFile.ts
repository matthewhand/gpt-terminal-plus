import * as fs from "fs";
import * as path from "path";
import { getCurrentFolder } from "../../../utils/GlobalStateHelper";

/**
 * Appends content to a file.
 * @param {string} filePath - The path of the file to amend.
 * @param {string} content - The content to append.
 * @returns {Promise<boolean>} - True if the file was amended successfully, false otherwise.
 */
export async function amendFile(filePath: string, content: string): Promise<boolean> {
  const fullPath = path.join(getCurrentFolder(), filePath);
  try {
    await fs.promises.appendFile(fullPath, content);
    return true;
  } catch (error) {
    console.error(`Failed to amend file : ${error}`);
    return false;
  }
}
