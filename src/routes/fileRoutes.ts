import express from 'express';
import { createFile } from './file/createFile';
import { updateFile } from './file/updateFile';
import { amendFile } from './file/amendFile';
import { listFiles } from '../handlers/local/LocalServerHandler';
import fs from 'fs';

const router = express.Router();

function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

router.post('/create', (req, res) => {
  const { directory, filename, content } = req.body;

  try {
    ensureDirectoryExists(directory);
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ message: 'Failed to create directory.', error: errorMessage });
  }

  createFile(req, res);
});

router.post('/update', (req, res) => {
  updateFile(req, res);
});

router.post('/amend', (req, res) => {
  amendFile(req, res);
});

router.get('/list', async (req, res) => {
  const { directory, limit, offset, orderBy } = req.query;

  if (!directory || typeof directory !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing "directory" parameter.' });
  }

  try {
    const params = {
      directory,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
      orderBy: orderBy === 'datetime' ? 'datetime' : 'filename',
    };

    const paginatedResponse = await listFiles(params);
    res.status(200).json(paginatedResponse);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: errorMessage });
  }
});

export default router;
