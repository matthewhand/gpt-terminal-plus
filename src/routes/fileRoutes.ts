import express from 'express';
import { createFile } from './file/createFile';
import { updateFile } from './file/updateFile';
import { amendFile } from './file/amendFile';
import { LocalServerHandler } from '../handlers/local/LocalServerHandler';
import fs from 'fs';

const router = express.Router();
const localHandler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: false });

/**
 * Route to create or replace a file.
 * @route POST /file/create
 */
router.post('/create', (req, res) => {
  const { directory, filename, content } = req.body;

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

  if (!directory || typeof directory !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing "directory" parameter.' });
  }

  try {
    const params = {
      directory: directory.toString(),
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
      orderBy: orderBy === 'datetime' ? 'datetime' : 'filename',
    };

    const paginatedResponse = await localHandler.listFiles(params);
    res.status(200).json(paginatedResponse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Preserve additional routes and logic here if any...

export default router;
