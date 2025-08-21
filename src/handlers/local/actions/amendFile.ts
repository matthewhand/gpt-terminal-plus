import fs from 'fs/promises';
import path from 'path';
import Debug from 'debug';

const debug = Debug('app:local:amendFile');

export async function amendFile(
  filePath: string,
  content: string,
  backup: boolean = true,
  directory?: string
): Promise<boolean> {
  try {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('filePath is required and must be a string.');
    }

    const baseDir = directory || process.cwd();
    const absPath = path.resolve(baseDir, filePath);

    if (!absPath.startsWith(baseDir)) {
      throw new Error(`Refusing to amend outside workspace: ${absPath}`);
    }

    try {
      await fs.access(absPath);
      if (backup) {
        const data = await fs.readFile(absPath);
        const backupPath = `${absPath}.bak-${Date.now()}`;
        await fs.writeFile(backupPath, data);
        debug(`📦 Backup created: ${backupPath}`);
      }
    } catch {
      // File doesn’t exist, continue
    }

    await fs.mkdir(path.dirname(absPath), { recursive: true });

    await fs.appendFile(absPath, content, 'utf8');

    debug(`✅ amendFile succeeded: ${absPath}`);
    return true;
  } catch (err: any) {
    debug(`❌ amendFile failed: ${err.message}`);
    throw err;
  }
}

export default amendFile;