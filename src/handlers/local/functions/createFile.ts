import * as fs from 'fs';
import * as path from 'path';

/**
 * Creates a file with the specified content.
 * @param directory - The directory where the file will be created.
 * @param filename - The name of the file to create.
 * @param content - The content to write to the file.
 * @param backup - Whether to create a backup of the existing file.
 * @returns A promise that resolves to true if the file was created successfully, false otherwise.
 */
export async function createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
    console.log(`Creating file: ${directory}/${filename}`);
    const fullPath = path.join(directory, filename);
    try {
        if (!fs.existsSync(directory)) {
            console.error(`Directory does not exist: ${directory}`);
            return false;
        }
        if (backup && fs.existsSync(fullPath)) {
            fs.copyFileSync(fullPath, `${fullPath}.bak`);
        }
        fs.writeFileSync(fullPath, content);
        return true;
    } catch (error) {
        console.error(`Failed to create file '${fullPath}': ${error instanceof Error ? error.message : String(error)}`);
        return false;
    }
}
