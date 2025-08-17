export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'GPT Terminal Plus API',
    version: '0.1.0',
    description: 'Execute shell, run code, and call LLMs on configured targets.',
  },
  servers: [{ url: '' }],
  paths: {
    '/command/execute': {
      post: { summary: 'Execute shell command', responses: { '200': { description: 'OK' } } }
    },
    '/command/execute-code': {
      post: { summary: 'Execute code in a given language', responses: { '200': { description: 'OK' } } }
    },
    '/server/list': {
      get: { summary: 'List servers available to the caller (auth-scoped)', responses: { '200': { description: 'OK' } } }
    }
  }
};
