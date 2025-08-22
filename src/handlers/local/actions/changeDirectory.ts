
import path from 'path';
import fs from 'fs/promises';
import Debug from 'debug';

const debug = Debug('app:local:changeDirectory');

export async function changeDirectory(directory: string, baseDir?: string): Promise<boolean> {
  try {
    if (!directory || typeof directory !== 'string') {
      throw new Error('directory is required and must be a string.');
    }

    // Use project root instead of process.cwd() for consistent path resolution
    const projectRoot = path.resolve(__dirname, '../../../../');
    const base = baseDir ? path.resolve(projectRoot, baseDir) : projectRoot;
    const resolvedPath = path.resolve(base, directory);

    if (!resolvedPath.startsWith(base)) {
      throw new Error(`Refusing to change to directory outside workspace: ${resolvedPath}`);
    }

    const stat = await fs.stat(resolvedPath);
    if (!stat.isDirectory()) {
      throw new Error(`Target is not a directory: ${resolvedPath}`);
    }

    process.chdir(resolvedPath);
    debug(`✅ changeDirectory succeeded: ${resolvedPath}`);
    return true;
  } catch (err: any) {
    debug(`❌ changeDirectory failed: ${err.message}`);
    throw err;
  }
}
