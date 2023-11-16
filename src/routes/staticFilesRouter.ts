import { Router } from 'express';
import path from 'path';

const router = Router();
const publicDir = path.join(__dirname, '../../public');

// Serve logo.png
router.get('/logo.png', (_, res) => {
  res.sendFile('logo.png', { root: publicDir });
});

// Serve openapi.yaml
router.get('/openapi.yaml', (_, res) => {
  res.sendFile('openapi.yaml', { root: publicDir });
});

export default router;

