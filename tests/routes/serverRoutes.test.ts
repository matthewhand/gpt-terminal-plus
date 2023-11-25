import request from 'supertest';
import express from 'express';
import serverRoutes from '../../src/routes/serverRoutes';
import { ServerHandler } from '../../src/handlers/ServerHandler';

// Define your mock servers as a JSON object
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

// Mock the ServerHandler dependencies
jest.mock('../../src/handlers/ServerHandler');

// Create a new express application for testing
const app = express();
app.use(express.json());
app.use(serverRoutes);

// Mock ServerHandler instance
const mockServerHandler = {
  getSystemInfo: jest.fn(),
  listAvailableServers: jest.fn(),
};

beforeEach(() => {
  // Reset the singleton instance before each test
  ServerHandler.resetInstance();

  // Clear all mock implementations
  jest.clearAllMocks();

  // Load the mock servers into the ServerHandler directly
  ServerHandler.loadServers(mockServers);

  // Set up default mock implementations
  (ServerHandler.getInstance as jest.Mock).mockImplementation(() => mockServerHandler);
  mockServerHandler.listAvailableServers.mockResolvedValue(mockServers);
  mockServerHandler.getSystemInfo.mockResolvedValue({ info: 'System Info' });
});

// describe('GET /list-servers', () => {
//   it('should return a list of servers', done => { // Use the done callback
//     request(app).get('/list-servers').then(response => {
//       expect(response.statusCode).toBe(200);
//       expect(response.body).toEqual({ servers: mockServers });
//       done(); // Call done when the assertions are complete
//     }).catch(e => done(e)); // Pass any errors to done to fail the test
//   });
// });

// describe('GET /list-servers', () => {
//   it('should return a list of servers', async () => {
//     const response = await request(app).get('/list-servers');
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toEqual({ servers: mockServers });
//   });
// });

describe('POST /set-server', () => {
  it('should set the server if it exists in the list', async () => {
    const serverToSet = 'localhost';
    const response = await request(app)
      .post('/set-server')
      .send({ server: serverToSet });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      output: `Server set to ${serverToSet}`,
      systemInfo: { info: 'System Info' },
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
    expect(response.body).toEqual({
      output: 'Error retrieving system info',
      error: 'Error retrieving system info',
    });
  });
});
