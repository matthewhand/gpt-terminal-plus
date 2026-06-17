import path from 'path';
import Debug from 'debug';

const debug = Debug('app:local:changeDirectory');

export async function changeDirectory(directory: string, currentProjectDirectory: string): Promise<boolean> {
  try {
    if (!directory || typeof directory !== 'string') {
      throw new Error('Directory must be provided and must be a string.');
    }

    // Resolve the new directory relative to the current project directory
    const newAbsolutePath = path.resolve(currentProjectDirectory, directory);

    // In a real scenario, you would perform a check here to ensure the directory exists
    // and is accessible. For this mock, we'll assume it always succeeds.
    debug(`Changing local directory to: ${newAbsolutePath}`);

    // For local handler, changing directory means updating the context for subsequent operations.
    // This is typically managed by the calling process (e.g., the shell session).
    // For this simplified action, we just return true if the path is valid.
    return true;
  } catch (err: any) {
    debug(`❌ Failed to change local directory: ${err.message}`);
    throw err;
  }
}

export default changeDirectory;
