import { Client } from "ssh2";
import { createPaginatedResponse, getCurrentFolder } from "../../../utils/PaginationUtils";

/**
 * Lists files in the specified directory on an SSH server with pagination.
 * @param {Client} sshClient - The SSH client.
 * @param {string} [directory=""] - The directory to list files in.
 * @param {number} [limit=42] - The maximum number of files to return.
 * @param {number} [offset=0] - The offset to start the listing from.
 * @param {"filename" | "datetime"} [orderBy="filename"] - The order criterion.
 * @returns {Promise<PaginatedResponse>} - The paginated response with the list of files.
 */
export async function listFiles(sshClient: Client, directory: string = "", limit: number = 42, offset: number = 0, orderBy: "filename" | "datetime" = "filename"): Promise<PaginatedResponse> {
  const targetDirectory = directory || getCurrentFolder();
  try {
    let commandOutput = "";
    sshClient.exec("ls -la " + targetDirectory, (err, stream) => {
      if (err) throw err;
      stream.on("data", data => {
        commandOutput += data;
      }).on("close", () => sshClient.end());
    });

    const files = commandOutput.split("
").slice(1); // Skip the total line

    return createPaginatedResponse(files, limit, offset);
  } catch (error) {
    console.error("Failed to list files in directory  + targetDirectory + : " + error);
    throw error;
  }
}

