import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

export const createFile = async (req: Request, res: Response) => {
  const { filePath, content = '', backup = true } = req.body;

  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ 
      status: 'error', 
      message: 'File path is required and must be a string',
      data: null 
    });
  }

  try {
    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    const success = await server.createFile(filePath, content, backup);

    if (success) {
      res.status(200).json({ 
        status: 'success', 
        message: 'File created successfully', 
        data: { filePath, backup } 
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
