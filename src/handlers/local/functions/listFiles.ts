import * as fs from 'fs';
import * as path from 'path';
import Debug from 'debug';

const debug = Debug('app:listFiles');

/**
 * Lists files in a specified directory.
 * @param directory - The directory to list files from.
 * @param limit - The maximum number of files to return.
 * @param offset - The offset for file listing, used for pagination.
 * @param orderBy - The criteria to order the files by.
 * @returns A promise that resolves to an array of file names.
 */
export async function listFiles(directory: string, limit: number, offset: number, orderBy: "datetime" | "filename"): Promise<string[]> {
    // Validate inputs
    if (!directory || typeof directory !== 'string') {
        const errorMessage = 'Directory must be provided and must be a string.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }
    if (typeof limit !== 'number' || limit < 0) {
        const errorMessage = 'Limit must be a non-negative number.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }
    if (typeof offset !== 'number' || offset < 0) {
        const errorMessage = 'Offset must be a non-negative number.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }
    if (orderBy !== 'datetime' && orderBy !== 'filename') {
        const errorMessage = 'Order by must be either "datetime" or "filename".';
        debug(errorMessage);
        throw new Error(errorMessage);
    }

    debug('Listing files in directory: ' + directory);
    try {
        if (!fs.existsSync(directory)) {
            const errorMessage = 'Directory does not exist: ' + directory;
            debug(errorMessage);
            return [];
        }
        const files = fs.readdirSync(directory).slice(offset, offset + limit);
        debug('Files listed in directory ' + directory + ': ' + files.join(', '));
        return files;
    } catch (error) {
        const errorMessage = 'Failed to list files in ' + directory + ': ' + (error instanceof Error ? error.message : String(error));
        debug(errorMessage);
        return [];
    }
}
