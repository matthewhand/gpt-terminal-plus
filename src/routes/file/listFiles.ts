import { Request, Response } from "express";

import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler, isLocalServerHandler } from "../../utils/getServerHandler";
import { resolveSafePath, escapesRelativeRoot } from "../../utils/pathSafety";
import { ListParams } from "../../types/ListParams";

const toInt = (value: unknown): number | undefined => {
  const n = typeof value === 'number' ? value : (typeof value === 'string' && value.trim() !== '' ? parseInt(value, 10) : NaN);
  return Number.isFinite(n) ? n : undefined;
};

/**
 * Lists files on the currently selected server.
 * Accepts params from the query string (GET /file/list) or body (POST usage).
 */
export const listFiles = async (req: Request, res: Response) => {
  const source: Record<string, unknown> = (req.method === 'GET' ? req.query : req.body) || {};
  const { directory, limit, offset, orderBy } = source as { directory?: unknown; limit?: unknown; offset?: unknown; orderBy?: unknown };

  try {
    const handler = getServerHandler(req);
    if (typeof handler.listFiles !== 'function') {
      return res.status(501).json({
        error: 'listFiles is not supported by the selected server handler; select a server that supports file listing (e.g. the local server)',
      });
    }

    let dir = (typeof directory === 'string' && directory.trim() !== '') ? directory : '.';

    if (isLocalServerHandler(handler)) {
      const safeDir = resolveSafePath(dir);
      if (!safeDir) {
        return res.status(400).json({ error: `directory resolves outside the working root: ${dir}` });
      }
      dir = safeDir;
    } else if (escapesRelativeRoot(dir)) {
      return res.status(400).json({ error: `directory escapes the working root: ${dir}` });
    }

    const params: ListParams = {
      directory: dir,
      limit: toInt(limit),
      offset: toInt(offset),
      orderBy: orderBy === 'datetime' ? 'datetime'
        : orderBy === 'filename' ? 'filename'
        : undefined,
    };

    const paginated = await handler.listFiles(params);
    res.status(200).json(paginated);
  } catch (error) {
    handleServerError(error, res, "Error listing files");
  }
};
