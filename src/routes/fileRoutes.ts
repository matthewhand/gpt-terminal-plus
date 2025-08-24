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

// Middleware for all file routes
router.use(checkAuthToken);
router.use(initializeServerHandler);

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

/**
 * Route to read a file.
 * @route POST /file/read
 */
router.post('/read', readFile);

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