import request from 'supertest';
import express from 'express';
import serverRoutes from '../../src/routes/serverRoutes';
import config from 'config';
import { ServerHandler } from '../../src/handlers/ServerHandler';

// Mock the config and ServerHandler dependencies
jest.mock('config');
jest.mock('../../src/handlers/ServerHandler');

// Create a new express application for testing
const app = express();
app.use(express.json());
app.use(serverRoutes);

// Define your mock servers
const mockServers = [
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

// Mock ServerHandler instance
const mockServerHandler = {
  getSystemInfo: jest.fn(),
};

beforeEach(() => {
  // Reset the singleton instance before each test
  ServerHandler.resetInstance();

  // Clear all mock implementations
  jest.clearAllMocks();

  // Set up default mock implementations
  (ServerHandler.getInstance as jest.Mock).mockImplementation((server) => {
    const serverConfig = mockServers.find(s => s.host === server);
    if (!serverConfig) {
      return Promise.reject(new Error('Server not in predefined list.'));
    }
    return Promise.resolve(mockServerHandler);
  });

  (config.get as jest.Mock).mockImplementation((key) => {
    if (key === 'serverConfig') {
      return mockServers;
    }
    // Handle other keys or return a sensible default
    // ...
  });

  mockServerHandler.getSystemInfo.mockResolvedValue({ info: 'System Info' });
});
      
  it('should retrieve the mock serverConfig', () => {
    const serverConfig = config.get('serverConfig');
    expect(config.get).toHaveBeenCalledWith('serverConfig');
    expect(serverConfig).toEqual(mockServers);
  });

  // describe('GET /list-servers', () => {
  //   it('should return a list of servers', async () => {
  //     const response = await request(app).get('/list-servers');
  //     console.log(response.body); // Add this line to log the actual response
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toEqual({ servers: mockServers });
  //   });
  // });
  
  describe('POST /set-server', () => {
    it('should set the server if it exists in the list', async () => {
      const serverToSet = 'localhost';
      mockServerHandler.getSystemInfo.mockResolvedValue({ info: 'System Info' });

      const response = await request(app)
        .post('/set-server')
        .send({ server: serverToSet });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        output: `Server set to ${serverToSet}`,
        systemInfo: { info: 'System Info' },
      });
    });

    // it('should return an error if the server is not in the list', async () => {
    //   const serverToSet = 'user3@unknownhost';
    
    //   const response = await request(app)
    //     .post('/set-server')
    //     .send({ server: serverToSet });
    
    //   expect(response.statusCode).toBe(400);
    //   expect(response.body).toEqual({
    //     output: 'Server not in predefined list.',
    //   });
    // });
    
  
    // it('should handle errors when retrieving system info', async () => {
    //   mockServerHandler.getSystemInfo.mockRejectedValue(new Error('Error retrieving system info'));
    
    //   const response = await request(app).post('/set-server').send({ server: 'someServer' });
    
    //   expect(response.statusCode).toBe(400); // Corrected status code
    //   expect(response.body).toEqual({
    //     output: 'Error retrieving system info',
    //     error: expect.any(String),
    //   });
    // });
 });
