import * as fs from 'fs';
import * as path from 'path';

/**
 * Lists files in a specified directory.
 * @param directory - The directory to list files from.
 * @param limit - The maximum number of files to return.
 * @param offset - The offset for file listing, used for pagination.
 * @param orderBy - The criteria to order the files by.
 * @returns A promise that resolves to an array of file names.
 */
export async function listFiles(directory: string, limit: number, offset: number, orderBy: "datetime" | "filename"): Promise<string[]> {
    console.log(`Listing files in directory: ${directory}`);
    try {
        if (!fs.existsSync(directory)) {
            console.error(`Directory does not exist: ${directory}`);
            return [];
        }
        const files = fs.readdirSync(directory).slice(offset, offset + limit);
        return files;
    } catch (error) {
        console.error(`Failed to list files in '${directory}': ${error instanceof Error ? error.message : String(error)}`);
        return [];
    }
}
