import * as fs from "fs";
import * as path from "path";
import { getCurrentFolder } from "../../../utils/GlobalStateHelper";
import { escapeRegExp } from "../../../utils/escapeRegExp";

/**
 * Updates a file by replacing a pattern with a replacement string. Optionally backs up the existing file.
 * @param {string} filePath - The path of the file to update.
 * @param {string} pattern - The pattern to replace.
 * @param {string} replacement - The replacement string.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @returns {Promise<boolean>} - True if the file was updated successfully, false otherwise.
 */
export async function updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
  const fullPath = path.join(getCurrentFolder(), filePath);
  try {
    if (backup && fs.existsSync(fullPath)) {
      const backupPath = `${fullPath}.bak`;
      await fs.promises.copyFile(fullPath, backupPath);
    }

    let content = await fs.promises.readFile(fullPath, "utf8");
    const regex = new RegExp(escapeRegExp(pattern), "g");
    content = content.replace(regex, replacement);
    await fs.promises.writeFile(fullPath, content);
    return true;
  } catch (error) {
    console.error(`Failed to update file : ${error}`);
    return false;
  }
}
