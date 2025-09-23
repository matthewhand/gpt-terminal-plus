import { z } from 'zod';

export const RemoteTargetSchema = z.object({
  enabled: z.boolean().default(true),
  host: z.string().optional(),
  port: z.number().int().positive().optional(),
  user: z.string().optional(),
  profile: z.string().optional(),
  timeoutMs: z.number().int().positive().default(60_000),
});

export const ExecuteShellSchema = z.object({
  enabled: z.boolean().default(true),
  local: RemoteTargetSchema.default({ enabled: true, timeoutMs: 60_000 }),
  ssh: RemoteTargetSchema.default({ enabled: false, timeoutMs: 120_000 }),
  ssm: RemoteTargetSchema.default({ enabled: false, timeoutMs: 180_000 }),
});

export const ExecuteCodeSchema = z.object({
  enabled: z.boolean().default(true),
  languages: z.array(z.string()).default(['bash', 'python', 'node']),
  local: RemoteTargetSchema.default({ enabled: true, timeoutMs: 60_000 }),
  ssh: RemoteTargetSchema.default({ enabled: false, timeoutMs: 120_000 }),
  ssm: RemoteTargetSchema.default({ enabled: false, timeoutMs: 180_000 }),
});

export const ExecuteLlmSchema = z.object({
  enabled: z.boolean().default(true),
  providersAllowed: z.array(z.string()).default(['local-mock']),
  local: RemoteTargetSchema.default({ enabled: true, timeoutMs: 90_000 }),
  ssh: RemoteTargetSchema.default({ enabled: false, timeoutMs: 180_000 }),
  ssm: RemoteTargetSchema.default({ enabled: false, timeoutMs: 180_000 }),
});

export const SettingsSchema = z.object({
  server: z
    .object({
      port: z.number().default(5004),
      host: z.string().default('0.0.0.0'),
      publicBaseUrl: z.string().optional(),
    })
    .default({}),
  auth: z
    .object({
      apiToken: z.string().default(
        'gtp-token-' + Math.random().toString(36).substring(2)
      ),
      adminUsername: z.string().default('admin'),
      adminPassword: z
        .string()
        .default('admin-' + Math.random().toString(36).substring(2)),
    })
    .default({}),
  app: z
    .object({
      corsOrigins: z.array(z.string()).default(['*']),
    })
    .default({}),
  execution: z
    .object({
      shell: ExecuteShellSchema.default({}), // Integrated
      code: ExecuteCodeSchema.default({}), // Integrated
      llm: ExecuteLlmSchema.default({}), // Integrated
    })
    .default({}),
  files: z
    .object({
      enabled: z.boolean().default(true),
      fsRead: z.boolean().default(true),
      fsWrite: z.boolean().default(true),
      fsSearch: z.boolean().default(true),
    })
    .default({}),
  features: z.object({
    executeShell: ExecuteShellSchema.default({}),
    executeCode: ExecuteCodeSchema.default({}),
    executeLlm: ExecuteLlmSchema.default({}),
  }).default({}),
  llm: z
    .object({
      enabled: z.boolean().default(false),
      provider: z
        .enum(['none', 'openai', 'ollama', 'lmstudio', 'litellm'])
        .default('none'),
      defaultModel: z.string().default(''),
      baseURL: z.string().default(''),
      apiKey: z.string().default(''),
      ollamaURL: z.string().default('http://localhost:11434'),
      lmstudioURL: z.string().default('http://localhost:1234/v1'),
    })
    .default({}),
});

export type Settings = z.infer<typeof SettingsSchema>;
