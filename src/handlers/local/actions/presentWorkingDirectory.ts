import Debug from 'debug';

const debug = Debug('app:local:pwd');

/**
 * Retrieve the present working directory in a hardened way.
 */
export async function presentWorkingDirectory(): Promise<string> {
  try {
    const cwd = process.cwd();
    debug(`✅ presentWorkingDirectory: ${cwd}`);
    return cwd;
  } catch (err: any) {
    debug(`❌ presentWorkingDirectory failed: ${err.message}`);
    throw err;
  }
}

export default presentWorkingDirectory;
