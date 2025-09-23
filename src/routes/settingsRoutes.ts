import express, { Request, Response } from 'express';
import Debug from 'debug';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { getRedactedSettings } from '../config/convictConfig';

const debug = Debug('app:settingsRoutes');
const router = express.Router();

// Secure settings endpoints with bearer token auth
router.use(checkAuthToken as any);

// MCP Tools configuration
let mcpConfig = {
  enabled: true,
  tools: {
    'command/change-directory': true,
    'command/execute': true,
    'command/execute-code': true,
    'command/execute-file': false, // Disabled by default
    'file/create': true,
    'file/list': true,
    'server/set': true,
    'model/list': true,
    'model/select': true,
    'model/current': true,
    'command/execute-llm': true
  }
};

/**
 * GET /settings/mcp
 * Get MCP tools configuration
 */
router.get('/mcp', (_req: Request, res: Response) => {
  try {
    res.status(200).json(mcpConfig);
  } catch (err: any) {
    debug('Error getting MCP settings: %s', err?.message ?? err);
    res.status(500).json({ error: 'internal_error', message: err?.message ?? 'unknown' });
  }
});

/**
 * POST /settings/mcp
 * Update MCP tools configuration
 */
router.post('/mcp', (req: Request, res: Response) => {
  try {
    const updates = req.body || {};
    
    // Update enabled status
    if (typeof updates.enabled === 'boolean') {
      mcpConfig.enabled = updates.enabled;
    }
    
    // Update individual tool settings
    if (updates.tools && typeof updates.tools === 'object') {
      for (const [tool, enabled] of Object.entries(updates.tools)) {
        if (typeof enabled === 'boolean' && mcpConfig.tools.hasOwnProperty(tool)) {
          mcpConfig.tools[tool] = enabled;
        }
      }
    }
    
    res.status(200).json({ 
      message: 'MCP settings updated successfully', 
      config: mcpConfig 
    });
  } catch (err: any) {
    debug('Error updating MCP settings: %s', err?.message ?? err);
    res.status(500).json({ error: 'internal_error', message: err?.message ?? 'unknown' });
  }
});

/**
 * GET /settings
 * @swagger
 * /settings:
 *   get:
 *     operationId: getSettings
 *     summary: Get redacted configuration settings
 *     description: Returns grouped configuration values with secrets redacted. Values overridden by environment variables are marked as readOnly.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Redacted settings grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 server:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 security:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 llm:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 compat:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *               required: [server, security, llm, compat]
 *             examples:
 *               sample:
 *                 summary: Example response
 *                 value:
 *                   server:
 *                     port:
 *                       value: 5005
 *                       readOnly: false
 *                     httpsEnabled:
 *                       value: false
 *                       readOnly: false
 *                   security:
 *                     apiToken:
 *                       value: "*****"
 *                       readOnly: true
 *                   llm:
 *                     provider:
 *                       value: "openai"
 *                       readOnly: false
 *                     "openai.baseUrl":
 *                       value: ""
 *                       readOnly: false
 *                     "openai.apiKey":
 *                       value: "*****"
 *                       readOnly: true
 *                   compat:
 *                     llmProvider:
 *                       value: ""
 *                       readOnly: false
 */
/**
 * GET /settings
 * @swagger
 * /settings:
 *   get:
 *     operationId: getSettings
 *     summary: Get redacted configuration settings
 *     description: Returns grouped configuration values with secrets redacted. Values overridden by environment variables are marked as readOnly.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Redacted settings grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 server:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 security:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 llm:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *                 compat:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       value:
 *                         oneOf:
 *                           - type: string
 *                           - type: number
 *                           - type: boolean
 *                           - type: object
 *                           - type: array
 *                           - type: "null"
 *                       readOnly:
 *                         type: boolean
 *                     required: [value, readOnly]
 *               required: [server, security, llm, compat]
 *             examples:
 *               sample:
 *                 summary: Example response
 *                 value:
 *                   server:
 *                     port:
 *                       value: 5005
 *                       readOnly: false
 *                     httpsEnabled:
 *                       value: false
 *                       readOnly: false
 *                   security:
 *                     apiToken:
 *                       value: "*****"
 *                       readOnly: true
 *                   llm:
 *                     provider:
 *                       value: "openai"
 *                       readOnly: false
 *                     "openai.baseUrl":
 *                       value: ""
 *                       readOnly: false
 *                     "openai.apiKey":
 *                       value: "*****"
 *                       readOnly: true
 *                   compat:
 *                     llmProvider:
 *                       value: ""
 *                       readOnly: false
 */
