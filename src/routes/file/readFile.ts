import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import { getServerHandler, isLocalServerHandler } from '../../utils/getServerHandler';
import { resolveSafePath, escapesRelativeRoot } from '../../utils/pathSafety';

/** Slice content to an optional 1-based inclusive line range. */
function sliceLines(content: string, startLine?: number, endLine?: number): string {
  const lines = content.split(/\r?\n/);
  const startIdx = (startLine ? startLine : 1) - 1;
  const endIdx = (endLine ? endLine : lines.length) - 1;
  return lines.slice(Math.max(0, startIdx), Math.min(lines.length, endIdx + 1)).join('\n');
}

/**
 * Read a single file from the currently selected server, optionally
 * constrained by line range.
 * Body: {
 *   filePath: string;
 *   startLine?: number; // 1-based inclusive
 *   endLine?: number;   // 1-based inclusive
 *   encoding?: string;  // default 'utf8' (local only)
 *   maxBytes?: number;  // default 1048576 (1 MiB)
 * }
 */
export async function readFile(req: Request, res: Response): Promise<Response> {
  try {
    const { filePath, startLine, endLine, encoding = 'utf8', maxBytes = 1048576 } = req.body || {};

    if (typeof filePath !== 'string' || !filePath.trim()) {
      return res.status(400).json({
      status: 'error',
      message: 'filePath must be provided and must be a string',
      data: null
    });
    }
    if (startLine !== undefined && (!Number.isInteger(startLine) || startLine <= 0)) {
      return res.status(400).json({
      status: 'error',
      message: 'startLine must be a positive integer when provided',
      data: null
    });
    }
    if (endLine !== undefined && (!Number.isInteger(endLine) || endLine <= 0)) {
      return res.status(400).json({
      status: 'error',
      message: 'endLine must be a positive integer when provided',
      data: null
    });
    }
    if (startLine !== undefined && endLine !== undefined && endLine < startLine) {
      return res.status(400).json({
      status: 'error',
      message: 'endLine must be greater than or equal to startLine',
      data: null
    });
    }

    const handler = getServerHandler(req);

    // Remote targets (ssh/ssm): dispatch to the selected server's handler.
    if (!isLocalServerHandler(handler)) {
      if (escapesRelativeRoot(filePath)) {
        return res.status(400).json({
          status: 'error',
          message: 'filePath escapes the working root',
          data: null,
        });
      }
      const getFileContent = (handler as { getFileContent?: (p: string) => Promise<string> }).getFileContent;
      if (typeof getFileContent !== 'function') {
        return res.status(501).json({
          status: 'error',
          message: 'readFile is not supported by the selected server handler; select the local server for this operation',
          data: null,
        });
      }
      let content = await getFileContent.call(handler, filePath);
      let truncated = false;
      if (typeof maxBytes === 'number' && Buffer.byteLength(content, 'utf8') > maxBytes) {
        content = Buffer.from(content, 'utf8').subarray(0, Number(maxBytes)).toString('utf8');
        truncated = true;
      }
      if (startLine !== undefined || endLine !== undefined) {
        content = sliceLines(content, startLine, endLine);
      }
      return res.status(200).json({
        status: 'success',
        message: 'File read successfully',
        data: { filePath, encoding, startLine, endLine, truncated, content },
      });
    }

    // Local target: confine to the working root.
    const resolvedPath = resolveSafePath(filePath);
    if (!resolvedPath) {
      return res.status(400).json({
        status: 'error',
        message: `filePath resolves outside the working root: ${filePath}`,
        data: null,
      });
    }
    const stat = await fs.stat(resolvedPath);

    let truncated = false;
    let content: string;

    // If range requested, read entire file (assuming typical text sizes) and slice lines
    if (startLine !== undefined || endLine !== undefined) {
      // Impose a hard cap on bytes read to avoid huge memory usage
      if (stat.size > maxBytes) truncated = true;
      const buf = await fs.readFile(resolvedPath);
      content = sliceLines(buf.toString(encoding as BufferEncoding), startLine, endLine);
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

    return res.status(200).json({
      status: 'success',
      message: 'File read successfully',
      data: { filePath: resolvedPath, encoding, startLine, endLine, truncated, content }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      status: 'error',
      message: 'Failed to read file: ' + errorMessage,
      data: null
    });
  }
}
