import { expect } from 'chai';
import ServerHandler from '../src/handlers/ServerHandler';

class TestServerHandler extends ServerHandler {
  async listFiles(directory: string, limit: number, offset: number, orderBy: string): Promise<{ items: string[], totalPages: number, responseId: string }> {
    return { items: [], totalPages: 1, responseId: 'test' };
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
    return true;
  }
}

describe('ServerHandler', () => {
  let handler: TestServerHandler;

  beforeEach(() => {
    handler = new TestServerHandler();
  });

  it('should set and get the default directory', async () => {
    await handler.setDefaultDirectory('/test/dir');
    const defaultDirectory = await handler.getDefaultDirectory();
    expect(defaultDirectory).to.equal('/test/dir');
  });

  it('should use default directory if no directory is provided', async () => {
    await handler.setDefaultDirectory('/test/dir');
    const listFilesResult = await handler.listFiles(undefined, 10, 0, 'name');
    expect(listFilesResult).to.deep.equal({ items: [], totalPages: 1, responseId: 'test' });

    const createFileResult = await handler.createFile(undefined, 'test.txt', 'content', true);
    expect(createFileResult).to.be.true;
  });
});
