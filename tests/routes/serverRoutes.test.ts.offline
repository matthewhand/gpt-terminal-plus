import request from 'supertest';
import express from 'express';
import serverRoutes from '../../src/routes/serverRoutes';
import { ServerHandler } from '../../src/handlers/ServerHandler';
import { SystemInfo, ServerConfig } from '../../src/types';

// Define mock servers
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

// Mock SystemInfo object
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

// Create an express application for testing
const app = express();
app.use(express.json());
app.use(serverRoutes);

// Mock ServerHandler and its methods
jest.mock('../../src/handlers/ServerHandler', () => {
  return {
    __esModule: true, // This property is necessary for ES Modules compatibility
    ServerHandler: {
      getInstance: jest.fn((server) => {
        // Mock behavior based on server input
        if (server === 'localhost') {
          return Promise.resolve({
            getSystemInfo: jest.fn().mockResolvedValue(mockSystemInfo),
          });
        }
        return Promise.reject(new Error('Server not in predefined list.'));
      }),
      // Other static methods can be mocked here if necessary
    },
  };
});

describe('POST /set-server', () => {
  it('should set the server if it exists in the list', async () => {
    const serverToSet = 'localhost';
    const response = await request(app).post('/set-server').send({ server: serverToSet });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      output: `Server set to ${serverToSet}`,
      systemInfo: mockSystemInfo,
    });
  });

  it('should return an error if the server is not in the list', async () => {
    const serverToSet = 'user3@unknownhost';
    const response = await request(app).post('/set-server').send({ server: serverToSet });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      output: 'Server not in predefined list.',
    });
  });

// In your tests, particularly for handling errors, adjust like so:
it('should handle errors when retrieving system info', async () => {
  const serverToSet = 'localhost';
  // Correctly mock getInstance for a specific case
  ServerHandler.getInstance.mockImplementationOnce(() => Promise.resolve({
    getSystemInfo: jest.fn().mockRejectedValue(new Error('Error retrieving system info')),
  }));

  const response = await request(app).post('/set-server').send({ server: serverToSet });

  // Now expect a 500 error as mocked
  expect(response.statusCode).toBe(500);
  expect(response.body).toHaveProperty('error', 'Error retrieving system info');
  // If checking for 'stack', ensure your application logic actually includes it in the response
});
});
