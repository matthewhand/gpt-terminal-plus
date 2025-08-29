import { executeFileOperation } from '../../engines/fileEngine';
import fs from 'fs/promises';

jest.mock('fs/promises');
jest.mock('../../config/convictConfig', () => ({
  convictConfig: () => ({
    get: () => [process.cwd()]
  })
}));

describe('File Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should read file successfully', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('file content');
    const result = await executeFileOperation({ type: 'read', path: './test.txt' });
    expect(result).toBe('file content');
    expect(fs.readFile).toHaveBeenCalled();
  });

  test('should write file successfully', async () => {
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    const result = await executeFileOperation({ 
      type: 'write', 
      path: './test.txt', 
      content: 'new content' 
    });
    expect(result.success).toBe(true);
    expect(fs.writeFile).toHaveBeenCalled();
  });

  test('should handle file operation errors', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));
    await expect(executeFileOperation({ type: 'read', path: './missing.txt' }))
      .rejects.toThrow('File not found');
  });

  test('should reject unauthorized paths', async () => {
    await expect(executeFileOperation({ 
      type: 'read', 
      path: '/etc/passwd' 
    })).rejects.toThrow('Path not allowed');
  });

  test('should handle path traversal attempts', async () => {
    await expect(executeFileOperation({ 
      type: 'read', 
      path: '../../../etc/passwd' 
    })).rejects.toThrow('Path not allowed');
  });
});