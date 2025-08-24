import { Client } from "ssh2";
import { getPresentWorkingDirectory } from "../../../utils/GlobalStateHelper";
import Debug from 'debug';
import { v4 as uuidv4 } from 'uuid';
import { escapeSpecialChars } from "../../../common/escapeSpecialChars";

const debug = Debug('app:amendFile');

/**
 * Appends content to a file on an SSH server.
 * @param {Client} sshClient - The SSH client.
 * @param {string} filePath - The path of the file to amend.
 * @param {string} content - The content to append.
 * @returns {Promise<boolean>} - True if the file was amended successfully, false otherwise.
 */
export async function amendFile(sshClient: Client, filePath: string, content: string): Promise<boolean> {
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
  if (!content || typeof content !== 'string') {
    const errorMessage = 'Content must be provided and must be a string.';
    debug(errorMessage);
    throw new Error(errorMessage);
  }

  const fullPath = getPresentWorkingDirectory() + "/" + filePath;
  debug("Amending file at " + fullPath + " with content: " + content);

  try {
    // Check if content contains EOF and set a unique marker
    let uniqueMarker = "EOF";
    if (content.indexOf("EOF") !== -1) {
      uniqueMarker = uuidv4();
    }

    const escapedContent = escapeSpecialChars(content);

    sshClient.exec("cat << " + uniqueMarker + " >> " + fullPath + "\n" + escapedContent + "\n" + uniqueMarker + "\n", (err, stream) => {
      if (err) {
        debug("Error executing command: " + err.message);
        throw err;
      }
      stream.on("close", () => {
        debug("File amended successfully at " + fullPath);
        sshClient.end();
      });
    });

    return true;
  } catch (error) {
    const errorMessage = "Failed to amend file " + fullPath + ": " + (error instanceof Error ? error.message : 'Unknown error');
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
