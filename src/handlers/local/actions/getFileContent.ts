import fs from 'fs/promises';
import path from 'path';
import Debug from 'debug';

const debug = Debug('app:local:getFileContent');

/**
 * Get the content of a local file in a hardened way:
 *  - Validates input
 *  - Resolves & normalizes path relative to directory or cwd
 *  - Prevents traversal outside workspace
 *  - Ensures file exists and is not a directory
 *  - Logs file metadata
 */
export async function getFileContent(filePath: string, directory?: string): Promise<string> {
  try {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('filePath is required and must be a string.');
    }

    const baseDir = directory || process.cwd();

    // Always resolve relative to baseDir
    const absPath = path.resolve(baseDir, filePath);
    debug(`📂 getFileContent -> resolved path: ${absPath}`);

    // Guard: prevent traversal outside baseDir
    if (!absPath.startsWith(baseDir)) {
      throw new Error(`Refusing to read outside workspace: ${absPath}`);
    }

    // Guard: ensure file exists and is a file
    const stat = await fs.stat(absPath).catch(() => null);
    if (!stat) {
      throw new Error(`File not found: ${absPath}`);
    }
    if (!stat.isFile()) {
      throw new Error(`Target is not a file: ${absPath}`);
    }

    // Read file
    const content = await fs.readFile(absPath, 'utf8');
    debug(`✅ getFileContent succeeded: ${absPath} (size=${content.length} bytes)`);

    return content;
  } catch (err: any) {
    debug(`❌ getFileContent failed: ${err.message}`);
    throw err;
  }
}

export default getFileContent;
