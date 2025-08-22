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
  orderBy = 'filename'
}: ListParams): Promise<{ files: { name: string, isDirectory: boolean }[], total: number }> => {
  try {
    // Sanitize & normalize directory - use project root instead of process.cwd()
    const baseDir = path.resolve(__dirname, '../../../../'); // Go up to project root
    const absDir = path.resolve(baseDir, directory);

    debug(`📂 Listing files in: ${absDir}, limit=${limit}, offset=${offset}, orderBy=${orderBy}`);

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

    // Read files
    const files = await fs.promises.readdir(absDir);

    // Collect stats safely
    const fileStats = await Promise.all(
      files.map(async file => {
        const filePath = path.join(absDir, file);
        try {
          const stats = await fs.promises.stat(filePath);
          return { name: file, isDirectory: stats.isDirectory(), mtime: stats.mtime };
        } catch (err: any) {
          debug(`⚠️ Failed to stat ${filePath}: ${err.message}`);
          return null;
        }
      })
    );

    // Filter out failed stats
    const validStats = fileStats.filter(Boolean) as { name: string; isDirectory: boolean; mtime: Date }[];

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
