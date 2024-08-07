import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

export const updateFile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filePath, pattern, replacement, backup = true, multiline = false } = req.body;

    // Validate input parameters
    if (typeof filePath !== 'string' || !filePath.trim()) {
      return res.status(400).json({ message: 'filePath must be provided and must be a string.' });
    }
    if (typeof pattern !== 'string' || !pattern.trim()) {
      return res.status(400).json({ message: 'pattern must be provided and must be a string.' });
    }
    if (typeof replacement !== 'string') {
      return res.status(400).json({ message: 'replacement must be provided and must be a string.' });
    }

    const resolvedPath = path.resolve(filePath);

    // Read the file content
    let fileContent = await fs.readFile(resolvedPath, 'utf8');

    // Create the backup if required
    if (backup) {
      await fs.writeFile(resolvedPath + '.bak', fileContent);
    }

    // Replace the pattern with the replacement
    const regex = new RegExp(pattern, multiline ? 'gm' : 'g');
    fileContent = fileContent.replace(regex, replacement);

    // Write the updated content back to the file
    await fs.writeFile(resolvedPath, fileContent);

    return res.status(200).json({ message: 'File updated successfully.' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Failed to update file: ' + errorMessage });
  }
};
