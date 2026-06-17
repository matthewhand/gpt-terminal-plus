import { Request, Response } from 'express';
import { applyFilePatch } from '../../handlers/local/actions/applyFilePatch';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import Debug from 'debug';
import { getServerHandler, isLocalServerHandler } from '../../utils/getServerHandler';
import { resolveSafePath } from '../../utils/pathSafety';

const debug = Debug('app:fuzzyPatch');

/**
 * Apply a fuzzy patch to a file using diff-match-patch.
 * Local-only: fuzzy patching reads/writes the local filesystem, so remote
 * targets (ssh/ssm) receive a 501 rather than silently patching local files.
 * @route POST /file/fuzzy-patch
 */
export const applyFuzzyPatch = async (req: Request, res: Response) => {
  const { filePath: requestedPath, oldText, newText, preview = false } = req.body;

  if (!requestedPath || typeof requestedPath !== 'string') {
    return res.status(400).json({ error: 'filePath is required' });
  }

  if (!oldText || typeof oldText !== 'string') {
    return res.status(400).json({ error: 'oldText is required' });
  }

  if (!newText || typeof newText !== 'string') {
    return res.status(400).json({ error: 'newText is required' });
  }

  const handler = getServerHandler(req);
  if (!isLocalServerHandler(handler)) {
    return res.status(501).json({
      success: false,
      error: 'fuzzy-patch is not supported for the selected server handler; select the local server for this operation',
    });
  }

  const filePath = resolveSafePath(requestedPath);
  if (!filePath) {
    return res.status(400).json({
      success: false,
      error: `filePath resolves outside the working root: ${requestedPath}`,
    });
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({
      error: 'File not found',
      success: false,
    });
  }

  try {

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
