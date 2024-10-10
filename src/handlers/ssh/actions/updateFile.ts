import { Client } from "ssh2";
import { getPresentWorkingDirectory } from "../../../utils/GlobalStateHelper";
import { escapeSpecialChars } from "../../../common/escapeSpecialChars";
import { escapeRegExp } from "../../../utils/escapeRegExp";
import Debug from 'debug';

const debug = Debug('app:updateFile');

/**
 * Updates a file on an SSH server by replacing a pattern with a replacement string. Optionally backs up the existing file.
 * @param {Client} sshClient - The SSH client.
 * @param {string} filePath - The path of the file to update.
 * @param {string} pattern - The pattern to replace.
 * @param {string} replacement - The replacement string.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @param {boolean} [multiline=false] - Whether to handle multiline patterns.
 * @returns {Promise<boolean>} - True if the file was updated successfully, false otherwise.
 */
export async function updateFile(sshClient: Client, filePath: string, pattern: string, replacement: string, backup: boolean = true, multiline: boolean = false): Promise<boolean> {
  // Validate inputs
  if (!sshClient || !(sshClient instanceof Client)) {
    const errorMessage = 'SSH client must be provided and must be an instance of Client.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }
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

  const fullPath = presentWorkingDirectory() + "/" + filePath;
  const backupPath = backup ? fullPath + ".bak" : null;
  debug("Updating file at " + fullPath + " with pattern: " + pattern + ", replacement: " + replacement + ", backup: " + backup + ", multiline: " + multiline);

  try {
    const escapedPattern = escapeRegExp(pattern);
    const escapedReplacement = escapeSpecialChars(replacement);
    const sedFlag = multiline ? "z" : "s";
    const command = `sed -i '${sedFlag}/${escapedPattern}/${escapedReplacement}/g' ${fullPath}`;

    sshClient.exec(
      backup ? `cp ${fullPath} ${backupPath} && ${command}` : command,
      (err, stream) => {
        if (err) {
          debug("Error executing command: " + err.message);
          throw err;
        }
        stream.on("close", () => {
          debug("File updated successfully at " + fullPath);
          sshClient.end();
        });
      }
    );

    return true;
  } catch (error) {
    const errorMessage = "Failed to update file " + fullPath + ": " + (error instanceof Error ? error.message : 'Unknown error');
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
