import { Request, Response } from 'express';
import { applyFilePatch } from '../../handlers/local/actions/applyFilePatch';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import Debug from 'debug';

const debug = Debug('app:fuzzyPatch');

/**
 * Apply a fuzzy patch to a file using diff-match-patch
 * @route POST /file/fuzzy-patch
 */
export const applyFuzzyPatch = async (req: Request, res: Response) => {
  const { filePath, oldText, newText, preview = false } = req.body;

  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: 'filePath is required' });
  }

  if (!oldText || typeof oldText !== 'string') {
    return res.status(400).json({ error: 'oldText is required' });
  }

  if (!newText || typeof newText !== 'string') {
    return res.status(400).json({ error: 'newText is required' });
  }

  // Reject when there's no actual change requested
  if (oldText === newText) {
    return res.status(400).json({ success: false, error: 'No changes to apply' });
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({
      error: 'File not found',
      success: false,
    });
  }

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ success: false, error: `File not found: ${filePath}` });
    }

    // Preview: apply without writing and return patched text
    if (preview) {
      const previewResult = applyFilePatch({ filePath, oldText, newText, preview: true });
      if (!previewResult.success) {
        return res.status(400).json({
          error: previewResult.error || 'Patch could not be applied',
          success: false,
        });
      }
      return res.json({
        success: true,
        preview: true,
        patchedText: previewResult.patchedText,
        results: previewResult.results,
        message: 'Preview generated successfully',
      });
    }

    // Non-preview: backup original THEN apply patch
    const backupFile = `${filePath}.backup.${Date.now()}`;
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    await writeFile(backupFile, originalContent, 'utf8');

    const applyResult = applyFilePatch({ filePath, oldText, newText, preview: false });
    if (!applyResult.success) {
      return res.status(400).json({
        error: applyResult.error || 'Patch could not be applied',
        success: false,
      });
    }

    return res.json({
      success: true,
      message: 'Fuzzy patch applied successfully',
      backup: backupFile,
      results: applyResult.results,
      appliedPatches: applyResult.results?.filter(r => r).length || 0,
      totalPatches: applyResult.results?.length || 0,
    });
  } catch (error) {
    debug('Error applying fuzzy patch', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: (error as Error).message,
    });
  }
};
