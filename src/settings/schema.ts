import { z } from 'zod';

// Execution features with dependency validation
const ExecutionFeaturesSchema = z.object({
  executeShell: z.object({
    enabled: z.boolean().default(true),
    timeoutMs: z.number().default(120000),
    allowedShells: z.array(z.string()).default(['bash', 'sh', 'powershell']),
  }),
  executeCode: z.object({
    enabled: z.boolean().default(true),
    timeoutMs: z.number().default(120000),
    supportedLanguages: z.array(z.string()).default(['python', 'node']),
  }),
  executeLlm: z.object({
    enabled: z.boolean().default(false), // Requires shell to be enabled
    timeoutMs: z.number().default(120000),
    provider: z.string().default('none'),
  }),
  sessions: z.object({
    enabled: z.boolean().default(false),
    maxSessions: z.number().default(10),
    timeoutMs: z.number().default(1800000), // 30 minutes
  }),
}).refine((data) => {
  // LLM requires shell execution (uses shell commands)
  if (data.executeLlm.enabled && !data.executeShell.enabled) {
    return false;
  }
  return true;
}, {
  message: "LLM execution requires shell execution to be enabled",
  path: ["executeLlm", "enabled"]
});

export const SettingsSchema = z.object({
  server: z.object({
    port: z.number().default(5004),
    host: z.string().default('0.0.0.0'),
    publicBaseUrl: z.string().optional(),
  }),
  security: z.object({
    apiToken: z.string().default('gtp-token-' + Math.random().toString(36).substring(2)),
    corsOrigins: z.array(z.string()).default(['https://chatgpt.com', 'https://chat.openai.com']),
  }),
  features: ExecutionFeaturesSchema,
  files: z.object({
    enabled: z.boolean().default(true),
    maxFileSize: z.number().default(10485760), // 10MB
    allowedExtensions: z.array(z.string()).default(['.txt', '.md', '.json', '.js', '.ts', '.py']),
  }),
  llm: z.object({
    provider: z.string().default('none'),
    openai: z.object({
      apiKey: z.string().optional(),
      baseUrl: z.string().default('https://api.openai.com/v1'),
      model: z.string().default('gpt-4'),
    }),
    ollama: z.object({
      baseUrl: z.string().default('http://localhost:11434'),
      model: z.string().default('llama3.1:8b'),
    }),
  }),
});

export type Settings = z.infer<typeof SettingsSchema>;
export type ExecutionFeatures = z.infer<typeof ExecutionFeaturesSchema>;