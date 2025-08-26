import express from 'express';
import { createFile } from './file/createFile';
import { applyFuzzyPatch } from './file/fuzzyPatch';

import { LocalServerHandler } from '../handlers/local/LocalServerHandler';
import fs from 'fs';
import { checkAuthToken } from '../middlewares/checkAuthToken';

const router = express.Router();
// Protect file routes with API token
router.use(checkAuthToken as any);
const localHandler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: false });

/**
 * Route to create or replace a file.
 * @route POST /file/create
 */
router.post('/create', createFile);

/**
 * Route to list files in a directory.
 * @route POST /file/list
 */
router.post('/list', listFiles);

  try {
    const dir = (typeof directory === 'string' && directory.trim() !== '') ? directory.toString() : '.';
    const params = {
      directory: dir,
      limit: typeof limit === 'string' ? parseInt(limit, 10) : undefined,
      offset: typeof offset === 'string' ? parseInt(offset, 10) : undefined,
      orderBy: orderBy === 'datetime' ? 'datetime' as const : 'filename' as const,
    };

/**
 * POST /file/amend
 * Append content to a file. Body: { filePath, content, backup? }
 */
router.post('/amend', amendFile);

/**
 * Route to apply fuzzy patch to a file using diff-match-patch.
 * @route POST /file/fuzzy-patch
 */
router.post('/fuzzy-patch', applyFuzzyPatch);

// Preserve additional routes and logic here if any...

/**
 * POST /file/patch
 * Apply a structured patch by generating a minimal unified diff and using git apply.
 * Body: { filePath: string, search?: string, oldText?: string, replace: string, all?: boolean, startLine?: number, endLine?: number, dryRun?: boolean }
 */
router.post('/patch', applyPatch);

export default router;