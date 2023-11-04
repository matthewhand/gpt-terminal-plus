// commandExecutionEndpoints.ts
import { Request, Response } from 'express';
import { serverHandler } from './serverHandler'; // Assuming this exports your server handler instance
import { generateResponseId, formatAndSendResponse } from './utils'; // Utility functions you might have

// Function to handle running a command
export async function runCommand(req: Request, res: Response) {
  const command = req.body.command;
  const timeout = req.body.timeout || 180000; // Use default timeout if not provided

  try {
    const result = await serverHandler.executeCommand(command, timeout);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to handle creating or replacing a file
export async function createOrReplaceFile(req: Request, res: Response) {
  const { filename, content, backup = true, directory = "" } = req.body;
  const targetDirectory = directory || serverHandler.getCurrentDirectory();

  try {
    const message = await serverHandler.createOrReplaceFile(targetDirectory, filename, content, backup);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to handle updating a file
export async function updateFile(req: Request, res: Response) {
  const { relative, pattern, replacement, backup = true, directory = "" } = req.body;
  const targetDirectory = directory || serverHandler.getCurrentDirectory();

  try {
    const message = await serverHandler.updateFile(targetDirectory, relative, pattern, replacement, backup);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to handle listing files in a directory
export async function listFiles(req: Request, res: Response) {
  const { directory, orderBy, limit = 42, offset = 0 } = req.body;

  try {
    const files = await serverHandler.listFiles(directory, orderBy, limit, offset);
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to handle amending a file
export async function amendFile(req: Request, res: Response) {
  const { filename, content, directory = "" } = req.body;
  const targetDirectory = directory || serverHandler.getCurrentDirectory();

  try {
    const message = await serverHandler.amendFile(targetDirectory, filename, content);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
