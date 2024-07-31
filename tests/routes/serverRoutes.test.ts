import request from 'supertest';
import express from 'express';
import serverRoutes from '../../src/routes/serverRoutes';
import { ServerHandler } from "../../src/handlers/ServerHandler"
import { ServerConfig } from '../../src/types/ServerConfig';
import { SystemInfo } from '../../src/types/SystemInfo';

// Define mock servers
const mockServers: ServerConfig[] = [
  {
    protocol: 'local',
    host: 'localhost',
    username: 'user',
    privateKeyPath: '/path/to/private/key',
  },
  {
    protocol: 'ssh',
    host: 'user2@remotehost',
    username: 'user2',
    privateKeyPath: '/path/to/user2/private/key',
  },
];

// Mock SystemInfo object
const mockSystemInfo: SystemInfo = {
  homeFolder: '/home/user',
  type: 'Linux',
  release: '5.4.0',
  platform: 'linux',
  architecture: 'x64',
  totalMemory: 8192,
  freeMemory: 4096,
  uptime: 10000,
  currentFolder: '/home/user',
};

// Mock ServerHandler and its methods
jest.mock('../../src/handlers/ServerHandler', () => {
  const actualServerHandler = jest.requireActual('../../src/handlers/ServerHandler');
  return {
    __esModule: true,
    ...actualServerHandler,
    ServerHandler: jest.fn().mockImplementation(() => ({
      getInstance: jest.fn().mockImplementation((host: string) => {
        const serverConfig = mockServers.find(server => server.host === host);
        if (!serverConfig) {
          return Promise.reject(new Error('Server not in predefined list.'));
        }
        // Mimic the behavior of getting system info for the server
        return Promise.resolve({
          getSystemInfo: jest.fn().mockResolvedValue(mockSystemInfo),
        });
      }),
    })),
  };
});

jest.mock('../../src/managers/ServerConfigManager', () => ({
  __esModule: true,
  ServerConfigManager: {
    getServerConfig: jest.fn((host: string) => {
      const serverConfig = mockServers.find(server => server.host === host);
      if (!serverConfig) {
        throw new Error('Server not in predefined list.');
      }
      return serverConfig;
    }),
    getInstance: jest.fn(async (host: string) => {
      const serverConfig = mockServers.find(server => server.host === host);
      if (!serverConfig) {
        throw new Error('Server not in predefined list.');
      }
      return {
        getSystemInfo: jest.fn().mockResolvedValue(mockSystemInfo),
      };
    }),
  },
}));

describe('Server Routes', () => {
  const app = express();
  app.use(express.json());
  app.use(serverRoutes);

  describe('POST /set-server', () => {
    it('should return an error if the server is not in the list', async () => {
      const serverToSet = 'user3@unknownhost';

      const response = await request(app)
        .post('/set-server')
        .send({ server: serverToSet });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error retrieving system info for server: ' + serverToSet,
        error: 'Server not in predefined list.',
      });
    });
  });
});
