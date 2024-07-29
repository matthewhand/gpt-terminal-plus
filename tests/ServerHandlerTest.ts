import { ServerHandler, PaginatedResponse } from '../src/handlers/ServerHandler';

class TestServerHandler extends ServerHandler {
    currentDirectory: string;

    constructor(serverConfig: { presentWorkingDirectory: string }) {
        super(serverConfig as ServerConfig);
        this.currentDirectory = serverConfig.presentWorkingDirectory;
    }

    async listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<PaginatedResponse<string>> {
        const items = [];
        return {
            items,
            totalPages: 1,
            responseId: 'local',
            stdout: 'list of files',
            stderr: '',
        };
    }

    async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
        return { stdout: , stderr: '' };
    }
}

const config: ServerConfig = {
    presentWorkingDirectory: '/initial',
    host: 'localhost',
    username: 'user',
    region: 'us-west-2',
    instanceId: 'i-1234567890abcdef0'
};

export { TestServerHandler, config }
