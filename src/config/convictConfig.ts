import convict from 'convict';

type RedactedValue = string | number | boolean | null | string[] | number[] | boolean[] | Record<string, unknown>;

let __singletonCfg: any | null = null;

export const convictConfig = () => {
  // In test environment, always construct a fresh instance so per-test
  // environment variable changes are reflected. Cache only outside tests.
  const useCache = process.env.NODE_ENV !== 'test';
  if (useCache && __singletonCfg) return __singletonCfg;
  // Schema with env mappings and defaults
  const cfg = convict({
    // Execution circuit breakers and limits
    limits: {
      maxInputChars: {
        doc: 'Maximum input size for commands (characters)',
        format: 'nat',
        default: 10000,
        env: 'MAX_INPUT_CHARS'
      },
      maxOutputChars: {
        doc: 'Maximum combined stdout+stderr size returned (characters)',
        format: 'nat',
        default: 200000,
        env: 'MAX_OUTPUT_CHARS'
      },
      maxSessionDurationSec: {
        doc: 'Maximum lifetime for a shell session (seconds)',
        format: 'nat',
        default: 7200,
        env: 'MAX_SESSION_DURATION_SEC'
      },
      maxSessionIdleSec: {
        doc: 'Maximum idle time for a shell session (seconds)',
        format: 'nat',
        default: 600,
        env: 'MAX_SESSION_IDLE_SEC'
      },
      maxLlmCostUsd: {
        doc: 'Maximum cumulative LLM cost (USD) before blocking',
        format: Number,
        default: 0,
        env: 'MAX_LLM_COST_USD'
      },
      allowTruncation: {
        doc: 'Allow truncation of outputs when exceeding limits',
        format: Boolean,
        default: true,
        env: 'ALLOW_TRUNCATION'
      }
    },
    shell: {
      defaultShell: {
        doc: 'Default shell used for WebSocket and session endpoints',
        format: String,
        default: 'bash',
        env: 'DEFAULT_SHELL'
      }
    },
    server: {
      port: {
        doc: 'Port the HTTP server listens on',
        format: 'port',
        default: 5005,
        env: 'PORT'
      },
      httpsEnabled: {
        doc: 'Enable HTTPS',
        format: Boolean,
        default: false,
        env: 'HTTPS_ENABLED'
      },
      httpsKeyPath: {
        doc: 'Path to HTTPS private key (PEM) when HTTPS enabled',
        format: String,
        default: '',
        env: 'HTTPS_KEY_PATH'
      },
      httpsCertPath: {
        doc: 'Path to HTTPS certificate (PEM) when HTTPS enabled',
        format: String,
        default: '',
        env: 'HTTPS_CERT_PATH'
      },
      corsOrigin: {
        doc: 'Comma-separated list of allowed CORS origins',
        format: String,
        default: 'https://chat.openai.com,https://chatgpt.com',
        env: 'CORS_ORIGIN'
      },
      disableHealthLog: {
        doc: 'If true, suppress logs for /health',
        format: Boolean,
        default: false,
        env: 'DISABLE_HEALTH_LOG'
      },
      sseHeartbeatMs: {
        doc: 'SSE heartbeat interval (ms)',
        format: 'nat',
        default: 15000,
        env: 'SSE_HEARTBEAT_MS'
      },
      useServerless: {
        doc: 'Enable serverless-http handler export',
        format: Boolean,
        default: false,
        env: 'USE_SERVERLESS'
      },
      useMcp: {
        doc: 'Enable MCP server /mcp/messages',
        format: Boolean,
        default: false,
        env: 'USE_MCP'
      },
      publicBaseUrl: {
        doc: 'Absolute base URL advertised in OpenAPI servers[0].url',
        format: String,
        default: '',
        env: 'PUBLIC_BASE_URL'
      },
      publicHost: {
        doc: 'Host used when deriving public URL if PUBLIC_BASE_URL not set',
        format: String,
        default: 'localhost',
        env: 'PUBLIC_HOST'
      }
    },
    // Feature flags and execution toggles
    execution: {
      shell: {
        enabled: {
          doc: 'Enable shell execution endpoints',
          format: Boolean,
          default: true,
          env: 'LOCALHOST_ENABLED'
        }
      },
      llm: {
        enabled: {
          doc: 'Enable LLM execution endpoints',
          format: Boolean,
          default: true,
          env: 'LLM_ENABLED'
        }
      }
    },
    // Configurable executors/runtimes
    executors: {
      exposureMode: {
        doc: 'Which execution endpoints to expose in OpenAPI: generic (execute-shell), specific (execute-<name>), both, or none',
        format: ['generic','specific','both','none'],
        default: 'generic',
        env: 'EXEC_EXPOSURE_MODE'
      },
      bash: {
        enabled: { doc: 'Enable bash executor', format: Boolean, default: true, env: 'EXEC_BASH_ENABLED' },
        cmd: { doc: 'Command to run bash', format: String, default: 'bash', env: 'EXEC_BASH_CMD' },
        args: { doc: 'Default args for bash', format: Array, default: [] as any[], env: 'EXEC_BASH_ARGS' },
        timeoutMs: { doc: 'Timeout for bash commands', format: 'nat', default: 0, env: 'EXEC_BASH_TIMEOUT_MS' }
      },
      zsh: {
        enabled: { doc: 'Enable zsh executor', format: Boolean, default: false, env: 'EXEC_ZSH_ENABLED' },
        cmd: { doc: 'Command to run zsh', format: String, default: 'zsh', env: 'EXEC_ZSH_CMD' },
        args: { doc: 'Default args for zsh', format: Array, default: [] as any[], env: 'EXEC_ZSH_ARGS' },
        timeoutMs: { doc: 'Timeout for zsh commands', format: 'nat', default: 0, env: 'EXEC_ZSH_TIMEOUT_MS' }
      },
      powershell: {
        enabled: { doc: 'Enable PowerShell executor', format: Boolean, default: false, env: 'EXEC_POWERSHELL_ENABLED' },
        cmd: { doc: 'Command to run PowerShell (pwsh or powershell)', format: String, default: 'pwsh', env: 'EXEC_POWERSHELL_CMD' },
        args: { doc: 'Default args for PowerShell', format: Array, default: ['-NoLogo','-NonInteractive','-Command'] as any[], env: 'EXEC_POWERSHELL_ARGS' },
        timeoutMs: { doc: 'Timeout for PowerShell commands', format: 'nat', default: 0, env: 'EXEC_POWERSHELL_TIMEOUT_MS' }
      },
      python: {
        enabled: { doc: 'Enable python executor', format: Boolean, default: true, env: 'EXEC_PYTHON_ENABLED' },
        cmd: { doc: 'Python interpreter', format: String, default: 'python3', env: 'EXEC_PYTHON_CMD' },
        args: { doc: 'Default args for python', format: Array, default: [] as any[], env: 'EXEC_PYTHON_ARGS' },
        timeoutMs: { doc: 'Timeout for Python code execution', format: 'nat', default: 0, env: 'EXEC_PYTHON_TIMEOUT_MS' }
      },
      typescript: {
        enabled: { doc: 'Enable TypeScript executor', format: Boolean, default: false, env: 'EXEC_TS_ENABLED' },
        cmd: { doc: 'TypeScript runner', format: String, default: 'npx', env: 'EXEC_TS_CMD' },
        args: { doc: 'Default args for TS runner', format: Array, default: ['-y','ts-node@latest','-T'] as any[], env: 'EXEC_TS_ARGS' },
        timeoutMs: { doc: 'Timeout for TS code execution', format: 'nat', default: 0, env: 'EXEC_TS_TIMEOUT_MS' }
      }
    },
    features: {
      llmConsole: {
        doc: 'Enable LLM Console UI and APIs',
        format: Boolean,
        default: false,
        env: 'LLM_CONSOLE_ENABLED'
      }
    },
    files: {
      enabled: {
        doc: 'Enable file operation endpoints',
        format: Boolean,
        default: true,
        env: 'FILE_OPS_ENABLED'
      },
      consequential: {
        doc: 'Mark file routes as consequential in OpenAI/OpenAPI metadata',
        format: Boolean,
        default: true,
        env: 'FILE_OPS_CONSEQUENTIAL'
      }
    },
    security: {
      apiToken: {
        doc: 'Bearer API token; generated at runtime if not set',
        format: String,
        default: '',
        env: 'API_TOKEN',
        sensitive: true
      },
      denyCommandRegex: {
        doc: 'Regex list (comma-separated) of deny patterns',
        format: String,
        default: '',
        env: 'DENY_COMMAND_REGEX'
      },
      confirmCommandRegex: {
        doc: 'Regex list (comma-separated) of confirm patterns',
        format: String,
        default: '',
        env: 'CONFIRM_COMMAND_REGEX'
      }
    },
    llm: {
      provider: {
        doc: 'Selected AI provider',
        format: ['openai', 'ollama', 'lmstudio', 'open-interpreter', 'auto', ''],
        default: '',
        env: 'AI_PROVIDER'
      },
      openai: {
        baseUrl: {
          doc: 'OpenAI-compatible base URL',
          format: String,
          default: '',
          env: 'OPENAI_BASE_URL'
        },
        apiKey: {
          doc: 'OpenAI API key',
          format: String,
          default: '',
          env: 'OPENAI_API_KEY',
          sensitive: true
        }
      },
      ollama: {
        baseUrl: {
          doc: 'Ollama base URL',
          format: String,
          default: '',
          env: 'OLLAMA_BASE_URL'
        }
      },
      lmstudio: {
        baseUrl: {
          doc: 'LM Studio base URL',
          format: String,
          default: '',
          env: 'LMSTUDIO_BASE_URL'
        }
      },
      // Compatibility with src/common/llmConfig.ts environment knobs
      compat: {
        llmProvider: {
          doc: 'Compat LLM provider (used by llmConfig.ts)',
          format: String,
          default: '',
          env: 'LLM_PROVIDER'
        },
        llmModel: {
          doc: 'Compat model (used by llmConfig.ts)',
          format: String,
          default: '',
          env: 'LLM_MODEL'
        },
        ollamaHost: {
          doc: 'Compat Ollama host (used by llmConfig.ts)',
          format: String,
          default: '',
          env: 'OLLAMA_HOST'
        },
        interpreterHost: {
          doc: 'Compat Open Interpreter host',
          format: String,
          default: '',
          env: 'INTERPRETER_SERVER_HOST'
        },
        interpreterPort: {
          doc: 'Compat Open Interpreter port',
          format: 'port',
          default: 0,
          env: 'INTERPRETER_SERVER_PORT'
        },
        interpreterOffline: {
          doc: 'Compat Open Interpreter offline flag',
          format: Boolean,
          default: false,
          env: 'INTERPRETER_OFFLINE'
        },
        interpreterVerbose: {
          doc: 'Compat Open Interpreter verbose flag',
          format: Boolean,
          default: true,
          env: 'INTERPRETER_VERBOSE'
        }
      }
    },
    // Optional profiles/settings exposed by configRoutes
    activeProfile: {
      doc: 'Active profile name (if any)',
      format: String,
      default: '',
      env: 'ACTIVE_PROFILE'
    },
    profiles: {
      doc: 'Profiles array (opaque structure – managed by profiles.ts)',
      format: Array,
      default: [] as any[],
      env: 'PROFILES_JSON'
    }
  });
  // Auto-detect common executors on first init (skip during tests to keep determinism)
  try {
    if (process.env.NODE_ENV !== 'test') {
      const { detectSystemExecutors } = require('../utils/executorDetect');
      const detected = detectSystemExecutors();

      // Helper to only set when env var not explicitly provided
      const ensure = (envName: string | undefined, setFn: () => void) => {
        if (!envName || process.env[envName] === undefined) setFn();
      };
      const schema = (cfg as any).getSchema();
      const envOf = (path: string): string | undefined => {
        const segs = path.split('.');
        let node: any = schema.properties;
        for (const s of segs) {
          node = node?.[s] || node?.properties?.[s];
        }
        return node?.env;
      };

      // bash
      ensure(envOf('executors.bash.enabled'), () => (cfg as any).set('executors.bash.enabled', !!detected.bash?.available));
      if (detected.bash?.cmd) ensure(envOf('executors.bash.cmd'), () => (cfg as any).set('executors.bash.cmd', detected.bash.cmd));
      // zsh
      if (detected.zsh?.available) ensure(envOf('executors.zsh.enabled'), () => (cfg as any).set('executors.zsh.enabled', true));
      if (detected.zsh?.cmd) ensure(envOf('executors.zsh.cmd'), () => (cfg as any).set('executors.zsh.cmd', detected.zsh.cmd));
      // powershell (prefer pwsh)
      if (detected.pwsh?.available || detected.powershell?.available) {
        ensure(envOf('executors.powershell.enabled'), () => (cfg as any).set('executors.powershell.enabled', true));
        const psCmd = detected.pwsh?.cmd || detected.powershell?.cmd || 'pwsh';
        ensure(envOf('executors.powershell.cmd'), () => (cfg as any).set('executors.powershell.cmd', psCmd));
      }
      // python (prefer python3)
      if (detected.python3?.available || detected.python?.available) {
        ensure(envOf('executors.python.cmd'), () => (cfg as any).set('executors.python.cmd', detected.python3?.cmd || detected.python?.cmd || 'python3'));
        // keep enabled default true unless explicitly disabled
      }
    }
  } catch (e) {
    // Detection failures should never crash boot
    console.warn('Executor auto-detect skipped due to error:', (e as Error)?.message);
  }
  if (useCache) __singletonCfg = cfg;
  return cfg;
};

