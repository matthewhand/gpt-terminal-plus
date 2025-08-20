import AdminJS from 'adminjs';
import * as AdminJSExpress from '@adminjs/express';
import { Application } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SettingsSchema, Settings } from '../settings/schema';

// Simple file-based settings store
class SettingsStore {
  private settingsPath = path.join(process.cwd(), 'data', 'admin-settings.json');

  constructor() {
    // Ensure data directory exists
    const dataDir = path.dirname(this.settingsPath);
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }
  }

  getSettings(): Settings {
    try {
      if (existsSync(this.settingsPath)) {
        const data = JSON.parse(readFileSync(this.settingsPath, 'utf8'));
        return SettingsSchema.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load settings, using defaults:', error);
    }
    return SettingsSchema.parse({});
  }

  saveSettings(settings: Settings): void {
    const validated = SettingsSchema.parse(settings);
    writeFileSync(this.settingsPath, JSON.stringify(validated, null, 2));
  }
}

// Secure credential management
function getOrCreateAdminCredentials(credentialsPath: string) {
  try {
    if (existsSync(credentialsPath)) {
      return JSON.parse(readFileSync(credentialsPath, 'utf8'));
    }
  } catch {
    console.warn('Failed to load admin credentials, generating new ones');
  }

  // Generate secure random credentials
  const credentials = {
    email: `admin-${crypto.randomBytes(4).toString('hex')}@gpt-terminal-plus.local`,
    password: crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, '').substring(0, 20)
  };

  // Save credentials
  const dataDir = path.dirname(credentialsPath);
  if (!existsSync(dataDir)) {
    require('fs').mkdirSync(dataDir, { recursive: true });
  }
  writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));

  // Print credentials to console for first-time setup
  console.log('\n🔐 ADMIN CREDENTIALS GENERATED:');
  console.log('📧 Email:', credentials.email);
  console.log('🔑 Password:', credentials.password);
  console.log('🌐 Admin URL: http://localhost:5004/admin');
  console.log('💾 Credentials saved to:', credentialsPath);
  console.log('⚠️  Save these credentials securely!\n');

  return credentials;
}

const settingsStore = new SettingsStore();

// AdminJS Resource for Settings
const SettingsResource = {
  resource: {
    model: class SettingsModel {
      static async findOne() {
        return { id: 'settings', ...settingsStore.getSettings() };
      }
      
      static async update(id: string, payload: any) {
        const settings = SettingsSchema.parse(payload);
        settingsStore.saveSettings(settings);
        return { id: 'settings', ...settings };
      }
    },
    primaryKey: 'id'
  },
  options: {
    id: 'Settings',
    properties: {
      id: { isVisible: false },
      'app.corsOrigins': {
        type: 'mixed',
        isArray: true,
        description: 'Allowed CORS origins for ChatGPT integration'
      },
      'features.executeShell.enabled': {
        type: 'boolean',
        description: 'Enable shell command execution'
      },
      'features.executeCode.enabled': {
        type: 'boolean', 
        description: 'Enable code execution (Python, Node.js, etc.)'
      },
      'features.executeLlm.enabled': {
        type: 'boolean',
        description: 'Enable LLM delegation features'
      },
      'llm.enabled': {
        type: 'boolean',
        description: 'Enable LLM provider integration'
      },
      'llm.provider': {
        type: 'string',
        availableValues: [
          { value: 'none', label: 'None' },
          { value: 'openai', label: 'OpenAI' },
          { value: 'ollama', label: 'Ollama' },
          { value: 'lmstudio', label: 'LM Studio' },
          { value: 'litellm', label: 'LiteLLM' }
        ],
        description: 'LLM provider to use'
      },
      'llm.defaultModel': {
        type: 'string',
        description: 'Default model name'
      },
      'llm.baseURL': {
        type: 'string',
        description: 'Base URL for LLM API'
      },
      'llm.ollamaURL': {
        type: 'string',
        description: 'Ollama server URL'
      },
      'llm.lmstudioURL': {
        type: 'string',
        description: 'LM Studio server URL'
      }
    },
    actions: {
      new: { isVisible: false },
      delete: { isVisible: false },
      bulkDelete: { isVisible: false }
    }
  }
};

export function mountAdmin(app: Application): void {
  const admin = new AdminJS({
    rootPath: '/admin',
    branding: {
      companyName: 'GPT Terminal Plus',
      logo: false,
      favicon: '/favicon.ico'
    },
    resources: [SettingsResource]
  });

  // Generate secure credentials on first run
  const credentialsPath = path.join(process.cwd(), 'data', 'admin-credentials.json');
  let adminCredentials = getOrCreateAdminCredentials(credentialsPath);

  const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email: string, password: string) => {
      if (email === adminCredentials.email && password === adminCredentials.password) {
        return { email, role: 'admin' };
      }
      return null;
    },
    cookieName: 'gtp_admin_session',
    cookiePassword: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex')
  });

  app.use(admin.options.rootPath, router);
  console.log(`AdminJS mounted at ${admin.options.rootPath}`);
}