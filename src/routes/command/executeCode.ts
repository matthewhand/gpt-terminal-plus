import { Request, Response } from 'express';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';

/**
 * Execute code using interpreters
 * @route POST /command/execute-code
 */
export const executeCode = async (req: Request, res: Response) => {
  const { code, language = 'python' } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const server = getServerHandler(req);
    
    // Map language to command
    const interpreters: Record<string, string> = {
      python: 'python3',
      python3: 'python3',
      node: 'node',
      nodejs: 'node',
      bash: 'bash',
      sh: 'bash'
    };

    const interpreter = interpreters[language.toLowerCase()];
    if (!interpreter) {
      return res.status(400).json({ 
        error: `Unsupported language: ${language}` 
      });
    }

    // Execute code via interpreter
    const result = await server.executeCommand(`${interpreter} -c "${code.replace(/"/g, '\\"')}"`);

    res.json({
      result,
      language,
      interpreter
    });

  } catch (error) {
    handleServerError(error, res, 'Error executing code');
  }
};