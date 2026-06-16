import express from 'express';
import { createFile } from './file/createFile';
import { readFile } from './file/readFile';
import { listFiles } from './file/listFiles';
import { applyFuzzyPatch } from './file/fuzzyPatch';

import { checkAuthToken } from '../middlewares/checkAuthToken';
import { initializeServerHandler } from '../middlewares/initializeServerHandler';

const router = express.Router();
// Protect file routes with API token
router.use(checkAuthToken as any);
// Resolve the currently selected server's handler (local/ssh/ssm) so file
// operations target the selected server instead of a hard-coded local one.
router.use(initializeServerHandler);

/**
 * Route to create or replace a file.
 * @route POST /file/create
 */
router.post('/create', createFile);

/**
 * Route to read a file (optionally a line range).
 * @route POST /file/read
 */
router.post('/read', readFile);

/**
 * Route to list files in a directory on the selected server.
 * @route GET /file/list
 */
router.get('/list', listFiles);

/**
 * Route to apply fuzzy patch to a file using diff-match-patch.
 * @route POST /file/fuzzy-patch
 */
router.post('/fuzzy-patch', applyFuzzyPatch);

// Preserve additional routes and logic here if any...

export default router;