router.get('/settings', (_req: Request, res: Response) => {
  try {
    const payload = getRedactedSettings();
    res.status(200).json(payload);
  } catch (err: any) {
    debug('Error generating redacted settings: %s', err?.message ?? err);
    res.status(500).json({ error: 'internal_error', message: err?.message ?? 'unknown' });
  }
});

/**
 * POST /settings
 * Update configuration settings (runtime only, not persisted)
 */
router.post('/settings', (req: Request, res: Response) => {
  try {
    const { convictConfig } = require('../config/convictConfig');
    const cfg = convictConfig();
    const updates = req.body || {};
    
    // Apply updates to runtime config
    for (const [key, value] of Object.entries(updates)) {
      try {
        cfg.set(key, value);
      } catch (err: any) {
        debug(`Failed to set ${key}: ${err.message}`);
        return res.status(400).json({ error: 'invalid_setting', key, message: err.message });
      }
    }
    
    // Validate the updated config
    cfg.validate({ allowed: 'warn' });
    
    res.status(200).json({ message: 'Settings updated successfully', updated: Object.keys(updates) });
  } catch (err: any) {
    debug('Error updating settings: %s', err?.message ?? err);
    res.status(500).json({ error: 'internal_error', message: err?.message ?? 'unknown' });
  }
});

/**
 * GET /settings/mcp/ui
 * Web UI for MCP tools configuration
 */
