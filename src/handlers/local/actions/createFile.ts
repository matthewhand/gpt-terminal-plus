import fs from 'fs/promises';
import path from 'path';
import Debug from 'debug';

const debug = Debug('app:local:createFile');

/**
 * Create a file safely and hardened:
 *  - Validates inputs
 *  - Normalizes and validates path (no traversal outside workspace)
 *  - Ensures parent directory exists
 *  - Optional backup of existing file with timestamp
 *  - Logs truncated content preview
 */
export async function createFile(
  filePath: string,
  content: string = '',
  backup: boolean = true,
  directory?: string
): Promise<boolean> {
  try {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('filePath is required and must be a string.');
    }

    const baseDir = directory || process.cwd();

    // Always resolve relative to baseDir
    const absPath = path.resolve(baseDir, filePath);
    debug(`📂 createFile -> resolved path: ${absPath}`);

    // Guard: prevent traversal outside baseDir
    if (!absPath.startsWith(baseDir)) {
      throw new Error(`Refusing to write outside workspace: ${absPath}`);
    }

    // Ensure parent directory exists
    const parentDir = path.dirname(absPath);
    await fs.mkdir(parentDir, { recursive: true });

    // If file exists and backup requested, backup it
    try {
      await fs.access(absPath);
      if (backup) {
        const data = await fs.readFile(absPath);
        const backupPath = `${absPath}.bak-${Date.now()}`;
        await fs.writeFile(backupPath, data);
        debug(`📦 Backup created: ${backupPath}`);
      }
    } catch {
      // file doesn’t exist, continue
    }

    // Truncate content in logs
    const preview = content.length > 200 ? `${content.slice(0,200)}... (truncated)` : content;
    debug(`📝 Writing content preview: ${preview}`);

    // Write the file
    await fs.writeFile(absPath, content, 'utf8');

    debug(`✅ createFile succeeded: ${absPath}`);
    return true;
  } catch (err: any) {
    debug(`❌ createFile failed: ${err.message}`);
    throw err;
  }
}

export default createFile;
