import * as fs from 'fs';
import * as path from 'path';

/**
 * Creates a file with the specified content in the given directory.
 * @param directory - The directory to create the file in.
 * @param filename - The name of the file to create.
 * @param content - The content to write to the file.
 * @param backup - Whether to create a backup if the file already exists.
 * @returns True if the file was created successfully, false otherwise.
 */
export function createFile(directory: string, filename: string, content: string, backup: boolean): boolean {
    const fullPath = path.join(directory, filename);
    console.log('Creating file: ' + fullPath);
    try {
        if (!fs.existsSync(directory)) {
            const errorMessage = 'Directory does not exist: ' + directory;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        if (backup && fs.existsSync(fullPath)) {
            fs.copyFileSync(fullPath, fullPath + '.bak');
        }
        fs.writeFileSync(fullPath, content);
        return true;
    } catch (error) {
        console.error('Error creating file:', error);
        throw error;
    }
}
