import express, { Request, Response } from 'express';
import path from 'path';
import { convictConfig } from '../config/convictConfig';
import { getToolDefinitions, executeTool } from '../llm/activityTools';
import { checkAuthToken } from '../middlewares/checkAuthToken';

const router = express.Router();

// Secure LLM endpoints
router.use(checkAuthToken as any);

/**
 * Resolve the configured LLM provider.
 * Prefers convict (env-driven), falls back to node-config (NODE_CONFIG_DIR JSON),
 * which is how the rest of the app (src/llm) reads provider settings.
 */
function getLlmProvider(): string {
  try {
    const cfg = convictConfig();
    const provider = (cfg as any).get('llm.provider') as string;
    if (provider && provider.length > 0) return provider;
  } catch { /* fall through */ }
  try {
    const nodeConfig = require('config');
    if (nodeConfig.has('llm.provider')) {
      const provider = nodeConfig.get('llm.provider') as string;
      if (provider && provider.length > 0) return provider;
    }
  } catch { /* not configured */ }
  return '';
}

/**
 * GET /llm/console
 * Serves the LLM Console UI if LLM is enabled
 */
router.get('/console', (req: Request, res: Response) => {
  try {
    const cfg = convictConfig();
    const provider = getLlmProvider();
    const llmEnabled = !!(provider && provider.length > 0) || process.env.LLM_ENABLED === 'true' || process.env.LLM_ENABLED === '1';

    // Check if LLM Console feature is enabled in settings (optional group)
    let llmConsoleEnabled = false;
    try {
      llmConsoleEnabled = Boolean((cfg as any).get('features.llmConsole'));
    } catch {
      // Feature not configured, default to false
    }
    if (!llmConsoleEnabled) {
      llmConsoleEnabled = process.env.LLM_CONSOLE_ENABLED === 'true' || process.env.LLM_CONSOLE_ENABLED === '1';
    }
    
    if (!llmEnabled || !llmConsoleEnabled) {
      return res.status(404).json({
        status: 'error',
        message: 'LLM Console is not available - LLM execution or LLM Console feature is disabled',
        data: null
      });
    }
    
    // Serve the HTML file
    const htmlPath = path.resolve(__dirname, '../../public/llm-console.html');
    res.sendFile(htmlPath);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to load LLM Console: ' + (error instanceof Error ? error.message : 'Unknown error'),
      data: null
    });
  }
});

/**
 * POST /llm/query
 * Sends a query to LLM with access to activity logs via tools
 */
router.post('/query', async (req: Request, res: Response) => {
  try {
    const provider = getLlmProvider();
    const llmEnabled = !!(provider && provider.length > 0) || process.env.LLM_ENABLED === 'true' || process.env.LLM_ENABLED === '1';

    if (!llmEnabled) {
      return res.status(404).json({
        status: 'error',
        message: 'LLM querying is not available - LLM execution is disabled',
        data: null
      });
    }
    
    const { prompt, tools = [] } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Prompt is required and must be a string',
        data: null
      });
    }
    
    // Mock LLM response for now - in production this would call actual LLM
    const response = await mockLLMQuery(prompt, tools);
    
    res.json({
      status: 'success',
      message: 'Query processed successfully',
      data: {
        prompt,
        response,
        toolsUsed: tools
      }
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to process LLM query: ' + (error instanceof Error ? error.message : 'Unknown error'),
      data: null
    });
  }
});

// Mock LLM function - replace with actual LLM integration
async function mockLLMQuery(prompt: string, requestedTools: string[]): Promise<string> {
  const availableTools = getToolDefinitions();
  const allowedTools = availableTools.filter(tool => 
    requestedTools.includes(tool.function.name)
  );
  
  // Simple mock responses based on prompt keywords
  if (prompt.toLowerCase().includes('last') && prompt.toLowerCase().includes('command')) {
    try {
      // Use listSessions tool to get recent sessions
      const sessions = await executeTool('listSessions', {});
      const sessionList = JSON.parse(sessions);
      
      if (sessionList.length > 0) {
        // Try to read the most recent session
        const latestSession = sessionList[sessionList.length - 1];
        const date = new Date().toISOString().slice(0, 10);
        const metaPath = `data/activity/${date}/${latestSession}/meta.json`;
        
        try {
          const metaContent = await executeTool('readFile', { path: metaPath });
          return `Based on recent activity logs, I found ${sessionList.length} sessions today. The latest session is ${latestSession}. Here's the metadata: ${metaContent}`;
        } catch {
          return `I found ${sessionList.length} sessions today, with the latest being ${latestSession}, but couldn't read the details.`;
        }
      } else {
        return 'No recent sessions found in today\'s activity logs.';
      }
    } catch {
      return 'I encountered an error while trying to read the activity logs.';
    }
  }
  
  if (prompt.toLowerCase().includes('summarize') || prompt.toLowerCase().includes('summary')) {
    return `I can help summarize activity logs. I have access to tools: ${allowedTools.map(t => t.function.name).join(', ')}. Please provide more specific details about what you'd like me to analyze.`;
  }
  
  return `I received your query: "${prompt}". I have access to these tools for reading activity logs: ${allowedTools.map(t => t.function.name).join(', ')}. How can I help you analyze your execution history?`;
}

export default router;
