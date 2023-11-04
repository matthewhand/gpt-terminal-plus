// staticFileEndpoints.ts
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to serve a file
function serveFile(filePath: string, contentType: string, res: Response) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
      return;
    }
    res.setHeader('Content-Type', contentType);
    res.status(200).send(data);
  });
}

// Serve logo.png
export function serveLogo(_: Request, res: Response) {
  const filePath = path.join(__dirname, 'logo.png');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error serving file');
    }
  });
}

// Serve .well-known/ai-plugin.json
export function servePluginJson(_: Request, res: Response) {
  const filePath = path.join(__dirname, '.well-known', 'ai-plugin.json');
  serveFile(filePath, 'application/json', res);
}

// Serve openapi.yaml
export function serveOpenApi(_: Request, res: Response) {
  const filePath = path.join(__dirname, 'openapi.yaml');
  serveFile(filePath, 'text/yaml', res);
}
