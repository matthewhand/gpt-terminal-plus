import fs from 'fs';
import path from 'path';
import { getPresentWorkingDirectory } from '../../../utils/GlobalStateHelper';
import Debug from 'debug';

const debug = Debug('app:createFile');

export async function createFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
  debug('Received parameters: %O', { filePath, content, backup });

  if (!filePath || typeof filePath !== 'string') {
    debug('File path must be provided and must be a string.');
    throw new Error('File path must be provided and must be a string.');
  }

  if (!content || typeof content !== 'string') {
    debug('Content must be provided and must be a string.');
    throw new Error('Content must be provided and must be a string.');
  }

  const baseDir = process.env.NODE_CONFIG_DIR || getPresentWorkingDirectory();
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(baseDir, filePath);
  debug('Resolved full path: %s', fullPath);

  try {
    if (backup && fs.existsSync(fullPath)) {
      debug('Backing up existing file to %s.bak', fullPath);
      await fs.promises.copyFile(fullPath, fullPath + '.bak');
    }

    debug('Writing file to path: %s with content: %s', fullPath, content);
    await fs.promises.writeFile(fullPath, content);
    debug('File created successfully');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      debug('Failed to create file %s: %s', fullPath, error.message);
      throw new Error(`Failed to create file ${fullPath}: ${error.message}`);
    } else {
      debug('Failed to create file %s: %O', fullPath, error);
      throw new Error(`Failed to create file ${fullPath}: ${error}`);
    }
  }
}
