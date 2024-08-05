import request from 'supertest';
import express from 'express';
import { createFile } from '../../../../src/handlers/local/actions/createFile';
import Debug from 'debug';

jest.mock('fs');
jest.mock('path');
jest.mock('../../../../src/utils/GlobalStateHelper');

// Mocked dependencies
import fs from 'fs';
import path from 'path';
import { presentWorkingDirectory } from '../../../../src/utils/GlobalStateHelper';

// Create mock implementations for fs.promises methods
const writeFileMock = jest.fn();
const copyFileMock = jest.fn();
(fs.promises as any) = { writeFile: writeFileMock, copyFile: copyFileMock };
(fs.existsSync as jest.Mock) = jest.fn();

// Enable debug logging for the test run
const debug = Debug('app:createFile');
debug.enabled = true;

// Create an Express app for testing
const app = express();
app.use(express.json());

// Define the route
app.post('/file/create', async (req, res) => {
  console.log('Received parameters:', req.body); // Log the request body
  try {
    const { filePath, content, backup } = req.body;
    await createFile(filePath, content, backup);
    res.status(200).send({ success: true });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).send({ error: errorMessage });
  }
});

describe('POST /file/create', () => {
  const filePath = 'test.txt';
  const content = 'Hello, World!';
  const fullPath = path.join(process.env.NODE_CONFIG_DIR || '/mocked/path', filePath);

  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockReturnValue(fullPath);
    (presentWorkingDirectory as jest.Mock).mockReturnValue('/mocked/path');
  });

  it('should create a file with the given content', async () => {
    writeFileMock.mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post('/file/create')
      .send({ filePath, content, backup: false })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(writeFileMock).toHaveBeenCalledWith(fullPath, content);
  });

  it('should back up the existing file before creating a new one', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    copyFileMock.mockResolvedValueOnce(undefined);
    writeFileMock.mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post('/file/create')
      .send({ filePath, content, backup: true })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(copyFileMock).toHaveBeenCalledWith(fullPath, fullPath + '.bak');
    expect(writeFileMock).toHaveBeenCalledWith(fullPath, content);
  });

  it('should throw an error if the file path is invalid', async () => {
    const response = await request(app)
      .post('/file/create')
      .send({ filePath: '', content, backup: false })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('File path must be provided and must be a string.');
  });

  it('should throw an error if the content is invalid', async () => {
    const response = await request(app)
      .post('/file/create')
      .send({ filePath, content: '', backup: false })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Content must be provided and must be a string.');
  });

  it('should handle file creation errors gracefully', async () => {
    writeFileMock.mockRejectedValueOnce(new Error('Write error'));

    const response = await request(app)
      .post('/file/create')
      .send({ filePath, content, backup: false })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to create file ' + fullPath + ': Write error');
  });
});
