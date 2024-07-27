import { Client } from "ssh2";
import { getCurrentFolder } from "../../../utils/GlobalStateHelper";
import { escapeRegExp } from "../../../utils/escapeRegExp";

/**
 * Updates a file on an SSH server by replacing a pattern with a replacement string. Optionally backs up the existing file.
 * @param {Client} sshClient - The SSH client.
 * @param {string} filePath - The path of the file to update.
 * @param {string} pattern - The pattern to replace.
 * @param {string} replacement - The replacement string.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @returns {Promise<boolean>} - True if the file was updated successfully, false otherwise.
 */
export async function updateFile(sshClient: Client, filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
  const fullPath = getCurrentFolder() + "/" + filePath;
  const backupPath = backup ? fullPath + ".bak" : null;

  try {
    const escapedPattern = escapeRegExp(pattern);
    const command = "sed -i s/ + escapedPattern + / + replacement + /g " + fullPath;

    sshClient.exec(
      backup ? "cp " + fullPath + " " + backupPath + "; " + command : command,
      (err, stream) => {
        if (err) throw err;
        stream.on("close", () => sshClient.end());
      }
    );

    return true;
  } catch (error) {
    console.error("Failed to update file  + fullPath + : " + error);
    return false;
  }
}

