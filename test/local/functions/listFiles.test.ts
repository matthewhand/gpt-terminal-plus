import { listFiles } from '../../../src/handlers/local/functions/listFiles';
import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);

jest.mock('fs', () => ({
  readdir: jest.fn(),
}));

describe('listFiles', () => {
  const mockDirectory = '/mock/directory';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list files in a directory', async () => {
    const mockFiles = ['file1.txt', 'file2.txt'];
    (readdir as jest.Mock).mockResolvedValue(mockFiles);

    const files = await listFiles(mockDirectory);
    expect(files).toEqual(mockFiles);
    expect(readdir).toHaveBeenCalledWith(mockDirectory);
  });

  it('should throw an error if directory does not exist', async () => {
    const errorMessage = 'Directory not found';
    (readdir as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(listFiles(mockDirectory)).rejects.toThrow(errorMessage);
    expect(readdir).toHaveBeenCalledWith(mockDirectory);
  });
});
