import { Client } from "ssh2";
import { presentWorkingDirectory } from "../../../utils/GlobalStateHelper";
import { escapeSpecialChars } from "../../../common/escapeSpecialChars";
import Debug from 'debug';

const debug = Debug('app:createFile');

/**
 * Creates a new file on an SSH server.
 * @param {Client} sshClient - The SSH client.
 * @param {string} filePath - The path of the file to create.
 * @param {string} content - The content to write to the file.
 * @returns {Promise<boolean>} - True if the file was created successfully, false otherwise.
 */
export async function createFile(sshClient: Client, filePath: string, content: string): Promise<boolean> {
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

  const fullPath = presentWorkingDirectory() + "/" + filePath;
  debug("Creating file at " + fullPath + " with content: " + content);

  try {
    const escapedContent = escapeSpecialChars(content);

    sshClient.exec(`cat << EOF > ${fullPath}\n${escapedContent}\nEOF\n`, (err, stream) => {
      if (err) throw err;
      stream.on("close", () => sshClient.end());
    });

    debug("File created successfully at " + fullPath);
    return true;
  } catch (error) {
    const errorMessage = "Failed to create file at " + fullPath + ": " + (error instanceof Error ? error.message : 'Unknown error');
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
