import { promises as fs } from 'fs';
import path from 'path';
import Debug from 'debug';
import { FileReadResult } from '../../../types/FileReadResult';

const debug = Debug('app:local:readFile');

export async function readFile(filePath: string, directory?: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult> {
  try {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('filePath is required and must be a string.');
    }

    const { startLine, endLine, encoding = 'utf8', maxBytes = 1048576 } = options || {};

    if (startLine !== undefined && (!Number.isInteger(startLine) || startLine <= 0)) {
      throw new Error('startLine must be a positive integer when provided');
    }
    if (endLine !== undefined && (!Number.isInteger(endLine) || endLine <= 0)) {
      throw new Error('endLine must be a positive integer when provided');
    }
    if (startLine !== undefined && endLine !== undefined && endLine < startLine) {
      throw new Error('endLine must be greater than or equal to startLine');
    }

    const baseDir = directory || process.cwd();
    const resolvedPath = path.resolve(baseDir, filePath);

    if (!resolvedPath.startsWith(baseDir)) {
      throw new Error(`Refusing to read outside workspace: ${resolvedPath}`);
    }

    const stat = await fs.stat(resolvedPath);
    if (!stat.isFile()) {
      throw new Error(`Target is not a file: ${resolvedPath}`);
    }

    let truncated = false;
    let content: string;

    if (startLine !== undefined || endLine !== undefined) {
      if (stat.size > maxBytes) truncated = true;
      const buf = await fs.readFile(resolvedPath);
      content = buf.toString(encoding as BufferEncoding);
      const lines = content.split(/\r?\n/);
      const startIdx = (startLine ? startLine : 1) - 1;
      const endIdx = (endLine ? endLine : lines.length) - 1;
      const sliced = lines.slice(Math.max(0, startIdx), Math.min(lines.length, endIdx + 1));
      content = sliced.join('\n');
    } else {
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

    debug(`✅ readFile succeeded: ${resolvedPath} (size=${content.length} bytes)`);

    return { filePath: resolvedPath, content, encoding, startLine, endLine, truncated };
  } catch (err: any) {
    debug(`❌ readFile failed: ${err.message}`);
    throw err;
  }
}

export default readFile;
