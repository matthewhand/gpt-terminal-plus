import * as fs from "fs";
import * as path from "path";
import { createPaginatedResponse } from "../../../utils/PaginationUtils";
import { getCurrentFolder } from "../../../utils/GlobalStateHelper";

/**
 * Lists files in the specified directory with pagination.
 * @param {string} [directory=""] - The directory to list files in.
 * @param {number} [limit=42] - The maximum number of files to return.
 * @param {number} [offset=0] - The offset to start the listing from.
 * @param {"filename" | "datetime"} [orderBy="filename"] - The order criterion.
 * @returns {Promise<PaginatedResponse>} - The paginated response with the list of files.
 */
export async function listFiles(directory: string = "", limit: number = 42, offset: number = 0, orderBy: "filename" | "datetime" = "filename"): Promise<PaginatedResponse> {
  const targetDirectory = directory || getCurrentFolder();
  try {
    const entries = await fs.promises.readdir(targetDirectory, { withFileTypes: true });
    let files = entries.filter(entry => entry.isFile()).map(entry => entry.name);

    if (orderBy === "datetime") {
      const fileStats = await Promise.all(files.map(async file => ({
        name: file,
        stats: await fs.promises.stat(path.join(targetDirectory, file))
      })));

      files = fileStats.sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime()).map(file => file.name);
    } else {
      files.sort();
    }

    return createPaginatedResponse(files, limit, offset);
  } catch (error) {
    console.error(`Failed to list files in directory : ${error}`);
    throw error;
  }
}
