import { Request, Response } from "express";
import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";

/**
 * Create or replace a file on the local filesystem.
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
    const resolvedPath = path.resolve(filePath);
    const directory = path.dirname(resolvedPath);

    if (!fsSync.existsSync(directory)) {
      await fs.mkdir(directory, { recursive: true });
    }

    if (backup && fsSync.existsSync(resolvedPath)) {
      const backupPath = `${resolvedPath}.backup.${Date.now()}`;
      await fs.copyFile(resolvedPath, backupPath);
    }

    await fs.writeFile(resolvedPath, typeof content === "string" ? content : String(content), "utf8");

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
