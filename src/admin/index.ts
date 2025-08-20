import AdminJS from 'adminjs';
import * as AdminJSExpress from '@adminjs/express';
import { Application } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SettingsSchema, Settings } from '../settings/schema';
import { ServerManager } from '../managers/ServerManager';

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

// Server management store
class ServerStore {
  private serversPath = path.join(process.cwd(), 'data', 'admin-servers.json');

  constructor() {
    const dataDir = path.dirname(this.serversPath);
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }
  }

  getServers() {
    try {
      if (existsSync(this.serversPath)) {
        return JSON.parse(readFileSync(this.serversPath, 'utf8'));
      }
    } catch {
      console.warn('Failed to load servers, using defaults');
    }
    return [];
  }

  saveServers(servers: any[]) {
    writeFileSync(this.serversPath, JSON.stringify(servers, null, 2));
  }

  addServer(server: any) {
    const servers = this.getServers();
    servers.push({ ...server, id: crypto.randomBytes(8).toString('hex') });
    this.saveServers(servers);
    return servers[servers.length - 1];
  }

  updateServer(id: string, updates: any) {
    const servers = this.getServers();
    const index = servers.findIndex((s: any) => s.id === id);
    if (index >= 0) {
      servers[index] = { ...servers[index], ...updates };
      this.saveServers(servers);
      return servers[index];
    }
    return null;
  }

  deleteServer(id: string) {
    const servers = this.getServers();
    const filtered = servers.filter((s: any) => s.id !== id);
    this.saveServers(filtered);
    return filtered.length < servers.length;
  }
}

const serverStore = new ServerStore();

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

// AdminJS Resource for Servers
const ServersResource = {
  resource: {
    model: class ServersModel {
      static async find() {
        return serverStore.getServers();
      }
      
      static async findOne(id: string) {
        const servers = serverStore.getServers();
        return servers.find((s: any) => s.id === id);
      }
      
      static async create(payload: any) {
        return serverStore.addServer(payload);
      }
      
      static async update(id: string, payload: any) {
        return serverStore.updateServer(id, payload);
      }
      
      static async delete(id: string) {
        serverStore.deleteServer(id);
        return { id };
      }
    },
    primaryKey: 'id'
  },
  options: {
    id: 'Servers',
    properties: {
      id: { isVisible: { list: true, show: true, edit: false, filter: true } },
      hostname: {
        type: 'string',
        isRequired: true,
        description: 'Server hostname or identifier'
      },
      protocol: {
        type: 'string',
        availableValues: [
          { value: 'local', label: 'Local' },
          { value: 'ssh', label: 'SSH' },
          { value: 'ssm', label: 'AWS SSM' }
        ],
        isRequired: true,
        description: 'Connection protocol'
      },
      host: {
        type: 'string',
        description: 'SSH host address (for SSH protocol)'
      },
      port: {
        type: 'number',
        description: 'SSH port (default: 22)'
      },
      username: {
        type: 'string',
        description: 'SSH username'
      },
      privateKeyPath: {
        type: 'string',
        description: 'Path to SSH private key'
      },
      instanceId: {
        type: 'string',
        description: 'AWS EC2 instance ID (for SSM protocol)'
      },
      region: {
        type: 'string',
        description: 'AWS region (for SSM protocol)'
      },
      enabled: {
        type: 'boolean',
        description: 'Enable this server'
      }
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
    resources: [SettingsResource, ServersResource]
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