#!/usr/bin/env node

const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3100;
const apiToken = process.env.API_TOKEN || 'euwSwBXH2oq9tTyRvh51iE2XqKis2NvNdkEsUcHXq9TBW44NqTwOshtg47Aef29t';

app.use(express.json());

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// OpenAPI spec
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'GPT Terminal Plus',
    version: '1.0.0',
    description: 'Terminal command execution API'
  },
  paths: {
    '/command/execute-shell': {
      post: {
        summary: 'Execute shell command',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  command: { type: 'string' }
                },
                required: ['command']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Command executed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stdout: { type: 'string' },
                    stderr: { type: 'string' },
                    exitCode: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

app.get('/openapi.json', (req, res) => {
  res.json(openApiSpec);
});

app.post('/command/execute-shell', authenticate, (req, res) => {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  const child = spawn('bash', ['-c', command], {
    timeout: 30000,
    stdio: 'pipe'
  });

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  child.on('close', (code) => {
    res.json({
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exitCode: code
    });
  });

  child.on('error', (error) => {
    res.status(500).json({
      error: error.message,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exitCode: -1
    });
  });
});

app.listen(port, () => {
  console.log(`GPT Terminal Plus API running on port ${port}`);
});
