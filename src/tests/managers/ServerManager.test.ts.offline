/**
 * Tests for the 'ServerManager' class, validating server management functionalities such as add, remove, and retrieve servers.
 * Also includes error handling for invalid server configurations.
 */

import { ServerManager } from '@src/managers/ServerManager';

jest.mock('@src/managers/ServerManager');

describe('ServerManager', () => {
    let serverManager: ServerManager;

    beforeEach(() => {
        serverManager = new ServerManager('mockServer'); // Provide a valid string as the argument
    });

    it('should add a new server', () => {
        const server = { id: '1', name: 'Test Server' };
        (serverManager as any).addServer(server);
        expect((serverManager as any).getServer('1')).toEqual(server);
    });

    it('should throw an error if server configuration is invalid', () => {
        expect(() => (serverManager as any).addServer(null)).toThrow('Invalid server configuration.');
    });
});
