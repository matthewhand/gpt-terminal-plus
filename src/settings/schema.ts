import { z } from 'zod';

export const SettingsSchema = z.object({
  server: z.object({
    port: z.number().default(5004),
    host: z.string().default('0.0.0.0'),
    publicBaseUrl: z.string().optional(),
  }),
  auth: z.object({
    apiToken: z.string().default('gtp-token-' + Math.random().toString(36).substring(2)),
    adminUsername: z.string().default('admin'),
    adminPassword: z.string().default('admin-' + Math.random().toString(36).substring(2)),
  }),
  execution: z.object({
    llm: z.object({
      enabled: z.boolean().default(false),
      provider: z.string().default('openai'),
      model: z.string().default('gpt-4'),
      apiKey: z.string().optional(),
    }),
  }),
  app: z.object({
    corsOrigins: z.array(z.string()).default(['*']),
  }),
  llm: z.object({
    provider: z.string().default('none'),
  }),
  features: z.object({
    llmConsole: z.boolean().default(false),
    executeShell: z.object({
      enabled: z.boolean().default(false),
    }),
    executeCode: z.object({
      enabled: z.boolean().default(false),
    }),
    executeLlm: z.object({
      enabled: z.boolean().default(false),
    }),
  }),
});

export type Settings = z.infer<typeof SettingsSchema>;