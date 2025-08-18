import express, { Request } from 'express';
import { stringify as yamlStringify } from 'yaml';
import fs from 'fs';
import path from 'path';

/** Public base URL for OpenAPI `servers` — prefers env, else request, else fallbacks. */
export function getPublicBaseUrl(req?: Request): string {
  const envUrl = process.env.PUBLIC_BASE_URL;
  if (envUrl && /^https?:\/\//i.test(envUrl)) return envUrl.replace(/\/+$/, '');

  if (req) {
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
    const host = req.get('host') || 'localhost:3100';
    return `${proto}://${host}`;
  }

  const protocol = process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http';
  const port = process.env.PORT ? Number(process.env.PORT) : 3100;
  const host = process.env.PUBLIC_HOST || 'localhost';
  return `${protocol}://${host}:${port}`;
}

/** Attempt to read a static OpenAPI artifact from public/, else return null. */
function readPublicFileIfExists(filename: 'openapi.json' | 'openapi.yaml'): string | null {
  try {
    const filePath = path.resolve(process.cwd(), 'public', filename);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  } catch {
    return null;
  }
}

/** Build the OpenAPI object; derive servers[] from the actual request unless PUBLIC_BASE_URL is set. */
function buildSpec(req?: Request) {
  const baseUrl = getPublicBaseUrl(req);

  return {
    openapi: '3.0.3',
    info: {
      title: 'gpt-terminal-plus API',
      version: '0.1.0',
      description: 'Runtime OpenAPI surface for listing servers and executing commands/code/LLM.',
    },
    servers: [{ url: baseUrl, description: 'Runtime base URL' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'API_TOKEN' },
      },
      schemas: {
        ExecutionResult: {
          type: 'object',
          properties: {
            stdout: { type: 'string' },
            stderr: { type: 'string' },
            exitCode: { type: 'integer' },
            error: { type: 'boolean' },
          },
          required: ['stdout', 'stderr', 'exitCode', 'error'],
        },
      },
    },
    security: [{ bearerAuth: [] as any[] }],
    paths: {
      '/server/list': {
        get: {
          operationId: 'serverList',
          summary: 'List servers for this API token',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      servers: { type: 'array', items: { type: 'object' } },
                    },
                    required: ['servers'],
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/command/execute': {
        post: {
          operationId: 'executeCommand',
          summary: 'Execute using first available mode',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { command: { type: 'string' } },
                  required: ['command'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Execution complete',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      result: { $ref: '#/components/schemas/ExecutionResult' },
                      aiAnalysis: { type: 'object' },
                    },
                    required: ['result'],
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/command/execute-code': {
        post: {
          operationId: 'executeCode',
          summary: 'Execute a code snippet',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    language: { type: 'string' },
                    code: { type: 'string' },
                    timeoutMs: { type: 'integer' },
                  },
                  required: ['language', 'code'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Execution complete',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      result: { $ref: '#/components/schemas/ExecutionResult' },
                      aiAnalysis: { type: 'object' },
                    },
                    required: ['result'],
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/command/execute-file': {
        post: {
          operationId: 'executeFile',
          summary: 'Execute a file present on the server/target (deprecated)',
          deprecated: true,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    filename: { type: 'string' },
                    directory: { type: 'string' },
                    timeoutMs: { type: 'integer' },
                  },
                  required: ['filename'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Execution complete',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      result: { $ref: '#/components/schemas/ExecutionResult' },
                      aiAnalysis: { type: 'object' },
                    },
                    required: ['result'],
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/command/execute-llm': {
        post: {
          operationId: 'executeLlm',
          summary: 'Run an LLM plan or direct instruction',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    instructions: { type: 'string' },
                    dryRun: { type: 'boolean' },
                    stream: { type: 'boolean' },
                  },
                  required: ['instructions'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'LLM execution complete',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      plan: { type: 'object' },
                      results: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
    },
  };
}

/** Register dynamic OpenAPI routes. */
export function registerOpenAPIRoutes(app: express.Application): void {
  app.get('/openapi.json', (req, res) => {
    const staticJson = readPublicFileIfExists('openapi.json');
    if (staticJson) {
      try {
        return res.json(JSON.parse(staticJson));
      } catch {
        // fall through to dynamic builder if static file is invalid
      }
    }
    res.json(buildSpec(req));
  });

  app.get('/openapi.yaml', (req, res) => {
    const staticYaml = readPublicFileIfExists('openapi.yaml');
    if (staticYaml) {
      return res.type('application/yaml').send(staticYaml);
    }
    const yaml = yamlStringify(buildSpec(req));
    res.type('application/yaml').send(yaml);
  });
}

/** Backward-compatible export name (some imports use camel-case Api). */
export const registerOpenApiRoutes = registerOpenAPIRoutes;
