import express from 'express';
import { changeDirectory } from './command/changeDirectory';
import { executeCommand } from './command/executeCommand';

const router = express.Router();

/**
 * Router for command-related operations.
 * 
 * This router handles changing directories and executing commands.
 */

/**
 * Route to change the working directory on the server.
 * @route POST /command/change-directory
 * @access Public
 * @param {string} directory - The directory to change to.
 */
router.post('/change-directory', (req, res) => {
  console.debug('Request received for /command/change-directory with body:', req.body);
  changeDirectory(req, res);
});

/**
 * Route to execute a command on the server.
 * @route POST /command/execute
 * @access Public
 * @param {string} command - The command to execute.
 */
router.post('/execute', (req, res) => {
  console.debug('Request received for /command/execute with body:', req.body);
  executeCommand(req, res);
});

export default router;

// OpenAPI Specification
const openAPISpec = `
openapi: 3.1.0
info:
  title: Command Routes API
  version: 1.0.0
paths:
  /command/change-directory:
    post:
      summary: Change the working directory on the server
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                directory:
                  type: string
              required:
                - directory
      responses:
        '200':
          description: Directory changed successfully
  /command/execute:
    post:
      summary: Execute a command on the server
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                command:
                  type: string
              required:
                - command
      responses:
        '200':
          description: Command executed successfully
`;

console.debug('OpenAPI Specification:', openAPISpec);
