import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

export const amendFile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filePath, content, backup = true } = req.body;

    // Validate input parameters
    if (typeof filePath !== 'string' || !filePath.trim()) {
      return res.status(400).json({ message: 'filePath must be provided and must be a string.' });
    }
    if (typeof content !== 'string') {
      return res.status(400).json({ message: 'content must be provided and must be a string.' });
    }

    const resolvedPath = path.resolve(filePath);

    // Read the existing file content
    let fileContent = await fs.readFile(resolvedPath, 'utf8');

    // Create the backup if required
    if (backup) {
      await fs.writeFile(resolvedPath + '.bak', fileContent);
    }

    // Append the new content to the file content
    fileContent += content;

    // Write the updated content back to the file
    await fs.writeFile(resolvedPath, fileContent);

    return res.status(200).json({ message: 'File amended successfully.' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Failed to amend file: ' + errorMessage });
  }
};
