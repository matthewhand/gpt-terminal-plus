import { Request, Response } from 'express';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';
import { writeFile, unlink, readFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Apply a structured patch to a file
 * @route POST /file/patch
 */
export const applyPatch = async (req: Request, res: Response) => {
  const { file, search, replace, startLine, endLine, dryRun = false } = req.body;

  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'File path is required' });
  }

  if (!search && !startLine) {
    return res.status(400).json({ error: 'Either search string or startLine is required' });
  }

  try {
    const server = getServerHandler(req);
    
    // Read current file content
    const content = await readFile(file, 'utf8');
    const lines = content.split('\n');
    
    let newContent: string;
    
    if (search && replace !== undefined) {
      // Search and replace mode
      if (!content.includes(search)) {
        return res.status(400).json({ error: 'Search string not found in file' });
      }
      newContent = content.replace(search, replace);
    } else if (startLine !== undefined) {
      // Line range mode
      const start = Math.max(0, startLine - 1); // Convert to 0-based
      const end = endLine ? Math.min(lines.length, endLine) : start + 1;
      
      if (start >= lines.length) {
        return res.status(400).json({ error: 'Start line exceeds file length' });
      }
      
      const newLines = [...lines];
      if (replace !== undefined) {
        newLines.splice(start, end - start, replace);
      } else {
        newLines.splice(start, end - start); // Delete lines
      }
      newContent = newLines.join('\n');
    } else {
      return res.status(400).json({ error: 'Invalid patch parameters' });
    }

    if (dryRun) {
      return res.json({ 
        success: true, 
        dryRun: true, 
        preview: newContent.split('\n').slice(0, 10).join('\n') + '...'
      });
    }

    // Create backup
    const backupFile = `${file}.backup.${Date.now()}`;
    await writeFile(backupFile, content, 'utf8');

    // Apply patch
    await writeFile(file, newContent, 'utf8');

    res.json({
      success: true,
      message: 'Patch applied successfully',
      backup: backupFile,
      linesChanged: newContent.split('\n').length - lines.length
    });

  } catch (error) {
    handleServerError(error, res, 'Error applying patch');
  }
};