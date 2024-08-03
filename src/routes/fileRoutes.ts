import express from 'express';
import { createFile } from './file/createFile';
import { updateFile } from './file/updateFile';
import { amendFile } from './file/amendFile';
import { listFiles } from './file/listFiles';

const router = express.Router();

/**
 * Main router for file-related operations.
 * 
 * This router handles file creation, updating, amending, and listing.
 */

/**
 * Route to create or replace a file.
 * @route POST /file/create
 * @access Public
 * @param {string} directory - The target directory for the file.
 * @param {string} filename - The name of the file to create or replace.
 * @param {string} content - The content to write to the file.
 * @param {boolean} [backup=true] - Whether to back up the existing file before replacing.
 */
router.post('/create', (req, res) => {
  console.debug('Request received for /file/create with body:', req.body);
  createFile(req, res);
});

/**
 * Route to update a file by replacing a pattern with a replacement.
 * @route POST /file/update
 * @access Public
 * @param {string} directory - The target directory for the file.
 * @param {string} filename - The name of the file to update.
 * @param {string} pattern - The text pattern to replace.
 * @param {string} replacement - The new text to replace the pattern.
 * @param {boolean} [backup=true] - Whether to back up the file before updating.
 */
router.post('/update', (req, res) => {
  console.debug('Request received for /file/update with body:', req.body);
  updateFile(req, res);
});

/**
 * Route to amend a file by appending content to it.
 * @route POST /file/amend
 * @access Public
 * @param {string} directory - The target directory for the file.
 * @param {string} filename - The name of the file to amend.
 * @param {string} content - The content to append to the file.
 * @param {boolean} [backup=true] - Whether to back up the file before amending.
 */
router.post('/amend', (req, res) => {
  console.debug('Request received for /file/amend with body:', req.body);
  amendFile(req, res);
});

/**
 * Route to list files in a directory.
 * @route POST /file/list
 * @access Public
 * @param {string} directory - The directory to list files from.
 * @param {number} [limit] - The maximum number of files to return.
 * @param {number} [offset] - The offset for file listing, used for pagination.
 * @param {'datetime' | 'filename'} [orderBy] - The criteria to order the files by.
 */
router.post('/list', (req, res) => {
  console.debug('Request received for /file/list with body:', req.body);
  listFiles(req, res);
});

export default router;

// OpenAPI Specification
const openAPISpec = `
openapi: 3.1.0
info:
  title: File Routes API
  version: 1.0.0
paths:
  /file/create:
    post:
      summary: Create or replace a file
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                directory:
                  type: string
                filename:
                  type: string
                content:
                  type: string
                backup:
                  type: boolean
              required:
                - filename
                - content
      responses:
        '200':
          description: File created or replaced successfully
  /file/update:
    post:
      summary: Update a file by replacing a pattern with a replacement
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                directory:
                  type: string
                filename:
                  type: string
                pattern:
                  type: string
                replacement:
                  type: string
                backup:
                  type: boolean
                multiline:
                  type: boolean
              required:
                - filename
                - pattern
                - replacement
      responses:
        '200':
          description: File updated successfully
  /file/amend:
    post:
      summary: Amend a file by appending content to it
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                directory:
                  type: string
                filename:
                  type: string
                content:
                  type: string
                backup:
                  type: boolean
              required:
                - filename
                - content
      responses:
        '200':
          description: File amended successfully
  /file/list:
    post:
      summary: List files in a directory
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                directory:
                  type: string
                limit:
                  type: integer
                offset:
                  type: integer
                orderBy:
                  type: string
                  enum:
                    - datetime
                    - filename
              required:
                - directory
      responses:
        '200':
          description: Files listed successfully
`;

// Output OpenAPI spec to console at startup
console.debug('OpenAPI Specification:', openAPISpec);
