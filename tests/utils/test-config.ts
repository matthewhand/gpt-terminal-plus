import { ServerConfig } from '../src/types';

export const testServerConfig: ServerConfig = {
    host: 'worker1',
    username: 'chatgpt',
    privateKeyPath: '/home/chatgpt/.ssh/id_rsa',
};

export const testServerConfig2: ServerConfig = {
    host: 'worker2',
    username: 'chatgpt',
    privateKeyPath: '/home/chatgpt/.ssh/id_rsa',
};

export const isTestEnvironment = () => {
    return process.env.TEST_ENV === 'true';
};
