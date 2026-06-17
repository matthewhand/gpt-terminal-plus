import fs from 'fs/promises';
import path from 'path';

export interface ActivityTool {
  name: string;
  description: string;
  parameters: any;
  handler: (params: any) => Promise<string>;
}

export const activityTools: ActivityTool[] = [
  {
    name: 'listSessions',
    description: 'Lists session folder names for a given date',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (optional, defaults to today)'
        }
      }
    },
    handler: async (params: { date?: string }) => {
      const date = params.date || new Date().toISOString().slice(0, 10);
      const dateDir = path.join('data', 'activity', date);
      
      try {
        const sessions = await fs.readdir(dateDir);
        return JSON.stringify(sessions.filter(s => s.startsWith('session_')));
      } catch {
        return JSON.stringify([]);
      }
    }
  },
  
  {
    name: 'readFile',
    description: 'Reads raw JSON content from an activity log file',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'File path relative to project root (e.g. data/activity/2025-08-21/session_123/01-shell.json)'
        }
      },
      required: ['path']
    },
    handler: async (params: { path: string }) => {
      try {
        // Security: only allow reading from data/activity directory
        if (!params.path.startsWith('data/activity/')) {
          throw new Error('Access denied: can only read activity logs');
        }
        
        const content = await fs.readFile(params.path, 'utf8');
        return content;
      } catch (error) {
        return JSON.stringify({ error: error instanceof Error ? error.message : 'File read failed' });
      }
    }
  }
];

export function getToolDefinitions() {
  return activityTools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));
}

export async function executeTool(name: string, params: any): Promise<string> {
  const tool = activityTools.find(t => t.name === name);
  if (!tool) {
    throw new Error(`Tool ${name} not found`);
  }
  
  return await tool.handler(params);
}
