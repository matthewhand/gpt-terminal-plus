import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { validateInput, validationPatterns, sanitizers } from "../../middlewares/inputValidation";
import { applyFilePatch } from '../../handlers/local/actions/applyFilePatch';
import { writeFile, readFile as fsReadFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import Debug from 'debug';

const debug = Debug('app:fileRoutes');
const execAsync = promisify(exec);

export const createFile = async (req: Request, res: Response) => {
  const { filePath, content = '', backup = true } = req.body;

  if (!filePath) {
    return res.status(400).json({
      status: 'error',
      message: 'File path is required',
      data: null
    });
  }

  if (typeof filePath !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'File path must be a string',
      data: null
    });
  }

  const pathValidation = validateInput(filePath, validationPatterns.safePath, 'File path');
  if (!pathValidation.isValid) {
    return res.status(400).json({
      status: 'error',
      message: pathValidation.errors.join(', '),
      data: null
    });
  }

  let sanitizedPath = sanitizers.sanitizePath(pathValidation.sanitizedValue);
  if (filePath.startsWith('/') && !sanitizedPath.startsWith('/')) {
    sanitizedPath = '/' + sanitizedPath;
  }
  const sanitizedContent = sanitizers.sanitizeString(content, 1000000);

  try {
    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    const success = await server.createFile(sanitizedPath, sanitizedContent, backup);

    if (success) {
      res.status(200).json({
        status: 'success',
        message: 'File created successfully',
        data: { filePath: sanitizedPath, backup }
      });
    } else {
      res.status(400).json({ 
        status: 'error', 
        message: 'Failed to create file', 
        data: null 
      });
    }
  } catch (error) {
    handleServerError(error, res, "Error creating file");
  }
};

export async function readFile(req: Request, res: Response): Promise<void> {
  try {
    const { filePath, startLine, endLine, encoding, maxBytes } = req.body || {};

    if (typeof filePath !== 'string' || !filePath.trim()) {
      res.status(400).json({ 
        status: 'error', 
        message: 'filePath must be provided and must be a string', 
        data: null 
      });
      return;
    }

    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    const fileContent = await server.readFile(filePath, { startLine, endLine, encoding, maxBytes });

    res.status(200).json({ 
      status: 'success', 
      message: 'File read successfully', 
      data: fileContent 
    });
  } catch (error) {
    handleServerError(error, res, 'Failed to read file');
  }
}

/**
 * @deprecated Use applyFuzzyPatch for better fuzzy matching and conflict resolution.
 * Kept temporarily for backward compatibility with trivial replaces.
 */
export const updateFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, pattern, replacement, backup = true, multiline = false } = req.body;

    if (typeof filePath !== 'string' || !filePath.trim()) {
      res.status(400).json({ message: 'filePath must be provided and must be a string.' });
      return;
    }
    if (typeof pattern !== 'string' || !pattern.trim()) {
      res.status(400).json({ message: 'pattern must be provided and must be a string.' });
      return;
    }
    if (typeof replacement !== 'string') {
      res.status(400).json({ message: 'replacement must be provided and must be a string.' });
      return;
    }

    // Add deprecation warning
    console.warn('⚠️  updateFile is deprecated. Use applyFuzzyPatch for better fuzzy matching and conflict resolution.');
    res.setHeader('Warning', '299 - "updateFile is deprecated; use applyFuzzyPatch instead"');
    res.setHeader('Deprecation', 'true');

    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    await server.updateFile(filePath, pattern, replacement, { backup, multiline });

    res.status(200).json({ 
      status: 'success', 
      message: 'File updated successfully. Consider using applyFuzzyPatch for better conflict resolution.' 
    });
  } catch (error) {
    handleServerError(error, res, 'Failed to update file');
  }
};

export const amendFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, content, backup = true } = req.body;

    if (typeof filePath !== 'string' || !filePath.trim()) {
      res.status(400).json({ message: 'filePath must be provided and must be a string.' });
      return;
    }
    if (typeof content !== 'string') {
      res.status(400).json({ message: 'content must be provided and must be a string.' });
      return;
    }

    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    await server.amendFile(filePath, content, { backup });

    res.status(200).json({ 
      status: 'success', 
      message: 'File amended successfully.' 
    });
  } catch (error) {
    handleServerError(error, res, 'Failed to amend file');
  }
};

export const listFiles = async (req: Request, res: Response) => {
  const { directory, limit, offset, orderBy, recursive, typeFilter } = req.body;

  try {
    const ServerHandler = getServerHandler(req);
    if (!ServerHandler) {
      throw new Error("Server handler not found");
    }

    const files = await ServerHandler.listFilesWithDefaults({ directory, limit, offset, orderBy, recursive, typeFilter });

    res.status(200).json({ files });
  } catch (error) {
    handleServerError(error, res, "Error listing files");
  }
};

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

  if (oldText === newText) {
    return res.status(400).json({ success: false, error: 'No changes to apply' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(400).json({
      error: 'File not found',
      success: false,
    });
  }

  try {
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

export const applyDiff = async (req: Request, res: Response) => {
  const { diff, dryRun = false } = req.body;

  if (!diff || typeof diff !== 'string') {
    return res.status(400).json({ error: 'Diff content is required' });
  }

  const tempFile = path.join('/tmp', `patch-${Date.now()}.diff`);

  try {
    await writeFile(tempFile, diff, 'utf8');

    const checkCmd = `git apply --check ${tempFile}`;
    
    try {
      await execAsync(checkCmd);
    } catch (error) {
      await unlink(tempFile);
      return res.status(400).json({ 
        error: 'Invalid diff format',
        message: 'Diff validation failed',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    if (dryRun) {
      await unlink(tempFile);
      return res.json({ success: true, dryRun: true, message: 'Diff validation passed' });
    }

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

export const applyPatch = async (req: Request, res: Response) => {
  const { file, search, replace, startLine, endLine, dryRun = false } = req.body;

  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'File path is required' });
  }

  if (!search && !startLine) {
    return res.status(400).json({ error: 'Either search string or startLine is required' });
  }

  try {
    const content = await fsReadFile(file, 'utf8');
    const lines = content.split('\n');
    
    let newContent: string;
    
    if (search && replace !== undefined) {
      if (!content.includes(search)) {
        return res.status(400).json({ error: 'Search string not found in file' });
      }
      newContent = content.replace(search, replace);
    } else if (startLine !== undefined) {
      const start = Math.max(0, startLine - 1);
      const end = endLine ? Math.min(lines.length, endLine) : start + 1;
      
      if (start >= lines.length) {
        return res.status(400).json({ error: 'Start line exceeds file length' });
      }
      
      const newLines = [...lines];
      if (replace !== undefined) {
        newLines.splice(start, end - start, replace);
      } else {
        newLines.splice(start, end - start);
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

    const backupFile = `${file}.backup.${Date.now()}`;
    await writeFile(backupFile, content, 'utf8');
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