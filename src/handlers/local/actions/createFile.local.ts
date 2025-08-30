import fs from 'fs';
import path from 'path';
import Debug from 'debug';
import { getPresentWorkingDirectory } from '../../../utils/GlobalStateHelper';

const debug = Debug('app:local:createFile');

export async function createFile(filePath: string, content: string, backup: boolean = true, directory?: string): Promise<boolean> {
  // Input validation
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('File path must be provided and must be a string.');
  }
  if (typeof content !== 'string') {
    throw new Error('Content must be a string.');
  }

  // Resolve absolute or relative path using provided directory when present
  const projectRoot = path.resolve(__dirname, '../../../../');
  let targetPath = filePath;
  if (!path.isAbsolute(filePath)) {
    const base = directory
      ? path.resolve(projectRoot, directory)
      : (process.env.NODE_CONFIG_DIR || getPresentWorkingDirectory() || projectRoot);
    // Intentionally do not wrap path resolution errors; tests expect raw errors here
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
    const cause = e instanceof Error ? e.message : (typeof e === 'string' ? e : String(e));
    throw new Error(`Failed to create file ${targetPath}: ${cause}`);
  }

  // Ensure parent directory exists (best-effort)
  try {
    await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
  } catch {
    // ignore
  }

  // Write file content
  try {
    await fs.promises.writeFile(targetPath, content);
  } catch (err: any) {
    const cause = err instanceof Error ? err.message : (typeof err === 'string' ? err : String(err));
    throw new Error(`Failed to create file ${filePath}: ${cause}`);
  }

  debug(`✅ createFile succeeded: ${targetPath}`);
  return true;
}

export default createFile;
