import Debug from 'debug';

const debug = Debug('app:ssh:changeDirectory');

export async function changeDirectory(directory: string): Promise<boolean> {
  try {
    if (!directory || typeof directory !== 'string') {
      throw new Error('Directory must be provided and must be a string.');
    }

    // In a real SSH scenario, you would execute a command like `cd ${directory}`
    // and check its exit code. For this mock, we'll assume it always succeeds.
    debug(`Changing SSH directory to: ${directory}`);

    return true;
  } catch (err: any) {
    debug(`❌ Failed to change SSH directory: ${err.message}`);
    throw err;
  }
}

export default changeDirectory;