/**
 * Build a redacted view with readOnly flags based on env overrides.
 * "readOnly" is set when the mapped env var is present.
 */
export function getRedactedSettings(): Record<string, Record<string, { value: RedactedValue; readOnly: boolean }>> {
  const cfg = convictConfig();
  cfg.validate({ allowed: 'warn' });

  const redactKeys = new Set([
    'security.apiToken',
    'llm.openai.apiKey'
  ]);

  // Helper to fetch env mapping for a given path
  const envOf = (schemaNode: any): string | undefined => {
    if (!schemaNode) return undefined;
    return typeof schemaNode.env === 'string' ? schemaNode.env : undefined;
  };

  const schema = (cfg as any).getSchema();
  const result: Record<string, Record<string, { value: RedactedValue; readOnly: boolean }>> = {};

  const assign = (group: string, key: string, value: RedactedValue, envName?: string) => {
    if (!result[group]) result[group] = {};
    const path = `${group}.${key}`;
    const masked = redactKeys.has(path)
      ? (typeof value === 'string' && value.length > 0 ? '*****' : '')
      : value;
    result[group][key] = {
      value: masked,
      readOnly: !!(envName && process.env[envName] !== undefined)
    };
  };

  // server group
  assign('server', 'port', (cfg as any).get('server.port'), envOf(schema.properties.server.properties.port));
  assign('server', 'httpsEnabled', (cfg as any).get('server.httpsEnabled'), envOf(schema.properties.server.properties.httpsEnabled));
  assign('server', 'httpsKeyPath', (cfg as any).get('server.httpsKeyPath'), envOf(schema.properties.server.properties.httpsKeyPath));
  assign('server', 'httpsCertPath', (cfg as any).get('server.httpsCertPath'), envOf(schema.properties.server.properties.httpsCertPath));
  assign('server', 'corsOrigin', (cfg as any).get('server.corsOrigin'), envOf(schema.properties.server.properties.corsOrigin));
  assign('server', 'disableHealthLog', (cfg as any).get('server.disableHealthLog'), envOf(schema.properties.server.properties.disableHealthLog));
  assign('server', 'sseHeartbeatMs', (cfg as any).get('server.sseHeartbeatMs'), envOf(schema.properties.server.properties.sseHeartbeatMs));
  assign('server', 'useServerless', (cfg as any).get('server.useServerless'), envOf(schema.properties.server.properties.useServerless));
  assign('server', 'useMcp', (cfg as any).get('server.useMcp'), envOf(schema.properties.server.properties.useMcp));
  assign('server', 'publicBaseUrl', (cfg as any).get('server.publicBaseUrl'), envOf(schema.properties.server.properties.publicBaseUrl));
  assign('server', 'publicHost', (cfg as any).get('server.publicHost'), envOf(schema.properties.server.properties.publicHost));

  // security group
  assign('security', 'apiToken', (cfg as any).get('security.apiToken'), envOf(schema.properties.security.properties.apiToken));
  assign('security', 'denyCommandRegex', (cfg as any).get('security.denyCommandRegex'), envOf(schema.properties.security.properties.denyCommandRegex));
  assign('security', 'confirmCommandRegex', (cfg as any).get('security.confirmCommandRegex'), envOf(schema.properties.security.properties.confirmCommandRegex));

  // llm group
  assign('llm', 'provider', (cfg as any).get('llm.provider'), envOf(schema.properties.llm.properties.provider));
  assign('llm', 'openai.baseUrl', (cfg as any).get('llm.openai.baseUrl'), envOf(schema.properties.llm.properties.openai.properties.baseUrl));
  assign('llm', 'openai.apiKey', (cfg as any).get('llm.openai.apiKey'), envOf(schema.properties.llm.properties.openai.properties.apiKey));
  assign('llm', 'ollama.baseUrl', (cfg as any).get('llm.ollama.baseUrl'), envOf(schema.properties.llm.properties.ollama.properties.baseUrl));
  assign('llm', 'lmstudio.baseUrl', (cfg as any).get('llm.lmstudio.baseUrl'), envOf(schema.properties.llm.properties.lmstudio.properties.baseUrl));

  // compat group
  assign('compat', 'llmProvider', (cfg as any).get('llm.compat.llmProvider'), envOf(schema.properties.llm.properties.compat.properties.llmProvider));
  assign('compat', 'llmModel', (cfg as any).get('llm.compat.llmModel'), envOf(schema.properties.llm.properties.compat.properties.llmModel));
  assign('compat', 'ollamaHost', (cfg as any).get('llm.compat.ollamaHost'), envOf(schema.properties.llm.properties.compat.properties.ollamaHost));
  assign('compat', 'interpreterHost', (cfg as any).get('llm.compat.interpreterHost'), envOf(schema.properties.llm.properties.compat.properties.interpreterHost));
  assign('compat', 'interpreterPort', (cfg as any).get('llm.compat.interpreterPort'), envOf(schema.properties.llm.properties.compat.properties.interpreterPort));
  assign('compat', 'interpreterOffline', (cfg as any).get('llm.compat.interpreterOffline'), envOf(schema.properties.llm.properties.compat.properties.interpreterOffline));
  assign('compat', 'interpreterVerbose', (cfg as any).get('llm.compat.interpreterVerbose'), envOf(schema.properties.llm.properties.compat.properties.interpreterVerbose));

  return result;
}
