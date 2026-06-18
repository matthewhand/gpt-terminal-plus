import { Request, Response } from "express";
import { getServerHandler, isLocalServerHandler } from "../../utils/getServerHandler";
import { resolveSafePath, escapesRelativeRoot } from "../../utils/pathSafety";

/**
 * Create or replace a file on the currently selected server.
 * Body: {
 *   filePath: string;   // absolute or relative path of file to create
 *   content?: string;   // file content (default '')
 *   backup?: boolean;   // back up an existing file before overwriting (default true)
 * }
 */
export const createFile = async (req: Request, res: Response): Promise<Response> => {
  const { filePath, content = "", backup = true } = req.body || {};

  if (filePath === undefined || filePath === null || filePath === "") {
    return res.status(400).json({
      status: "error",
      message: "File path is required",
      data: null,
    });
  }

  if (typeof filePath !== "string") {
    return res.status(400).json({
      status: "error",
      message: "filePath must be a string",
      data: null,
    });
  }

  try {
    const handler = getServerHandler(req);
    const fileContent = typeof content === "string" ? content : String(content);

    // Local-specific root check using resolve (to keep exact test messages/behavior for local outside root)
    if (isLocalServerHandler(handler)) {
      const resolvedPath = resolveSafePath(filePath);
      if (!resolvedPath) {
        return res.status(400).json({
          status: "error",
          message: `filePath resolves outside the working root: ${filePath}`,
          data: null,
        });
      }
    }

    // Remote + general escape check (../ style)
    if (escapesRelativeRoot(filePath)) {
      return res.status(400).json({
        status: "error",
        message: "filePath escapes the working root",
        data: null,
      });
    }

    // Always delegate to the selected server handler.
    if (typeof handler.createFile !== "function") {
      return res.status(501).json({
        status: "error",
        message: "createFile is not supported by the selected server handler",
        data: null,
      });
    }

    const ok = await handler.createFile(filePath, fileContent, backup);
    if (!ok) {
      return res.status(500).json({
        status: "error",
        message: "Failed to create file: handler reported failure",
        data: null,
      });
    }
    return res.status(200).json({
      status: "success",
      message: "File created successfully",
      data: { filePath },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      status: "error",
      message: "Failed to create file: " + errorMessage,
      data: null,
    });
  }
};
