import express from 'express';
import { changeDirectory } from './command/changeDirectory';
import { executeCommand } from './command/executeCommand';
import { executeCode } from './command/executeCode';
import { executeFile } from './command/executeFile'; 

const router = express.Router();

/**
 * Router for command-related operations.
 * 
 * This router handles changing directories, executing commands, executing code, and executing files.
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

/**
 * Route to execute code on the server.
 * @route POST /command/execute-code
 * @access Public
 * @param {string} code - The code to execute.
 * @param {string} language - The programming language of the code.
 */
router.post('/execute-code', (req, res) => {
  console.debug('Request received for /command/execute-code with body:', req.body);
  executeCode(req, res);
});

/**
 * Route to execute a file on the server.
 * @route POST /command/execute-file
 * @access Public
 * @param {string} filename - The name of the file to execute.
 * @param {string} [directory] - The directory where the file is located (optional).
 */
router.post('/execute-file', (req, res) => {
  console.debug('Request received for /command/execute-file with body:', req.body);
  executeFile(req, res);
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
      operationId: changeDirectory
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
      operationId: executeCommand
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
                shell:
                  type: string
                  enum: 
                    - powershell
                    - bash
              required:
                - command
                - shell
      responses:
        '200':
          description: Command executed successfully
  /command/execute-code:
    post:
      operationId: executeCode
      summary: Execute code on the server
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                code:
                  type: string
                language:
                  type: string
                  enum: 
                    - python
                    - typescript
              required:
                - code
                - language
      responses:
        '200':
          description: Code executed successfully
  /command/execute-file:
    post:
      operationId: executeFile
      summary: Execute a file on the server
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                filename:
                  type: string
                directory:
                  type: string
              required:
                - filename
      responses:
        '200':
          description: File executed successfully
`;

console.debug('OpenAPI Specification:', openAPISpec);
