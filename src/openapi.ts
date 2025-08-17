import express, { Request, Response } from 'express';

/** Determine the public base URL for the OpenAPI `servers` stanza. */
export function getPublicBaseUrl(): string {
  // Highest precedence: explicit PUBLIC_BASE_URL
  const envUrl = process.env.PUBLIC_BASE_URL;
  if (envUrl && /^https?:\/\//i.test(envUrl)) return envUrl.replace(/\/+$/, '');

  // Next: HTTPS_ENABLED + PORT
  const protocol = process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http';
  const port = process.env.PORT ? Number(process.env.PORT) : 3100;

  // Optional host override (eg behind reverse proxy)
  const host = process.env.PUBLIC_HOST || 'localhost';

  return `${protocol}://${host}:${port}`;
}

/** Tiny JSON -> YAML emitter (safe for our simple OpenAPI structure). */
function jsonToYaml(value: any, indent = 0): string {
  const pad = '  '.repeat(indent);
  const str = (s: string) => JSON.stringify(s);

  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value.map(v => `${pad}- ${jsonToYaml(v, indent + 1).replace(/^\s+/, '')}`).join('\n');
  }
  switch (typeof value) {
    case 'string': return str(value);
    case 'number': return String(value);
    case 'boolean': return value ? 'true' : 'false';
    case 'object': {
      const entries = Object.entries(value);
      if (entries.length === 0) return '{}';
      return entries.map(([k, v]) => {
        const rendered = jsonToYaml(v, indent + 1);
        const needsBlock = typeof v === 'object' && v !== null && !Array.isArray(v);
        return needsBlock
          ? `${pad}${k}:\n${rendered}`
          : `${pad}${k}: ${rendered}`;
      }).join('\n');
    }
    default: return str(String(value));
  }
}

/** Build the OpenAPI spec using runtime context. */
export function buildOpenApiSpec(_app: express.Application) {
  const components = {
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
        required: ['stdout','stderr','exitCode','error'],
      },
    },
  } as const;

  const paths: Record<string, any> = {
    '/server/list': {
      get: {
        summary: 'List servers for this API token',
        responses: {
          200: {
            description: 'List of servers',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['servers'],
                  properties: {
                    servers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['key','label','protocol'],
                        properties: {
                          key: { type: 'string' },
                          label: { type: 'string' },
                          protocol: { type: 'string' },
                          hostname: { type: 'string', nullable: true },
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/command/execute': {
      post: {
        summary: 'Execute a command',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['command'],
                properties: {
                  command: { type: 'string' },
                  timeoutMs: { type: 'integer' },
                  directory: { type: 'string' },
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Execution complete',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['result'],
                  properties: {
                    result: { $ref: '#/components/schemas/ExecutionResult' },
                    aiAnalysis: { type: 'object' },
                  }
                }
              }
            }
          }
        }
      }
    },
    '/command/execute-code': {
      post: {
        summary: 'Execute code (e.g., python, bash)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['language','code'],
                properties: {
                  language: { type: 'string', enum: ['bash','python','python3'] },
                  code: { type: 'string' },
                  timeoutMs: { type: 'integer' },
                  directory: { type: 'string' },
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Execution complete',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['result'],
                  properties: {
                    result: { $ref: '#/components/schemas/ExecutionResult' },
                    aiAnalysis: { type: 'object' },
                  }
                }
              }
            }
          }
        }
      }
    },
    '/command/execute-file': {
      post: {
        summary: 'Execute a file present on the server/target',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['filename'],
                properties: {
                  filename: { type: 'string' },
                  directory: { type: 'string' },
                  timeoutMs: { type: 'integer' },
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Execution complete',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['result'],
                  properties: {
                    result: { $ref: '#/components/schemas/ExecutionResult' },
                    aiAnalysis: { type: 'object' },
                  }
                }
              }
            }
          }
        }
      }
    },
    '/command/execute-llm': {
      post: {
        summary: 'Run an LLM plan or direct instruction',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['instructions'],
                properties: {
                  instructions: { type: 'string' },
                  dryRun: { type: 'boolean' },
                  stream: { type: 'boolean' },
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Plan execution (or dry run)',
            content: { 'application/json': { schema: { type: 'object' } } }
          }
        }
      }
    }
  };

  const openapi = {
    openapi: '3.0.3',
    info: {
      title: 'gpt-terminal-plus API',
      version: '0.1.0',
      description: 'Dynamic OpenAPI surface for servers and command/code/LLM execution',
    },
    servers: [{ url: getPublicBaseUrl(), description: 'Public base URL' }],
    components,
    security: [{ bearerAuth: [] }],
    paths,
  };

  return openapi;
}

/** Register dynamic OpenAPI routes on the provided app. */
export function registerOpenApiRoutes(app: express.Application) {
  // JSON
  app.get('/openapi.json', (_req: Request, res: Response) => {
    const spec = buildOpenApiSpec(app);
    res.type('application/json').status(200).send(spec);
  });
  // YAML (two aliases)
  app.get('/openapi.yaml', (_req: Request, res: Response) => {
    const spec = buildOpenApiSpec(app);
    res.type('application/yaml').status(200).send(jsonToYaml(spec) + '\n');
  });
  app.get('/openai.yaml', (_req: Request, res: Response) => {
    const spec = buildOpenApiSpec(app);
    res.type('application/yaml').status(200).send(jsonToYaml(spec) + '\n');
  });
}
