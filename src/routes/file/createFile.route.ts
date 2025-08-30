import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { validateInput, validationPatterns, sanitizers } from "../../middlewares/inputValidation";

export const createFile = async (req: Request, res: Response) => {
  const { filePath, content = '', backup = true } = req.body;

  // Check if filePath is provided and is a string
  if (!filePath) {
    return res.status(400).json({
      status: 'error',
      message: 'File path is required',
      data: null
    });
  }

  if (typeof filePath !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'File path must be a string',
      data: null
    });
  }

  // Validate and sanitize file path
  const pathValidation = validateInput(filePath, validationPatterns.safePath, 'File path');
  if (!pathValidation.isValid) {
    return res.status(400).json({
      status: 'error',
      message: pathValidation.errors.join(', '),
      data: null
    });
  }

  // Sanitize file path and content
  let sanitizedPath = sanitizers.sanitizePath(pathValidation.sanitizedValue);
  // Restore absolute path if original was absolute
  if (filePath.startsWith('/') && !sanitizedPath.startsWith('/')) {
    sanitizedPath = '/' + sanitizedPath;
  }
  const sanitizedContent = sanitizers.sanitizeString(content, 1000000); // 1MB limit

  try {
    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    const success = await server.createFile(sanitizedPath, sanitizedContent, backup);

    if (success) {
      res.status(200).json({
        status: 'success',
        message: 'File created successfully',
        data: { filePath: sanitizedPath, backup }
      });
    } else {
      res.status(400).json({ 
        status: 'error', 
        message: 'Failed to create file', 
        data: null 
      });
    }
  } catch (error) {
    handleServerError(error, res, "Error creating file");
  }
};
