import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function executeLocalCommand(command: string): Promise<{ stdout: string, stderr: string }> {
  return await execPromise(command);
}
