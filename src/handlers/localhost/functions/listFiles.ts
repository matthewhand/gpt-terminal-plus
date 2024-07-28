import * as fs from 'fs';
import * as path from 'path';
import { createPaginatedResponse } from '../../../utils/PaginationUtils';
import { PaginatedResponse } from '../../../types/index';

/**
 * Lists files in a specified directory on the local server.
 * @param directory - The directory to list files in.
 * @param limit - Maximum number of files to return.
 * @param offset - Number of files to skip before starting to collect the result set.
 * @param orderBy - Criteria to order files by.
 * @returns A paginated response containing files in the directory.
 */
export async function listFiles(directory: string = '', limit: number = 42, offset: number = 0, orderBy: 'filename' | 'datetime' = 'filename'): Promise<PaginatedResponse> {
    const targetDirectory = directory || process.cwd();
    try {
        const entries = await fs.promises.readdir(targetDirectory, { withFileTypes: true });
        let files = entries.filter(entry => entry.isFile()).map(entry => entry.name);

        if (orderBy === 'datetime') {
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
        console.error(`Failed to list files in directory '${targetDirectory}': ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}