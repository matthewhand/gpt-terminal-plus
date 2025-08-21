import { Application, Request, Response } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SettingsSchema } from '../settings/schema';

// Simple credential management
function getOrCreateAdminCredentials() {
  const credentialsPath = path.join(process.cwd(), 'data', 'admin-credentials.json');
  const dataDir = path.dirname(credentialsPath);
  
  if (!existsSync(dataDir)) {
    require('fs').mkdirSync(dataDir, { recursive: true });
  }

  try {
    if (existsSync(credentialsPath)) {
      return JSON.parse(readFileSync(credentialsPath, 'utf8'));
    }
  } catch {}

  const credentials = {
    email: `admin-${crypto.randomBytes(4).toString('hex')}@gpt-terminal-plus.local`,
    password: crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, '').substring(0, 20)
  };

  writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
  
  console.log('\n🔐 ADMIN CREDENTIALS GENERATED:');
  console.log('📧 Email:', credentials.email);
  console.log('🔑 Password:', credentials.password);
  console.log('🌐 Admin URL: http://localhost:5004/admin');
  console.log('💾 Credentials saved to:', credentialsPath);
  console.log('⚠️  Save these credentials securely!\n');

  return credentials;
}

// Simple settings store
class SettingsStore {
  private settingsPath = path.join(process.cwd(), 'data', 'admin-settings.json');

  constructor() {
    const dataDir = path.dirname(this.settingsPath);
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }
  }

  getSettings() {
    try {
      if (existsSync(this.settingsPath)) {
        const data = JSON.parse(readFileSync(this.settingsPath, 'utf8'));
        return SettingsSchema.parse(data);
      }
    } catch {}
    return SettingsSchema.parse({});
  }

  saveSettings(settings: any) {
    const validated = SettingsSchema.parse(settings);
    writeFileSync(this.settingsPath, JSON.stringify(validated, null, 2));
    return validated;
  }
}

const settingsStore = new SettingsStore();
const adminCredentials = getOrCreateAdminCredentials();

export function mountSimpleAdmin(app: Application): void {
  // Simple login page
  app.get('/admin', (req: Request, res: Response) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>GPT Terminal Plus Admin</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .form-group { margin: 15px 0; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #005a87; }
        .section { margin: 30px 0; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        .credentials { background: #f0f8ff; padding: 15px; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>🔧 GPT Terminal Plus Admin</h1>
    
    <div class="credentials">
        <h3>🔐 Admin Credentials</h3>
        <p><strong>Email:</strong> ${adminCredentials.email}</p>
        <p><strong>Password:</strong> ${adminCredentials.password}</p>
    </div>

    <div class="section">
        <h2>⚙️ Settings</h2>
        <form id="settingsForm">
            <div class="form-group">
                <label>CORS Origins (comma-separated):</label>
                <input type="text" id="corsOrigins" value="${settingsStore.getSettings().app.corsOrigins.join(', ')}" />
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="shellEnabled" ${settingsStore.getSettings().features.executeShell.enabled ? 'checked' : ''} />
                    Enable Shell Execution
                </label>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="codeEnabled" ${settingsStore.getSettings().features.executeCode.enabled ? 'checked' : ''} />
                    Enable Code Execution
                </label>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="llmEnabled" ${settingsStore.getSettings().features.executeLlm.enabled ? 'checked' : ''} />
                    Enable LLM Delegation
                </label>
            </div>
            
            <div class="form-group">
                <label>LLM Provider:</label>
                <select id="llmProvider">
                    <option value="none" ${settingsStore.getSettings().llm.provider === 'none' ? 'selected' : ''}>None</option>
                    <option value="openai" ${settingsStore.getSettings().llm.provider === 'openai' ? 'selected' : ''}>OpenAI</option>
                    <option value="ollama" ${settingsStore.getSettings().llm.provider === 'ollama' ? 'selected' : ''}>Ollama</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Execute Timeout (milliseconds):</label>
                <input type="number" id="executeTimeout" value="${process.env.EXECUTE_TIMEOUT_MS || 120000}" min="1000" max="600000" step="1000" />
                <small>Default: 120000ms (2 minutes). Override with EXECUTE_TIMEOUT_MS env var.</small>
            </div>
            
            <button type="submit">💾 Save Settings</button>
        </form>
    </div>

    <div class="section">
        <h2>📊 System Status</h2>
        <p><strong>Health:</strong> <span id="healthStatus">Checking...</span></p>
        <p><strong>API Docs:</strong> <a href="/docs" target="_blank">/docs</a></p>
        <p><strong>OpenAPI:</strong> <a href="/openapi.json" target="_blank">/openapi.json</a></p>
    </div>

    <script>
        // Check health status
        fetch('/health')
            .then(r => r.json())
            .then(data => {
                document.getElementById('healthStatus').textContent = data.status === 'ok' ? '✅ Healthy' : '❌ Error';
            })
            .catch(() => {
                document.getElementById('healthStatus').textContent = '❌ Error';
            });

        // Handle form submission
        document.getElementById('settingsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const settings = {
                app: {
                    corsOrigins: document.getElementById('corsOrigins').value.split(',').map(s => s.trim())
                },
                features: {
                    executeShell: { enabled: document.getElementById('shellEnabled').checked },
                    executeCode: { enabled: document.getElementById('codeEnabled').checked },
                    executeLlm: { enabled: document.getElementById('llmEnabled').checked }
                },
                llm: {
                    provider: document.getElementById('llmProvider').value
                }
            };

            try {
                const response = await fetch('/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settings)
                });
                
                if (response.ok) {
                    alert('✅ Settings saved successfully!');
                } else {
                    alert('❌ Failed to save settings');
                }
            } catch (error) {
                alert('❌ Error: ' + error.message);
            }
        });
    </script>
</body>
</html>
    `);
  });

  // Settings API
  app.post('/admin/settings', (req: Request, res: Response) => {
    try {
      const settings = settingsStore.saveSettings(req.body);
      res.json({ success: true, settings });
    } catch (error) {
      res.status(400).json({ error: 'Invalid settings', details: error });
    }
  });

  console.log('Simple admin interface mounted at /admin');
}