import fs from 'fs';
import path from 'path';
import { ListParams } from '../../../types/ListParams';
import Debug from 'debug';

const debug = Debug('app:local:listFiles');

/**
 * Lists files in a given directory on the local filesystem.
 * Includes guards, defaults, pagination, sorting, and logging.
 *
 * @param {ListParams} params - Parameters for listing files
 * @returns {Promise<{ files: { name: string, isDirectory: boolean }[], total: number }>}
 */
const listFiles = async ({
  directory = '.',
  limit = 100,
  offset = 0,
  orderBy = 'filename',
  recursive = false,
  typeFilter
}: ListParams): Promise<{ files: { name: string, isDirectory: boolean }[], total: number }> => {
  try {
    // Sanitize & normalize directory - use project root instead of process.cwd()
    const baseDir = path.resolve(__dirname, '../../../../'); // Go up to project root
        const absDir = path.resolve(baseDir, directory.startsWith('/') ? directory.substring(1) : directory);

    debug(`📂 Listing files in: ${absDir}, limit=${limit}, offset=${offset}, orderBy=${orderBy}, recursive=${recursive}, typeFilter=${typeFilter ?? 'both'}`);

    // Guard: directory must exist
    if (!fs.existsSync(absDir)) {
      throw new Error(`Directory does not exist: ${absDir}`);
    }

    // Note: Parameter validation and clamping is now handled by AbstractServerHandler.listFilesWithDefaults()
    const safeLimit = limit;
    const safeOffset = offset;
    const safeOrderBy = orderBy;

    type Item = { name: string; isDirectory: boolean; mtime: Date };

    // Helper: recursively collect entries
    const walk = async (dirAbs: string, relPrefix = ''): Promise<Item[]> => {
      const entries = await fs.promises.readdir(dirAbs, { withFileTypes: true });
      const results: Item[] = [];
      for (const entry of entries) {
        const fullPath = path.join(dirAbs, entry.name);
        const relPath = relPrefix ? path.join(relPrefix, entry.name) : entry.name;
        try {
          const stats = await fs.promises.stat(fullPath);
          const isDir = stats.isDirectory();
          // Apply type filter on inclusion, not traversal
          if (!typeFilter || (typeFilter === 'folders' && isDir) || (typeFilter === 'files' && !isDir)) {
            results.push({ name: relPath, isDirectory: isDir, mtime: stats.mtime });
          }
          if (recursive && isDir) {
            results.push(...(await walk(fullPath, relPath)));
          }
        } catch (err: any) {
          debug(`⚠️ Failed to stat ${fullPath}: ${err.message}`);
        }
      }
      return results;
    };

    let allFiles: Item[] = [];
    if (recursive) {
      allFiles = await walk(absDir);
    } else {
      const entries = await fs.promises.readdir(absDir, { withFileTypes: true });
      const fileStats = await Promise.all(
        entries.map(async (entry) => {
          const filePath = path.join(absDir, entry.name);
          try {
            const stats = await fs.promises.stat(filePath);
            const isDir = stats.isDirectory();
            // Include based on typeFilter at top-level
            if (!typeFilter || (typeFilter === 'folders' && isDir) || (typeFilter === 'files' && !isDir)) {
              return { name: entry.name, isDirectory: isDir, mtime: stats.mtime } as Item;
            }
            return null;
          } catch (err: any) {
            debug(`⚠️ Failed to stat ${filePath}: ${err.message}`);
            return null;
          }
        })
      );
      allFiles = fileStats.filter(Boolean) as Item[];
    }

    // Apply sorting
    if (safeOrderBy === 'datetime') {
      allFiles.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    } else {
      allFiles.sort((a, b) => a.name.localeCompare(b.name));
    }

    const totalFiles = allFiles.length;

    // Apply pagination
    const paginated = allFiles.slice(safeOffset, safeOffset + safeLimit).map(({ name, isDirectory }) => ({
      name,
      isDirectory
    }));

    debug(`✅ Found ${totalFiles} files, returning ${paginated.length}`);

    return { files: paginated, total: totalFiles };
  } catch (err: any) {
    debug(`❌ Error listing files: ${err.message}`);
    throw err;
  }
};

export default listFiles;