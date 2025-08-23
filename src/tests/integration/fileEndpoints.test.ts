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
        console.log(listRes.body.files.items);
    const fileToRead = listRes.body.files.items.find((file: any) => file.name === 'package.json');
    expect(fileToRead).toBeDefined();

    // 3. Read the file
    const readRes = await request(app)
      .post('/file/read')
      .send({ filePath: fileToRead.name });

    expect(readRes.status).toBe(200);
    expect(readRes.body.content).toBeDefined();
    const packageJson = JSON.parse(readRes.body.content);
    expect(packageJson.name).toBe('gpt-terminal-plus');
  });
});
