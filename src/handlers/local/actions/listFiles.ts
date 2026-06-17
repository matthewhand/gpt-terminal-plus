import fs from 'fs';
import path from 'path';
import { ListParams } from '../../../types/ListParams';

/**
 * Lists files in a given directory.
 * - Defaults directory to "."
 * - Clamps limit/offset
 * - Validates orderBy
 * - Uses safe stat handling (symlinks/broken entries)
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
    const dirInput = (directory && directory.trim() !== '') ? directory : '.';
    let resolvedDir: string;
    try {
      resolvedDir = path.resolve(dirInput);
    } catch (e) {
      return reject(new Error(`Invalid directory: ${String(e)}`));
    }

    try {
      const stat = fs.statSync(resolvedDir);
      if (!stat.isDirectory()) {
        return reject(new Error(`Not a directory: ${resolvedDir}`));
      }
    } catch {
      return reject(new Error(`Directory does not exist: ${resolvedDir}`));
    }

    const safeOffset = Math.max(0, offset ?? 0);
    const safeLimit = Math.min(Math.max(1, limit ?? 50), 1000);
    const sortBy: 'datetime' | 'filename' = (orderBy === 'datetime' || orderBy === 'filename') ? orderBy : 'filename';

    fs.readdir(resolvedDir, (err, files) => {
      if (err) {
        return reject(err);
      }

      const fileStats = files.map(file => {
        const filePath = path.join(resolvedDir, file);
        try {
          const stats = fs.lstatSync(filePath);
          return { name: file, isDirectory: stats.isDirectory() };
        } catch {
          // Broken symlink or permission error – treat as non-directory entry and allow listing to continue
          return { name: file, isDirectory: false };
        }
      });

      // Apply ordering
      if (sortBy === 'datetime') {
        fileStats.sort((a, b) => {
          const aPath = path.join(resolvedDir, a.name);
          const bPath = path.join(resolvedDir, b.name);
          let aTime = 0;
          let bTime = 0;
          try { aTime = fs.statSync(aPath).mtime.getTime(); } catch { aTime = 0; }
          try { bTime = fs.statSync(bPath).mtime.getTime(); } catch { bTime = 0; }
          return bTime - aTime;
        });
      } else {
        fileStats.sort((a, b) => a.name.localeCompare(b.name));
      }

      // Apply pagination
      const paginatedFiles = fileStats.slice(safeOffset, safeOffset + safeLimit);

      resolve({
        files: paginatedFiles,
        total: fileStats.length
      });
    });
  });
};

export default listFiles;
