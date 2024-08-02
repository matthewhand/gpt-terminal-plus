import fs from 'fs';
import path from 'path';
import { ListParams } from '../../types/ListParams';

/**
 * Lists files in a given directory.
 * @param {ListParams} params - The parameters for listing files.
 * @returns {Promise<{ files: { name: string, isDirectory: boolean }[], total: number }>} - A promise that resolves with the list of files and total count.
 */
const listFiles = ({
  directory,
  limit,
  offset,
  orderBy
}: ListParams): Promise<{ files: { name: string, isDirectory: boolean }[], total: number }> => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err);
      }

      const fileStats = files.map(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        return { name: file, isDirectory: stats.isDirectory() };
      });

      // Apply ordering
      if (orderBy === 'datetime') {
        fileStats.sort((a, b) => {
          const aStats = fs.statSync(path.join(directory, a.name));
          const bStats = fs.statSync(path.join(directory, b.name));
          return bStats.mtime.getTime() - aStats.mtime.getTime();
        });
      } else if (orderBy === 'filename') {
        fileStats.sort((a, b) => a.name.localeCompare(b.name));
      }

      // Apply pagination
      const paginatedFiles = fileStats.slice(offset || 0, (offset || 0) + (limit || fileStats.length));

      resolve({
        files: paginatedFiles,
        total: fileStats.length
      });
    });
  });
};

export default listFiles;
