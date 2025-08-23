import express from 'express';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { initializeServerHandler } from '../middlewares/initializeServerHandler';

// File route handlers
import { createFile } from './file/createFile.route';
import { listFiles } from './file/listFiles.route';
import { readFile } from './file/readFile.route';
import { updateFile } from './file/updateFile.route';
import { amendFile } from './file/amendFile.route';

import { applyDiff } from './file/diff';
import { applyPatch } from './file/patch';

const router = express.Router();

// Secure routes and ensure a ServerHandler is attached to req
router.use(checkAuthToken as any);
router.use(initializeServerHandler as any);

/**
 * POST /file/create
 * Create or replace a file using the active ServerHandler.
 * Body: { filePath: string, content: string, backup?: boolean }
 */
router.post('/create', createFile);

/**
 * POST /file/list
 * List files in a directory using the active ServerHandler.
 * Body: { directory?: string }
 */
router.post('/list', listFiles);



/**
 * POST /file/read
 * Read a single file, optionally constrained by line range.
 * Body: { filePath: string, startLine?: number, endLine?: number, encoding?: string, maxBytes?: number }
 */
router.post('/read', readFile);

/**
 * Optional GET shim for read — maps query to body.
 * GET /file/read?filePath=...&startLine=..&endLine=..
 */
router.get('/read', (req, res) => {
  const { filePath, startLine, endLine, encoding, maxBytes } = req.query as Record<string, string>;
  const body: any = { ...(req.body || {}) };
  if (filePath) body.filePath = filePath;
  if (startLine) body.startLine = Number(startLine);
  if (endLine) body.endLine = Number(endLine);
  if (encoding) body.encoding = encoding;
  if (maxBytes) body.maxBytes = Number(maxBytes);
  req.body = body;
  return readFile(req as any, res);
});

/**
 * POST /file/update
 * Regex replace within a file. Body: { filePath, pattern, replacement, backup?, multiline? }
 */
router.post('/update', updateFile);

/**
 * POST /file/amend
 * Append content to a file. Body: { filePath, content, backup? }
 */
router.post('/amend', amendFile);



/**
 * POST /file/diff
 * Apply a unified diff using git apply with validation.
 * Body: { diff: string, dryRun?: boolean }
 */
router.post('/diff', applyDiff);

/**
 * POST /file/patch
 * Apply a structured patch by generating a minimal unified diff and using git apply.
 * Body: { filePath: string, search?: string, oldText?: string, replace: string, all?: boolean, startLine?: number, endLine?: number, dryRun?: boolean }
 */
router.post('/patch', applyPatch);

export default router;
