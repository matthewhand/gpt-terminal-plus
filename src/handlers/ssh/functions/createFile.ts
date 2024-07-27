import { Client } from "ssh2";
import { getCurrentFolder } from "../../../utils/GlobalStateHelper";

/**
 * Creates a file on an SSH server. Optionally backs up the existing file.
 * @param {Client} sshClient - The SSH client.
 * @param {string} directory - The directory to create the file in.
 * @param {string} filename - The name of the file.
 * @param {string} content - The content to write to the file.
 * @param {boolean} [backup=true] - Whether to backup the existing file.
 * @returns {Promise<boolean>} - True if the file was created successfully, false otherwise.
 */
export async function createFile(sshClient: Client, directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
  const fullPath = directory ? directory + "/" + filename : getCurrentFolder() + "/" + filename;
  const backupPath = backup ? fullPath + ".bak" : null;

  try {
    sshClient.exec(
      backup ? `cp " + fullPath + " " + backupPath + "; echo \"" + content + "\" > " + fullPath : `echo \"" + content + "\" > " + fullPath,
      (err, stream) => {
        if (err) throw err;
        stream.on("close", () => sshClient.end());
      }
    );

    return true;
  } catch (error) {
    console.error(`Failed to create file  + fullPath + : " + error);
    return false;
  }
}

