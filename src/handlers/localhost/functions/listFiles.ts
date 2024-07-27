import { createPaginatedResponse } from '../../../utils/PaginationUtils';
import { PaginatedResponse } from '../../../types/response';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: string = 'filename'): Promise<PaginatedResponse> {
  const command = `ls -la ${directory}`;
  const { stdout, stderr } = await execPromise(command);

  if (stderr) {
    throw new Error(`Failed to list files: ${stderr}`);
  }

  const files = stdout.split('\n').slice(1).map(line => line.split(/\s+/).pop()!).filter(file => file);

  return createPaginatedResponse(files, limit, offset);
}
