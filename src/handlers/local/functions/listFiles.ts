import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

/**
 * Lists files in a directory with detailed information.
 * @param {string} directory - The directory to list files from.
 * @returns {Promise<{ name: string, isDirectory: boolean }[]>} - A promise that resolves with the list of files and their types.
 */
export const listFiles = async (directory: string): Promise<{ name: string, isDirectory: boolean }[]> => {
  try {
    const fileNames = await readdir(directory);

    // Create a promise for each file to get detailed information
    const fileInfos = await Promise.all(fileNames.map(async (name) => {
      const filePath = path.join(directory, name);
      const fileStat = await stat(filePath);
      return { name, isDirectory: fileStat.isDirectory() };
    }));

    return fileInfos;
  } catch (error) {
    console.error('Error listing files in directory:', directory, error);
    throw error;
  }
};
