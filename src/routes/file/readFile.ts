import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Read a single file, optionally constrained by line range.
 * Body: {
 *   filePath: string;
 *   startLine?: number; // 1-based inclusive
 *   endLine?: number;   // 1-based inclusive
 *   encoding?: string;  // default 'utf8'
 *   maxBytes?: number;  // default 1048576 (1 MiB)
 * }
 */
export async function readFile(req: Request, res: Response): Promise<Response> {
  try {
    const { filePath, startLine, endLine, encoding = 'utf8', maxBytes = 1048576 } = req.body || {};

    if (typeof filePath !== 'string' || !filePath.trim()) {
      return res.status(400).json({ message: 'filePath must be provided and must be a string.' });
    }
    if (startLine !== undefined && (!Number.isInteger(startLine) || startLine <= 0)) {
      return res.status(400).json({ message: 'startLine must be a positive integer when provided.' });
    }
    if (endLine !== undefined && (!Number.isInteger(endLine) || endLine <= 0)) {
      return res.status(400).json({ message: 'endLine must be a positive integer when provided.' });
    }
    if (startLine !== undefined && endLine !== undefined && endLine < startLine) {
      return res.status(400).json({ message: 'endLine must be greater than or equal to startLine.' });
    }

    const resolvedPath = path.resolve(filePath);
    const stat = await fs.stat(resolvedPath);

    let truncated = false;
    let content: string;

    // If range requested, read entire file (assuming typical text sizes) and slice lines
    if (startLine !== undefined || endLine !== undefined) {
      // Impose a hard cap on bytes read to avoid huge memory usage
      if (stat.size > maxBytes) truncated = true;
      const buf = await fs.readFile(resolvedPath);
      content = buf.toString(encoding as BufferEncoding);
      const lines = content.split(/\r?\n/);
      const startIdx = (startLine ? startLine : 1) - 1;
      const endIdx = (endLine ? endLine : lines.length) - 1;
      const sliced = lines.slice(Math.max(0, startIdx), Math.min(lines.length, endIdx + 1));
      content = sliced.join('\n');
    } else {
      // No range: read up to maxBytes to keep it efficient
      if (stat.size > maxBytes) {
        const fh = await fs.open(resolvedPath, 'r');
        try {
          const buf = Buffer.allocUnsafe(Number(maxBytes));
          const { bytesRead } = await fh.read({ buffer: buf, position: 0, length: Number(maxBytes) });
          content = buf.subarray(0, bytesRead).toString(encoding as BufferEncoding);
          truncated = true;
        } finally {
          await fh.close();
        }
      } else {
        content = await fs.readFile(resolvedPath, { encoding: encoding as BufferEncoding });
      }
    }

    return res.status(200).json({ filePath: resolvedPath, encoding, startLine, endLine, truncated, content });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Failed to read file: ' + errorMessage });
  }
}

