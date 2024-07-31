import { TestServerHandler } from '../src/handlers/TestServerHandler';
import { PaginatedResponse } from '../src/types/PaginatedResponse';
import { SystemInfo } from '../src/types/SystemInfo';

describe('TestServerHandler', () => {
  let handler: TestServerHandler;

  beforeEach(() => {
    handler = new TestServerHandler();
  });

  it('should execute a command and return simulated output', async () => {
    const command = 'ls';
    const result = await handler.executeCommand(command);

    expect(result.stdout).toBe('Simulated output for: ' + command);
    expect(result.stderr).toBe('');
  });

  it('should create a file successfully', async () => {
    const directory = '/tmp';
    const filename = 'test.txt';
    const result = await handler.createFile(directory, filename);

    expect(result).toBe(true);
  });

  it('should update a file successfully', async () => {
    const filePath = '/tmp/test.txt';
    const result = await handler.updateFile(filePath);

    expect(result).toBe(true);
  });

  it('should amend a file successfully', async () => {
    const filePath = '/tmp/test.txt';
    const result = await handler.amendFile(filePath);

    expect(result).toBe(true);
  });

  it('should list files in a directory', async () => {
    const directory = '/tmp';
    const limit = 5;
    const result: PaginatedResponse<string> = await handler.listFiles(directory, limit);

    expect(result.items.length).toBe(limit);
    expect(result.items[0]).toBe('file0.txt');
  });

  it('should retrieve system information', async () => {
    const result: SystemInfo = await handler.getSystemInfo();

    expect(result.osType).toBe('Linux');
    expect(result.platform).toBe('x64');
    expect(result.freeMemory).toBe(1024);
    expect(result.totalMemory).toBe(2048);
  });
});
