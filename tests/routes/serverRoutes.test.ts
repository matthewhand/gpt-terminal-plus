import request from 'supertest';
import express from 'express';
import serverRoutes from '../../src/routes/serverRoutes';
import { ServerHandler } from '../../src/handlers/ServerHandler';
import { SystemInfo, ServerConfig } from '../../src/types';

// Define your mock servers as a JSON object
const mockServers: ServerConfig[] = [
  {
    host: 'localhost',
    code: true,
    posix: false,
  },
  {
    host: 'user2@remotehost',
    code: true,
    posix: false,
  },
];

// Mock SystemInfo object based on your actual implementation
const mockSystemInfo: SystemInfo = {
  homeFolder: '/home/user',
  type: 'Linux',
  release: '5.4.0',
  platform: 'linux',
  architecture: 'x64',
  pythonVersion: '3.8.5',
  powershellVersion: '7.0',
  totalMemory: 8192,
  freeMemory: 4096,
  uptime: 10000,
  currentFolder: '/home/user',
};

// Create a new express application for testing
const app = express();
app.use(express.json());
app.use(serverRoutes);

// Mock ServerHandler and its methods
jest.mock('../../src/handlers/ServerHandler', () => {
  const originalModule = jest.requireActual('../../src/handlers/ServerHandler');
  return {
    ServerHandler: jest.fn().mockImplementation(() => ({
      ...originalModule,
      getSystemInfo: jest.fn().mockReturnValue(Promise.resolve(mockSystemInfo)),
      // Include listAvailableServers if it exists on ServerHandler
      // listAvailableServers: jest.fn(),
      // ... other methods as needed ...
    }))
  };
});

let mockServerHandler: jest.Mocked<ServerHandler>;

beforeEach(() => {
  // Clear all mock implementations and set up new ones for each test
  jest.clearAllMocks();

  // Create a mocked instance of ServerHandler
  mockServerHandler = new (ServerHandler as any)() as jest.Mocked<ServerHandler>;
  
  // Set up default mock implementations
  ServerHandler.getInstance = jest.fn().mockImplementation(() => mockServerHandler);
});

// Define your tests
describe('POST /set-server', () => {
  it('should set the server if it exists in the list', async () => {
    const serverToSet = 'localhost';
    const response = await request(app)
      .post('/set-server')
      .send({ server: serverToSet });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      output: `Server set to ${serverToSet}`,
      systemInfo: mockSystemInfo,
    });
  });

  it('should return an error if the server is not in the list', async () => {
    const serverToSet = 'user3@unknownhost';
    mockServerHandler.getSystemInfo.mockRejectedValue(new Error('Server not in predefined list.'));
    
    const response = await request(app)
      .post('/set-server')
      .send({ server: serverToSet });
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      output: 'Server not in predefined list.',
    });
  });
  
  it('should handle errors when retrieving system info', async () => {
    const serverToSet = 'localhost';
    mockServerHandler.getSystemInfo.mockRejectedValue(new Error('Error retrieving system info'));
    
    const response = await request(app)
      .post('/set-server')
      .send({ server: serverToSet });
    
    expect(response.statusCode).toBe(500);
    expect(response.body.output).toEqual('Error retrieving system info');
    expect(response.body.error).toEqual('Error retrieving system info');
    // Optionally, check if 'stack' is present, but do not compare its content
    expect(response.body).toHaveProperty('stack');
  });
});
