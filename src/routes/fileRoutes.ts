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
router.post('/create', (req, res) => {
  const { directory } = req.body;

  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create directory.', error: (error as Error).message });
  }

  createFile(req, res);
});

/**
 * Route to list files in a directory.
 * @route GET /file/list
 */
router.get('/list', async (req, res) => {
  const { directory, limit, offset, orderBy } = req.query;

  try {
    const dir = (typeof directory === 'string' && directory.trim() !== '') ? directory.toString() : '.';
    const params = {
      directory: dir,
      limit: typeof limit === 'string' ? parseInt(limit, 10) : undefined,
      offset: typeof offset === 'string' ? parseInt(offset, 10) : undefined,
      orderBy: orderBy === 'datetime' ? 'datetime' as const : 'filename' as const,
    };

    const paginatedResponse = await localHandler.listFiles(params);
    res.status(200).json(paginatedResponse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

/**
 * Route to apply fuzzy patch to a file using diff-match-patch.
 * @route POST /file/fuzzy-patch
 */
router.post('/fuzzy-patch', applyFuzzyPatch);

// Preserve additional routes and logic here if any...

export default router;
