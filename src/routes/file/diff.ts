import { Request, Response } from 'express';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';
import { writeFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Apply a unified diff using git apply
 * @route POST /file/diff
 */
export const applyDiff = async (req: Request, res: Response) => {
  const { diff, dryRun = false } = req.body;

  if (!diff || typeof diff !== 'string') {
    return res.status(400).json({ error: 'Diff content is required' });
  }

  const tempFile = path.join('/tmp', `patch-${Date.now()}.diff`);

  try {
    const server = getServerHandler(req);
    
    // Write diff to temp file
    await writeFile(tempFile, diff, 'utf8');

    // Validate diff with git apply --check
    const checkCmd = `git apply --check ${tempFile}`;
    
    try {
      await execAsync(checkCmd);
    } catch (error) {
      await unlink(tempFile);
      return res.status(400).json({ 
        error: 'Invalid diff format', 
        details: error instanceof Error ? error.message : String(error)
      });
    }

    if (dryRun) {
      await unlink(tempFile);
      return res.json({ success: true, dryRun: true, message: 'Diff validation passed' });
    }

    // Apply the diff
    const applyCmd = `git apply ${tempFile}`;
    const result = await execAsync(applyCmd);

    await unlink(tempFile);

    res.json({
      success: true,
      message: 'Diff applied successfully',
      stdout: result.stdout,
      stderr: result.stderr
    });

  } catch (error) {
    try {
      await unlink(tempFile);
    } catch {}
    
    handleServerError(error, res, 'Error applying diff');
  }
};