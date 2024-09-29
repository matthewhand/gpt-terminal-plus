"use strict";
/**
 * @fileoverview Tests for the ServerManager class.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ServerManager_1 = __importDefault(require("@src/managers/ServerManager"));
const config_1 = __importDefault(require("config")); // Assuming you're using the 'config' package
describe('ServerManager', () => {
    it('should retrieve the correct config for a local server by hostname', () => {
        const localConfig = {
            host: 'teamstinky',
            protocol: 'local',
            // ... other local config properties
        };
        const serverConfig = ServerManager_1.default.getServerConfig('localhost');
        // Adjust expectation based on actual serverConfig structure
        (0, chai_1.expect)(serverConfig).to.include({
            host: 'teamstinky',
            protocol: 'local',
        });
        // Assert additional properties if necessary
        (0, chai_1.expect)(serverConfig).toHaveProperty('code', false);
        (0, chai_1.expect)(serverConfig).toHaveProperty('hostname', 'localhost');
    });
    it('should retrieve the correct config for an SSH server by hostname', () => {
        const sshConfig = config_1.default.get('ssh.hosts')[0];
        const serverConfig = ServerManager_1.default.getServerConfig('ssh-bash.example.com');
        // Adjust expectation based on actual serverConfig structure
        (0, chai_1.expect)(serverConfig).to.include({
            hostname: 'worker1',
            port: 22,
            privateKeyPath: '/home/chatgpt/.ssh/id_rsa',
            protocol: 'ssh',
            username: 'chatgpt',
        });
        // Assert additional properties if necessary
        (0, chai_1.expect)(serverConfig).toHaveProperty('code', false);
        (0, chai_1.expect)(serverConfig).toHaveProperty('hostname', 'localhost');
        (0, chai_1.expect)(serverConfig).toHaveProperty('protocol', 'local');
    });
});
