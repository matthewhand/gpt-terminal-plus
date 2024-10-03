import express from 'express';
import request from 'supertest';
import fileRoutes from '../../src/routes/fileRoutes';
import * as createFileHandler from '../../src/routes/file/createFile';
import * as updateFileHandler from '../../src/routes/file/updateFile';
import * as amendFileHandler from '../../src/routes/file/amendFile';
import * as listFilesHandler from '../../src/routes/file/listFiles';
import fs from 'fs';

jest.mock('../../src/routes/file/createFile');
jest.mock('../../src/routes/file/updateFile');
jest.mock('../../src/routes/file/amendFile');
jest.mock('../../src/routes/file/listFiles');

const app = express();
app.use(express.json());
app.use('/file', fileRoutes);

// Mock fs functions for directory checks
jest.spyOn(fs, 'existsSync').mockImplementation((dir) => false);
jest.spyOn(fs, 'mkdirSync').mockImplementation((dir, options) => {});

describe('fileRoutes', () => {
  it('should create directory and call createFile handler on POST /file/create', async () => {
    const mockCreateFile = jest.spyOn(createFileHandler, 'createFile').mockImplementation((req, res) => {
      res.status(200).send({ message: 'File created successfully.' });
      return Promise.resolve(res as any);
    });

    const response = await request(app)
      .post('/file/create')
      .send({ directory: 'test', filename: 'test.txt', content: 'Hello, world!' });

    expect(fs.existsSync).toHaveBeenCalledWith('test');
    expect(fs.mkdirSync).toHaveBeenCalledWith('test', { recursive: true });
    expect(mockCreateFile).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File created successfully.');
  });

  it('should create directory and call updateFile handler on POST /file/update', async () => {
    const mockUpdateFile = jest.spyOn(updateFileHandler, 'updateFile').mockImplementation((req, res) => {
      res.status(200).send({ message: 'File updated successfully.' });
      return Promise.resolve(res as any);
    });

    const response = await request(app)
      .post('/file/update')
      .send({ directory: 'test', filename: 'test.txt', pattern: 'Hello', replacement: 'Hi' });

    expect(fs.existsSync).toHaveBeenCalledWith('test');
    expect(fs.mkdirSync).toHaveBeenCalledWith('test', { recursive: true });
    expect(mockUpdateFile).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File updated successfully.');
  });

  it('should create directory and call amendFile handler on POST /file/amend', async () => {
    const mockAmendFile = jest.spyOn(amendFileHandler, 'amendFile').mockImplementation((req, res) => {
      res.status(200).send({ message: 'File amended successfully.' });
      return Promise.resolve(res as any);
    });

    const response = await request(app)
      .post('/file/amend')
      .send({ directory: 'test', filename: 'test.txt', content: 'Appended text' });

    expect(fs.existsSync).toHaveBeenCalledWith('test');
    expect(fs.mkdirSync).toHaveBeenCalledWith('test', { recursive: true });
    expect(mockAmendFile).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File amended successfully.');
  });

  it('should call listFiles handler on POST /file/list', async () => {
    const mockListFiles = jest.spyOn(listFilesHandler, 'listFiles').mockImplementation((req, res) => {
      res.status(200).send({ files: [], total: 0 });
      return Promise.resolve(res as any);
    });

    const response = await request(app)
      .post('/file/list')
      .send({ directory: 'test' });

    expect(mockListFiles).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ files: [], total: 0 });
  });
});