router.get('/mcp/ui', (_req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>MCP Tools Configuration | GPT Terminal Plus</title>
      <style>
        :root {
          color-scheme: light dark;
          --bg: #070b1c;
          --panel: rgba(16, 21, 43, 0.9);
          --card: rgba(9, 13, 27, 0.75);
          --text: #f6f7fb;
          --muted: #a7acc4;
          --accent: linear-gradient(135deg, #5cd6ff, #ff71ce);
          --border: rgba(255,255,255,0.12);
          --shadow: 0 20px 45px rgba(8, 12, 26, 0.45);
          --success: #7fff7f;
          --error: #ff7f7f;
        }
        body {
          margin: 0;
          padding: 40px 32px 64px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--bg);
          color: var(--text);
        }
        main {
          max-width: 800px;
          margin: 0 auto;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        h1 {
          margin: 0;
          font-size: clamp(2rem, 3vw, 2.6rem);
        }
        .back-link {
          display: inline-block;
          margin-bottom: 20px;
          color: #5cd6ff;
          text-decoration: none;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          box-shadow: var(--shadow);
          margin-bottom: 24px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .form-group input[type="checkbox"] {
          margin-right: 10px;
        }
        .tool-list {
          display: grid;
          gap: 16px;
        }
        .tool-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
        }
        .tool-item label {
          display: flex;
          align-items: center;
          cursor: pointer;
          width: 100%;
          margin: 0;
        }
        .tool-name {
          flex: 1;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.9rem;
        }
        button {
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        button:hover {
          transform: translateY(-2px);
        }
        button.primary {
          background: var(--accent);
          color: var(--bg);
        }
        button.secondary {
          background: transparent;
          border: 1px solid var(--border);
          color: inherit;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }
        .message {
          padding: 16px;
          border-radius: 8px;
          margin: 16px 0;
        }
        .message.success {
          background: rgba(127, 255, 127, 0.1);
          color: var(--success);
          border: 1px solid var(--success);
        }
        .message.error {
          background: rgba(255, 127, 127, 0.1);
          color: var(--error);
          border: 1px solid var(--error);
        }
        .hidden {
          display: none;
        }
      </style>
    </head>
    <body>
      <main>
        <a href="/settings/console" class="back-link">← Back to settings</a>
        <header>
          <h1>MCP Tools Configuration</h1>
        </header>
        
        <div id="messageContainer"></div>
        
        <form id="mcpForm" class="card">
          <div class="form-group">
            <label>
              <input type="checkbox" id="enabled" /> Enable MCP Tools Integration
            </label>
          </div>
          
          <div class="form-group">
            <label>Available Tools</label>
            <div class="tool-list" id="toolList">
              <!-- Tools will be populated here -->
            </div>
          </div>
          
          <div class="actions">
            <button type="button" id="resetBtn" class="secondary">Reset to Defaults</button>
            <button type="submit" id="saveBtn" class="primary">Save Configuration</button>
          </div>
        </form>
      </main>
      
      <script>
        // Global state
        let currentConfig = null;
        
        // Utility functions
        function showMessage(text, type = 'success') {
          const container = document.getElementById('messageContainer');
          container.innerHTML = \`<div class="message \${type}">\${text}</div>\`;
          setTimeout(() => {
            container.innerHTML = '';
          }, 5000);
        }
        
        // API functions
        async function apiCall(endpoint, options = {}) {
          const token = localStorage.getItem('gpt-terminal-token');
          const headers = {
            'Content-Type': 'application/json',
            ...options.headers
          };
          
          if (token) {
            headers['Authorization'] = \`Bearer \${token}\`;
          }
          
          const response = await fetch(\`/settings\${endpoint}\`, {
            ...options,
            headers
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API call failed');
          }
          
          return response.json();
        }
        
        // Configuration functions
        async function loadConfig() {
          try {
            const config = await apiCall('/mcp');
            currentConfig = config;
            renderConfig(config);
          } catch (error) {
            showMessage('Failed to load configuration: ' + error.message, 'error');
          }
        }
        
        function renderConfig(config) {
          // Set enabled checkbox
          document.getElementById('enabled').checked = config.enabled;
          
          // Render tools
          const toolList = document.getElementById('toolList');
          toolList.innerHTML = '';
          
          for (const [tool, enabled] of Object.entries(config.tools)) {
            const toolItem = document.createElement('div');
            toolItem.className = 'tool-item';
            toolItem.innerHTML = \`
              <label>
                <input type="checkbox" data-tool="\${tool}" \${enabled ? 'checked' : ''}>
                <span class="tool-name">\${tool}</span>
              </label>
            \`;
            toolList.appendChild(toolItem);
          }
        }
        
        async function saveConfig() {
          try {
            const enabled = document.getElementById('enabled').checked;
            const tools = {};
            
            // Get all tool checkboxes
            document.querySelectorAll('[data-tool]').forEach(checkbox => {
              tools[checkbox.dataset.tool] = checkbox.checked;
            });
            
            const config = { enabled, tools };
            await apiCall('/mcp', {
              method: 'POST',
              body: JSON.stringify(config)
            });
            
            currentConfig = config;
            showMessage('Configuration saved successfully');
          } catch (error) {
            showMessage('Failed to save configuration: ' + error.message, 'error');
          }
        }
        
        function resetConfig() {
          if (currentConfig) {
            renderConfig(currentConfig);
            showMessage('Configuration reset to last saved state');
          }
        }
        
        // Event handlers
        document.getElementById('mcpForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          await saveConfig();
        });
        
        document.getElementById('resetBtn').addEventListener('click', resetConfig);
        
        // Initialize
        document.addEventListener('DOMContentLoaded', loadConfig);
      </script>
    </body>
  </html>`;

  res.type('html').send(html);
});

export default router;
