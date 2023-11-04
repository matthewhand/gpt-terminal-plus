import { Router } from 'express';
import * as path from 'path';
import * as fs from 'fs';

const router = Router();

// Serve logo.png
router.get('/logo.png', (_, res) => {
  const options = {
    root: path.join(__dirname, '../public'), // Adjust the path according to your file structure
  };

  const filename = 'logo.png';
  res.sendFile(filename, options, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send('Logo not found');
    }
  });
});

// Serve ai-plugin.json
router.get('/.well-known/ai-plugin.json', (_, res) => {
  const filePath = path.join(__dirname, '../public/.well-known/ai-plugin.json'); // Adjust the path according to your file structure

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading ai-plugin.json');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  });
});

// Serve openapi.yaml
router.get('/openapi.yaml', (_, res) => {
  const filePath = path.join(__dirname, '../public/openapi.yaml'); // Adjust the path according to your file structure

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading openapi.yaml');
      return;
    }
    res.setHeader('Content-Type', 'text/yaml');
    res.status(200).send(data);
  });
});

export default router;
