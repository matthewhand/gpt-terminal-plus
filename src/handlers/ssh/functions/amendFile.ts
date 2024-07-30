import { Client } from "ssh2";
import { presentWorkingDirectory } from "../../../utils/GlobalStateHelper";

/**
 * Appends content to a file on an SSH server.
 * @param {Client} sshClient - The SSH client.
 * @param {string} filePath - The path of the file to amend.
 * @param {string} content - The content to append.
 * @returns {Promise<boolean>} - True if the file was amended successfully, false otherwise.
 */
export async function amendFile(sshClient: Client, filePath: string, content: string): Promise<boolean> {
  const fullPath = presentWorkingDirectory() + "/" + filePath;
  console.debug("Amending file at " + fullPath + " with content: " + content);

  try {
    sshClient.exec("echo \"" + content + "\" >> " + fullPath, (err, stream) => {
      if (err) throw err;
      stream.on("close", () => sshClient.end());
    });

    return true;
  } catch (error) {
    console.error("Failed to amend file " + fullPath + ": " + error);
    return false;
  }
}
