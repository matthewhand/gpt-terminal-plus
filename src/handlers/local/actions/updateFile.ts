import fs from 'fs/promises';
import path from 'path';
import Debug from 'debug';

const debug = Debug('app:local:updateFile');

/**
 * Update a file’s contents with a regex replacement in a hardened way.
 * - Validates inputs
 * - Resolves relative to provided directory or cwd
 * - Prevents traversal outside workspace
 * - Creates optional backup before modifying
 */
export async function updateFile(
  filePath: string,
  pattern: string,
  replacement: string,
  backup: boolean = true,
  multiline: boolean = false,
  directory?: string
): Promise<boolean> {
  try {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('filePath is required and must be a string.');
    }
    if (typeof pattern !== 'string') {
      throw new Error('pattern must be a string');
    }

    const baseDir = directory || process.cwd();
    const absPath = path.resolve(baseDir, filePath);

    // Guard: prevent traversal
    if (!absPath.startsWith(baseDir)) {
      throw new Error(`Refusing to update outside workspace: ${absPath}`);
    }

    // Ensure file exists
    const stat = await fs.stat(absPath).catch(() => null);
    if (!stat || !stat.isFile()) {
      throw new Error(`Target not found or not a file: ${absPath}`);
    }

    // Backup
    if (backup) {
      const data = await fs.readFile(absPath);
      const backupPath = `${absPath}.bak-${Date.now()}`;
      await fs.writeFile(backupPath, data);
      debug(`📦 Backup created: ${backupPath}`);
    }

    // Perform replacement
    const regex = multiline ? new RegExp(pattern, 'gm') : new RegExp(pattern, 'g');
    const content = await fs.readFile(absPath, 'utf8');
    const updated = content.replace(regex, replacement);

    await fs.writeFile(absPath, updated, 'utf8');

    debug(`✅ updateFile succeeded: ${absPath}`);
    return true;
  } catch (err: any) {
    debug(`❌ updateFile failed: ${err.message}`);
    throw err;
  }
}

export default updateFile;
