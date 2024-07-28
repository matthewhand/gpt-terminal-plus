import * as fs from 'fs';
import * as path from 'path';

/**
 * Creates a file in the specified directory on the local server.
 * @param directory - The directory to create the file in.
 * @param filename - The name of the file to create.
 * @param content - The content to write to the file.
 * @param backup - Whether to create a backup of the file if it exists.
 * @returns True if the file is created successfully.
 */
export async function createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    const fullPath = path.join(directory, filename);
    try {
        if (backup && fs.existsSync(fullPath)) {
            const backupPath = fullPath + '.bak';
            await fs.promises.copyFile(fullPath, backupPath);
        }
        await fs.promises.writeFile(fullPath, content);
        return true;
    } catch (error) {
        console.error(`Failed to create file '${fullPath}': ${error instanceof Error ? error.message : String(error)}`);
        return false;
    }
}