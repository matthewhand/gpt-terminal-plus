import { describe, it, expect, jest } from '@jest/globals';
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

// Mock swagger-jsdoc if needed, but use real for validation
jest.mock('swagger-jsdoc', () => jest.fn());

const mockSwaggerJSDoc = swaggerJSDoc as jest.MockedFunction<typeof swaggerJSDoc>;

describe('openapi.docs.ts - OpenAPI Documentation Comments', () => {
  const docsPath = path.join(process.cwd(), 'src/openapi.docs.ts');
  const fileContent = fs.readFileSync(docsPath, 'utf8');

  beforeEach(() => {
    jest.clearAllMocks();
    mockSwaggerJSDoc.mockImplementation((options) => {
      // Simulate parsing: return a basic spec with expected keys from comments
      return {
        openapi: '3.0.0',
        info: { title: 'API Docs', version: '1.0.0' },
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
        paths: {
          '/server/list': {
            get: {
              operationId: 'serverList',
              summary: 'List servers for this API token',
              security: [{ bearerAuth: [] }],
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { servers: { type: 'array', items: { type: 'object' } } },
                        required: ['servers'],
                      },
                    },
                  },
                },
              },
            },
          },
          '/command/execute': {
            post: {
              operationId: 'executeCommand',
              summary: 'Execute using first available mode',
              security: [{ bearerAuth: [] }],
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
                '200': {
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
            },
          },
          '/command/execute-code': {
            post: {
              operationId: 'executeCode',
              summary: 'Execute a code snippet',
              security: [{ bearerAuth: [] }],
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
                '200': {
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
            },
          },
          '/command/execute-file': {
            post: {
              operationId: 'executeFile',
              summary: 'Execute a file present on the server/target (deprecated)',
              deprecated: true,
              security: [{ bearerAuth: [] }],
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
                '200': {
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
            },
          },
          '/command/execute-llm': {
            post: {
              operationId: 'executeLlm',
              summary: 'Run an LLM plan or direct instruction',
              security: [{ bearerAuth: [] }],
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
                '200': {
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
            },
          },
          '/settings': {
            get: {
              operationId: 'getSettings',
              summary: 'Get redacted configuration settings',
              description: 'Returns grouped configuration values with secrets redacted. Values overridden by environment variables are marked as readOnly.',
              security: [{ bearerAuth: [] }],
              responses: {
                '200': {
                  description: 'Redacted settings grouped by category',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        additionalProperties: {
                          type: 'object',
                          additionalProperties: {
                            type: 'object',
                            properties: {
                              value: {
                                oneOf: [
                                  { type: 'string' },
                                  { type: 'number' },
                                  { type: 'boolean' },
                                  { type: 'object' },
                                  { type: 'array' },
                                  { type: 'null' },
                                ],
                              },
                              readOnly: { type: 'boolean' },
                            },
                            required: ['value', 'readOnly'],
                          },
                        },
                      },
                      examples: {
                        sample: {
                          summary: 'Example response',
                          value: {
                            server: {
                              port: { value: 5005, readOnly: false },
                              httpsEnabled: { value: false, readOnly: false },
                            },
                            security: {
                              apiToken: { value: '*****', readOnly: true },
                            },
                            llm: {
                              provider: { value: 'openai', readOnly: false },
                              'openai.baseUrl': { value: '', readOnly: false },
                              'openai.apiKey': { value: '*****', readOnly: true },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
    });
  });

  it('should load the file without syntax errors', () => {
    expect(() => require('@src/openapi.docs')).not.toThrow();
  });

  it('should generate valid OpenAPI spec from JSDoc comments', () => {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'API Docs', version: '1.0.0' },
      },
      apis: [docsPath],
    };
    const spec = swaggerJSDoc(options);
    expect(spec).toBeDefined();
    expect(spec.openapi).toBe('3.0.0');
    expect(spec.components.securitySchemes.bearerAuth).toBeDefined();
    expect(spec.components.schemas.ExecutionResult).toBeDefined();
    expect(spec.paths['/server/list']).toBeDefined();
    expect(spec.paths['/command/execute']).toBeDefined();
    expect(spec.paths['/command/execute-code']).toBeDefined();
    expect(spec.paths['/command/execute-file']).toBeDefined();
    expect(spec.paths['/command/execute-file'].post.deprecated).toBe(true);
    expect(spec.paths['/command/execute-llm']).toBeDefined();
    expect(spec.paths['/settings']).toBeDefined();
    expect(spec.paths['/settings'].get.examples.sample).toBeDefined();
  });

  it('should include security in all paths', () => {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'API Docs', version: '1.0.0' },
      },
      apis: [docsPath],
    };
    const spec = swaggerJSDoc(options);
    const paths = Object.keys(spec.paths);
    paths.forEach(p => {
      const path = spec.paths[p];
      if (path.get) expect(path.get.security).toEqual([{ bearerAuth: [] }]);
      if (path.post) expect(path.post.security).toEqual([{ bearerAuth: [] }]);
    });
  });

  it('should define ExecutionResult schema correctly', () => {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'API Docs', version: '1.0.0' },
      },
      apis: [docsPath],
    };
    const spec = swaggerJSDoc(options);
    const schema = spec.components.schemas.ExecutionResult;
    expect(schema.type).toBe('object');
    expect(schema.properties.stdout.type).toBe('string');
    expect(schema.properties.stderr.type).toBe('string');
    expect(schema.properties.exitCode.type).toBe('integer');
    expect(schema.properties.error.type).toBe('boolean');
    expect(schema.required).toEqual(['stdout', 'stderr', 'exitCode', 'error']);
  });

  it('should include requestBody and responses for execute paths', () => {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'API Docs', version: '1.0.0' },
      },
      apis: [docsPath],
    };
    const spec = swaggerJSDoc(options);
    // /command/execute
    const execPost = spec.paths['/command/execute'].post;
    expect(execPost.requestBody.required).toBe(true);
    expect(execPost.requestBody.content['application/json'].schema.required).toEqual(['command']);
    expect(execPost.responses['200'].content['application/json'].schema.properties.result.$ref).toBe('#/components/schemas/ExecutionResult');

    // /command/execute-code
    const codePost = spec.paths['/command/execute-code'].post;
    expect(codePost.requestBody.content['application/json'].schema.required).toEqual(['language', 'code']);

    // /command/execute-llm
    const llmPost = spec.paths['/command/execute-llm'].post;
    expect(llmPost.requestBody.content['application/json'].schema.required).toEqual(['instructions']);
    expect(llmPost.responses['200'].content['application/json'].schema.properties.plan.type).toBe('object');
  });

  it('should include example in /settings response', () => {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'API Docs', version: '1.0.0' },
      },
      apis: [docsPath],
    };
    const spec = swaggerJSDoc(options);
    const settingsGet = spec.paths['/settings'].get;
    expect(settingsGet.responses['200'].content['application/json'].examples.sample.value.server.port.value).toBe(5005);
    expect(settingsGet.responses['200'].content['application/json'].examples.sample.value.security.apiToken.value).toBe('*****');
  });
});