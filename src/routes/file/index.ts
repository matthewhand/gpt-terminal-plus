import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { validateInput, validationPatterns, sanitizers } from "../../middlewares/inputValidation";
import { applyFilePatch } from '../../handlers/local/actions/applyFilePatch';
import { logSecurityEvent } from '../../middlewares/securityLogger';
import { writeFile, readFile as fsReadFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import Debug from 'debug';
import { z } from 'zod';
import { getSettings } from '../../settings/store';
import { convictConfig, persistConfig } from '../../config/convictConfig';

const debug = Debug('app:fileRoutes');
const execAsync = promisify(exec);

export const createFile = async (req: Request, res: Response) => {
  const { filePath, content, backup = true } = req.body;

  // Log security event for file creation
  logSecurityEvent(req, 'FILE_CREATE', { filePath });

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

  if (content === undefined) {
    return res.status(400).json({
      status: 'error',
      message: 'Content is required',
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

  // Validate content type
  if (content !== undefined && typeof content !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Content must be a string',
      data: null
    });
  }

  // For file content, preserve newlines but still sanitize dangerous characters
  const sanitizedContent = content ? content.replace(/\0/g, '') : ''; // Only remove null bytes

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

/**
* @openapi
* /file/search:
*   post:
*     summary: Search for files using regex pattern
*     description: Perform a regex search across files in a specified directory with pagination support
*     tags:
*       - File Operations
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - pattern
*               - path
*             properties:
*               pattern:
*                 type: string
*                 description: Regex pattern to search for
*                 example: "function.*test"
*               path:
*                 type: string
*                 description: Directory path to search in
*                 example: "src"
*               caseSensitive:
*                 type: boolean
*                 description: Whether the search should be case sensitive
*                 default: false
*                 example: false
*               page:
*                 type: integer
*                 description: Page number for pagination (1-based)
*                 default: 1
*                 minimum: 1
*                 example: 1
*               limit:
*                 type: integer
*                 description: Number of results per page
*                 default: 100
*                 minimum: 1
*                 maximum: 1000
*                 example: 50
*     responses:
*       200:
*         description: Search results
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: "success"
*                 message:
*                   type: string
*                   example: "Search completed successfully"
*                 data:
*                   type: object
*                   properties:
*                     items:
*                       type: array
*                       items:
*                         type: object
*                         properties:
*                           filePath:
*                             type: string
*                             description: Relative path to the file
*                             example: "src/utils/helper.ts"
*                           lineNumber:
*                             type: integer
*                             description: Line number where the match was found
*                             example: 42
*                           content:
*                             type: string
*                             description: The matched line content
*                             example: "export function testHelper() {"
*                     total:
*                       type: integer
*                       description: Total number of matches found
*                       example: 150
*                     limit:
*                       type: integer
*                       description: Number of results per page
*                       example: 50
*                     offset:
*                       type: integer
*                       description: Offset for pagination
*                       example: 0
*       400:
*         description: Bad request - invalid parameters or regex
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: "error"
*                 message:
*                   type: string
*                   example: "Invalid regex pattern"
*                 data:
*                   type: null
*       403:
*         description: Forbidden - file search is disabled
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: "error"
*                 message:
*                   type: string
*                   example: "File search is disabled"
*                 data:
*                   type: null
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: "error"
*                 message:
*                   type: string
*                   example: "Internal server error"
*                 data:
*                   type: null
*/
export const fsSearch = async (req: Request, res: Response): Promise<void> => {
 try {
   // Check if file operations are enabled
   const settings = getSettings();
   if (!settings.files.enabled) {
     res.status(403).json({
       status: 'error',
       message: 'File search is disabled',
       data: null
     });
     return;
   }

   // Zod schema for validation
   const searchSchema = z.object({
     pattern: z.string().min(1, 'Pattern is required'),
     path: z.string().min(1, 'Path is required'),
     caseSensitive: z.boolean().optional().default(false),
     page: z.number().int().min(1).optional().default(1),
     limit: z.number().int().min(1).max(1000).optional().default(100)
   });

   const validationResult = searchSchema.safeParse(req.body);
   if (!validationResult.success) {
     res.status(400).json({
       status: 'error',
       message: validationResult.error.errors.map(e => e.message).join(', '),
       data: null
     });
     return;
   }

   const { pattern, path: searchPath, caseSensitive, page, limit } = validationResult.data;

   // Validate path input
   const pathValidation = validateInput(searchPath, validationPatterns.safePath, 'Search path');
   if (!pathValidation.isValid) {
     res.status(400).json({
       status: 'error',
       message: pathValidation.errors.join(', '),
       data: null
     });
     return;
   }

   const sanitizedPath = sanitizers.sanitizePath(pathValidation.sanitizedValue);

   // Log security event
   logSecurityEvent(req, 'FILE_SEARCH', { pattern, path: sanitizedPath, caseSensitive, page, limit });

   const server = getServerHandler(req);
   if (!server) {
     throw new Error("Server handler not found");
   }

   // Calculate offset from page
   const offset = (page - 1) * limit;

   const searchParams = {
     pattern,
     path: sanitizedPath,
     caseSensitive,
     limit,
     offset
   };

   const results = await server.searchFiles(searchParams);

   res.status(200).json({
     status: 'success',
     message: 'Search completed successfully',
     data: results
   });
 } catch (error) {
   if (error instanceof Error && error.message.includes('Invalid regex pattern')) {
     res.status(400).json({
       status: 'error',
       message: error.message,
       data: null
     });
   } else {
     handleServerError(error, res, 'Failed to perform file search');
   }
 }
};

/**
* GET /file/operations
* List all file operations and their enabled status
*/
export const listFileOperations = async (req: Request, res: Response): Promise<void> => {
 try {
   // Check if file operations are enabled
   const settings = getSettings();
   if (!settings.files.enabled) {
     res.status(403).json({
       status: 'error',
       message: 'File operations are disabled',
       data: null
     });
     return;
   }

   const cfg = convictConfig();
   const operations = cfg.get('files.operations');

   // Transform to array format
   const operationsList = Object.entries(operations).map(([operation, config]: [string, any]) => ({
     operation,
     enabled: config.enabled
   }));

   res.status(200).json({
     status: 'success',
     message: 'File operations retrieved successfully',
     data: operationsList
   });
 } catch (error) {
   handleServerError(error, res, 'Failed to list file operations');
 }
};

/**
* POST /file/:operation/toggle
* Toggle the enabled status of a specific file operation
* Body: { enabled?: boolean } - if not provided, toggles current state
*/
export const toggleFileOperation = async (req: Request, res: Response): Promise<void> => {
 try {
   const { operation } = req.params;
   const { enabled } = req.body || {};

   // Check if file operations are enabled
   const settings = getSettings();
   if (!settings.files.enabled) {
     res.status(403).json({
       status: 'error',
       message: 'File operations are disabled',
       data: null
     });
     return;
   }

   const cfg = convictConfig();
   const operations = cfg.get('files.operations');

   if (!operations[operation]) {
     res.status(400).json({
       status: 'error',
       message: `Invalid operation: ${operation}`,
       data: null
     });
     return;
   }

   const currentEnabled = operations[operation].enabled;
   const newEnabled = enabled !== undefined ? enabled : !currentEnabled;

   cfg.set(`files.operations.${operation}.enabled`, newEnabled);
   await persistConfig(cfg);

   res.status(200).json({
     status: 'success',
     message: `File operation '${operation}' ${newEnabled ? 'enabled' : 'disabled'} successfully`,
     data: {
       operation,
       enabled: newEnabled
     }
   });
 } catch (error) {
   handleServerError(error, res, 'Failed to toggle file operation');
 }
};

/**
* POST /file/operations/bulk
* Bulk toggle multiple file operations
* Body: { operations: { [operation: string]: boolean } }
*/
export const bulkToggleFileOperations = async (req: Request, res: Response): Promise<void> => {
 try {
   const { operations: operationsToToggle } = req.body || {};

   if (!operationsToToggle || typeof operationsToToggle !== 'object') {
     res.status(400).json({
       status: 'error',
       message: 'operations object is required',
       data: null
     });
     return;
   }

   // Check if file operations are enabled
   const settings = getSettings();
   if (!settings.files.enabled) {
     res.status(403).json({
       status: 'error',
       message: 'File operations are disabled',
       data: null
     });
     return;
   }

   const cfg = convictConfig();
   const currentOperations = cfg.get('files.operations');

   const results: { operation: string; enabled: boolean; success: boolean; error?: string }[] = [];
   let hasErrors = false;

   for (const [operation, enabled] of Object.entries(operationsToToggle)) {
     if (typeof enabled !== 'boolean') {
       results.push({
         operation,
         enabled: false,
         success: false,
         error: 'enabled must be a boolean'
       });
       hasErrors = true;
       continue;
     }

     if (!currentOperations[operation]) {
       results.push({
         operation,
         enabled,
         success: false,
         error: `Invalid operation: ${operation}`
       });
       hasErrors = true;
       continue;
     }

     try {
       cfg.set(`files.operations.${operation}.enabled`, enabled);
       results.push({
         operation,
         enabled,
         success: true
       });
     } catch (error) {
       results.push({
         operation,
         enabled,
         success: false,
         error: (error as Error)?.message || 'Unknown error'
       });
       hasErrors = true;
     }
   }

   // Persist only if there were successful changes
   const successfulChanges = results.filter(r => r.success);
   if (successfulChanges.length > 0) {
     await persistConfig(cfg);
   }

   const statusCode = hasErrors ? 207 : 200; // 207 Multi-Status for partial success

   res.status(statusCode).json({
     status: hasErrors ? 'partial' : 'success',
     message: hasErrors ? 'Some operations failed to toggle' : 'All operations toggled successfully',
     data: results
   });
 } catch (error) {
   handleServerError(error, res, 'Failed to bulk toggle file operations');
 }
};