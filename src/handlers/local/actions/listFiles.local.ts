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

    // Guard: clamp pagination values
    const safeLimit = Math.min(Math.max(limit, 1), 5000); // between 1 and 5000
    const safeOffset = Math.max(offset, 0);

    // Guard: allowed orderBy values
    const safeOrderBy = ['filename', 'datetime'].includes(orderBy)
      ? orderBy
      : 'filename';

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

    let validStats: Item[] = [];
    if (recursive) {
      validStats = await walk(absDir);
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
      validStats = fileStats.filter(Boolean) as Item[];
    }

    // Apply sorting
    if (safeOrderBy === 'datetime') {
      validStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    } else {
      validStats.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Apply pagination
    const paginated = validStats.slice(safeOffset, safeOffset + safeLimit).map(({ name, isDirectory }) => ({
      name,
      isDirectory
    }));

    debug(`✅ Found ${validStats.length} files, returning ${paginated.length}`);

    return { files: paginated, total: validStats.length };
  } catch (err: any) {
    debug(`❌ Error listing files: ${err.message}`);
    throw err;
  }
};

export default listFiles;
