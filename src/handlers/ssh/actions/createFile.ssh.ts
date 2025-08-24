import { Client } from "ssh2";
import { getPresentWorkingDirectory } from "../../../utils/GlobalStateHelper";
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

  const fullPath = getPresentWorkingDirectory() + "/" + filePath;
  debug(`Creating file at ${fullPath} with content: ${content}`);

  try {
    const escapedContent = escapeSpecialChars(content);

    sshClient.exec(`cat << EOF > ${fullPath}\n${escapedContent}\nEOF\n`, (err, stream) => {
      if (err) {
        debug(`Error executing command: ${err.message}`);
        throw err;
      }
      stream.on("close", (code: number, signal: string) => {
        if (code === 0) {
          debug(`File created successfully at ${fullPath}`);
          sshClient.end();
        } else {
          const error = `Command failed with code ${code}, signal ${signal}`;
          debug(error);
          throw new Error(error);
        }
      }).stderr.on('data', (data: Buffer) => {
        const error = `STDERR: ${data.toString()}`;
        debug(error);
        throw new Error(error);
      });
    });

    return true;
  } catch (error) {
    const errorMessage = `Failed to create file at ${fullPath}: ${(error instanceof Error ? error.message : 'Unknown error')}`;
    debug(errorMessage);
    throw new Error(errorMessage);
  }
}
