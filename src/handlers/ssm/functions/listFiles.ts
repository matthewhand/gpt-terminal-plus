import { createPaginatedResponse } from '../../../utils/PaginationUtils';
import { PaginatedResponse } from '../../../types/response';
import executeCommand from '../../../utils/SSHCommandExecutor';

export async function listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: string = 'filename'): Promise<PaginatedResponse> {
  const command = `ls -la ${directory}`;
  const { stdout, stderr } = await executeCommand(command);

  if (stderr) {
    throw new Error(`Failed to list files: ${stderr}`);
  }

  const files = stdout.split('\\n').slice(1).map(line => line.split(/\\s+/).pop()!).filter(file => file);

  return createPaginatedResponse(files, limit, offset);
}
