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
  app: z.object({
    corsOrigins: z.array(z.string()).default([
      'https://chat.openai.com',
      'https://chatgpt.com',
    ]),
  }).default({}),
  features: z.object({
    executeShell: ExecuteShellSchema.default({}),
    executeCode: ExecuteCodeSchema.default({}),
    executeLlm: ExecuteLlmSchema.default({}),
  }).default({}),
});

export type Settings = z.infer<typeof SettingsSchema>;
