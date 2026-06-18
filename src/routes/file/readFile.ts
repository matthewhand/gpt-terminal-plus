import { Request, Response } from 'express';
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

    // Local root check using resolve for exact "outside" message in tests
    if (isLocalServerHandler(handler)) {
      const resolvedPath = resolveSafePath(filePath);
      if (!resolvedPath) {
        return res.status(400).json({
          status: 'error',
          message: `filePath resolves outside the working root: ${filePath}`,
          data: null,
        });
      }
    }

    // General escape (../) for remote and additional safety
    if (escapesRelativeRoot(filePath)) {
      return res.status(400).json({
        status: 'error',
        message: 'filePath escapes the working root',
        data: null,
      });
    }

    // Always delegate to the selected server handler (local or remote).
    const getFileContent = (handler as { getFileContent?: (p: string) => Promise<string> }).getFileContent;
    if (typeof getFileContent === 'function' || typeof handler.readFile === 'function') {
      let content: string;
      let truncated = false;
      if (typeof handler.readFile === 'function') {
        const result = await handler.readFile(filePath, { startLine, endLine, encoding, maxBytes });
        content = result.content;
        truncated = !!result.truncated;
      } else {
        content = await getFileContent.call(handler, filePath);
        if (typeof maxBytes === 'number' && Buffer.byteLength(content, 'utf8') > maxBytes) {
          content = Buffer.from(content, 'utf8').subarray(0, Number(maxBytes)).toString('utf8');
          truncated = true;
        }
        if (startLine !== undefined || endLine !== undefined) {
          content = sliceLines(content, startLine, endLine);
        }
      }
      return res.status(200).json({
        status: 'success',
        message: 'File read successfully',
        data: { filePath, encoding, startLine, endLine, truncated, content },
      });
    }

    return res.status(501).json({
      status: 'error',
      message: 'readFile is not supported by the selected server handler',
      data: null,
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
