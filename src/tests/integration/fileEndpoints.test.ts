import request from 'supertest';
import express from 'express';
import fileRoutes from '../../routes/fileRoutes';

jest.mock('../../middlewares/checkAuthToken', () => ({
  checkAuthToken: (req: any, res: any, next: any) => next()
}));

const app = express();
app.use(express.json());
app.use('/file', fileRoutes);

describe('File Endpoints Integration', () => {
  it('should list files and then read one of them', async () => {
    // 1. List files in the root directory
    const listRes = await request(app)
      .post('/file/list')
      .send({ directory: '/' });

    expect(listRes.status).toBe(200);
    expect(listRes.body.files.items.length).toBeGreaterThan(0);

    // 2. Find a file to read (e.g., package.json)
    const fileToRead = listRes.body.files.items.find((file: any) => file.name === 'package.json');
    expect(fileToRead).toBeDefined();

    // 3. Read the file
    const readRes = await request(app)
      .post('/file/read')
      .send({ filePath: fileToRead.name });

    expect(readRes.status).toBe(200);
    expect(readRes.body.data.content).toBeDefined();
    const packageJson = JSON.parse(readRes.body.data.content);
    expect(packageJson.name).toBe('gpt-terminal-plus');
  });

  it('should list files with pagination', async () => {
    // List all files to get a baseline
    const allFilesRes = await request(app)
      .post('/file/list')
      .send({ directory: '/', recursive: true });
    expect(allFilesRes.status).toBe(200);
    expect(allFilesRes.body.files.items).toBeDefined();
    const allFilesCount = allFilesRes.body.files.total;

    // Request first 5 files
    const firstPageRes = await request(app)
      .post('/file/list')
      .send({ directory: '/', limit: 5, offset: 0, orderBy: 'filename' });
    expect(firstPageRes.status).toBe(200);
    expect(firstPageRes.body.files.items.length).toBe(5);
    expect(firstPageRes.body.files.total).toBe(allFilesCount);
    expect(firstPageRes.body.files.limit).toBe(5);
    expect(firstPageRes.body.files.offset).toBe(0);

    // Request next 5 files
    const secondPageRes = await request(app)
      .post('/file/list')
      .send({ directory: '/', limit: 5, offset: 5, orderBy: 'filename' });
    expect(secondPageRes.status).toBe(200);
    expect(secondPageRes.body.files.items.length).toBe(5);
    expect(secondPageRes.body.files.total).toBe(allFilesCount);
    expect(secondPageRes.body.files.limit).toBe(5);
    expect(secondPageRes.body.files.offset).toBe(5);

    // Verify that the items are different and in order
    const firstPageNames = firstPageRes.body.files.items.map((f: any) => f.name);
    const secondPageNames = secondPageRes.body.files.items.map((f: any) => f.name);
    expect(firstPageNames[0]).not.toBe(secondPageNames[0]);
    expect(firstPageNames[0] < firstPageNames[1]).toBe(true);
    expect(secondPageNames[0] < secondPageNames[1]).toBe(true);
  });
});