import fs from 'fs';
import path from 'path';
import Debug from 'debug';
import { getPresentWorkingDirectory } from '../../../utils/GlobalStateHelper';

const debug = Debug('app:local:createFile');

export async function createFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
  try {
    // Input validation
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('File path must be provided and must be a string.');
    }
    if (!content || typeof content !== 'string') {
      throw new Error('Content must be provided and must be a string.');
    }

    // Resolve absolute or relative path
    let targetPath = filePath;
    if (!path.isAbsolute(filePath)) {
      const base = process.env.NODE_CONFIG_DIR || getPresentWorkingDirectory() || '';
      targetPath = path.join(base, filePath);
    }

    debug(`📂 createFile -> resolved path: ${targetPath}`);

    // If file exists and backup requested, copy to .bak
    try {
      if (fs.existsSync(targetPath)) {
        if (backup) {
          await fs.promises.copyFile(targetPath, `${targetPath}.bak`);
          debug(`📦 Backup created: ${targetPath}.bak`);
        }
      }
    } catch (e: any) {
      throw new Error(`Failed to create file ${targetPath}: ${e?.message || String(e)}`);
    }

    // Ensure parent directory exists (best-effort)
    try { await fs.promises.mkdir(path.dirname(targetPath), { recursive: true }); } catch {}

    // Write file content
    await fs.promises.writeFile(targetPath, content);
    debug(`✅ createFile succeeded: ${targetPath}`);
    return true;
  } catch (err: any) {
    debug(`❌ createFile failed: ${err?.message || String(err)}`);
    if (/^Failed to create file /.test(err?.message)) throw err;
    throw new Error(`Failed to create file ${filePath}: ${err?.message || String(err)}`);
  }
}

export default createFile;
