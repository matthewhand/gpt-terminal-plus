import * as fs from 'fs';
import * as path from 'path';
import Debug from 'debug';

const debug = Debug('app:createFile');

/**
 * Creates a file with the specified content in the given directory.
 * @param directory - The directory to create the file in.
 * @param filename - The name of the file to create.
 * @param content - The content to write to the file.
 * @param backup - Whether to create a backup if the file already exists.
 * @returns True if the file was created successfully, false otherwise.
 */
export function createFile(directory: string, filename: string, content: string, backup: boolean): boolean {
    // Validate inputs
    if (!directory || typeof directory !== 'string') {
        const errorMessage = 'Directory must be provided and must be a string.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }
    if (!filename || typeof filename !== 'string') {
        const errorMessage = 'Filename must be provided and must be a string.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }
    if (!content || typeof content !== 'string') {
        const errorMessage = 'Content must be provided and must be a string.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }

    const fullPath = path.join(directory, filename);
    debug('Creating file: ' + fullPath);
    try {
        if (!fs.existsSync(directory)) {
            const errorMessage = 'Directory does not exist: ' + directory;
            debug(errorMessage);
            throw new Error(errorMessage);
        }
        if (backup && fs.existsSync(fullPath)) {
            fs.copyFileSync(fullPath, fullPath + '.bak');
        }
        fs.writeFileSync(fullPath, content);
        debug('File created successfully at ' + fullPath);
        return true;
    } catch (error) {
        const errorMessage = 'Error creating file at ' + fullPath + ': ' + (error instanceof Error ? error.message : 'Unknown error');
        debug(errorMessage);
        throw new Error(errorMessage);
    }
}
