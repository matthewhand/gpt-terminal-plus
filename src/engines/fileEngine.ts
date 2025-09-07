import fs from 'fs/promises';
import * as pathModule from 'path';
import { convictConfig } from '../config/convictConfig';

export interface FileOperation {
  type: 'read' | 'write' | 'delete' | 'list' | 'mkdir';
  path: string;
  content?: string;
  recursive?: boolean;
}

export async function executeFileOperation(op: FileOperation | string, path?: string, content?: string): Promise<any> {
  console.log('executeFileOperation called with:', op, path, content);
  let operation: FileOperation;

  if (typeof op === 'string') {
    // Legacy positional args: executeFileOperation(type, path, content?)
    operation = { type: op as any, path: path || '', content };
  } else {
    // New object form
    operation = op;
  }
  console.log('Operation object:', operation);

  try {
    // Validate operation type early to surface clear errors regardless of config mocking
    const validTypes = new Set(['read', 'write', 'delete', 'list', 'mkdir']);
    if (!validTypes.has(operation.type)) {
      return { success: false, error: `Unknown file operation: ${operation.type}` };
    }

    // Validate path parameter
    if (!operation.path || operation.path.trim() === '') {
      return { success: false, error: 'Path is required' };
    }

    // Read allowed paths safely; fall back to CWD if schema key not present or config mocked
    let allowedPaths: string[] = [process.cwd()];
    try {
      const cfg = convictConfig();
      const fromCfg = (cfg as any)?.get?.('fileOps.allowedPaths');
      if (Array.isArray(fromCfg) && fromCfg.length > 0) {
        allowedPaths = fromCfg as string[];
      }
    } catch (error) {
      // ignore and use default
      console.log('ConvictConfig error:', error);
    }
    console.log('Allowed paths:', allowedPaths);
    console.log('Current working directory:', process.cwd());

    // Security check
    const resolvedPath = pathModule.resolve(operation.path!);
    console.log('Original path:', operation.path);
    console.log('Resolved path:', resolvedPath);
    const isAllowed = allowedPaths.some((allowed: string) => {
      const resolvedAllowed = pathModule.resolve(allowed);
      console.log('Checking against allowed path:', resolvedAllowed);
      const result = resolvedPath.startsWith(resolvedAllowed);
      console.log('Path allowed?', result);
      return result;
    });

    if (!isAllowed) {
      return { success: false, error: `Path not allowed: ${operation.path}` };
    }
    switch (operation.type) {
      case 'read':
        const content = await fs.readFile(resolvedPath, 'utf8');
        return { success: true, content };

      case 'write':
        if (operation.content === undefined) {
          return { success: false, error: 'Content required for write operation' };
        }
        await fs.writeFile(resolvedPath, operation.content);
        return { success: true };

      case 'delete':
        await fs.unlink(resolvedPath);
        return { success: true };

      case 'list':
        const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
        const files = entries.map(entry => ({
          name: entry.name,
          isDirectory: entry.isDirectory(),
        }));
        return { success: true, files };

      case 'mkdir':
        await fs.mkdir(resolvedPath, { recursive: operation.recursive });
        return { success: true };

      default:
        return { success: false, error: `Unknown file operation: ${operation.type}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}
