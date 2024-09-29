"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ssh2_1 = require("ssh2");
const executeCommand_1 = require("../../../../src/handlers/ssh/actions/executeCommand");
const escapeSpecialChars_1 = require("../../../../src/common/escapeSpecialChars");
jest.mock('ssh2');
jest.mock('../../../../src/common/escapeSpecialChars');
describe('executeCommand', () => {
    let sshClient;
    let mockExec;
    let sshConfig;
    beforeEach(() => {
        sshClient = new ssh2_1.Client();
        mockExec = jest.fn();
        sshClient.exec = mockExec;
        sshConfig = {
            protocol: 'ssh',
            hostname: 'localhost',
            port: 22,
            username: 'testuser',
            privateKeyPath: '/root/.ssh/id_rsa',
            shell: 'bash',
        };
        escapeSpecialChars_1.escapeSpecialChars.mockImplementation((content) => content);
    });
    it('should execute a command on an SSH server', () => __awaiter(void 0, void 0, void 0, function* () {
        const command = 'ls -la';
        const mockStdout = 'file1\nfile2\n';
        const mockStderr = '';
        mockExec.mockImplementation((execCommand, callback) => {
            console.debug(`Mock exec command: ${execCommand}`);
            const stream = {
                on: (event, handler) => {
                    if (event === 'data')
                        handler(Buffer.from(mockStdout));
                    if (event === 'close')
                        handler();
                    return stream;
                },
                stderr: {
                    on: (event, handler) => {
                        if (event === 'data')
                            handler(Buffer.from(mockStderr));
                        return stream;
                    }
                }
            };
            callback(null, stream);
        });
        const result = yield (0, executeCommand_1.executeCommand)(sshClient, sshConfig, command);
        expect(result).toEqual({ stdout: mockStdout, stderr: mockStderr, timeout: false });
        expect(mockExec).toHaveBeenCalledWith(command, expect.any(Function));
    }));
    it('should throw an error if SSH client is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, executeCommand_1.executeCommand)(null, sshConfig, 'ls -la'))
            .rejects
            .toThrow('SSH client must be provided and must be an instance of Client.');
    }));
    it('should throw an error if SSH server configuration is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, executeCommand_1.executeCommand)(sshClient, null, 'ls -la'))
            .rejects
            .toThrow('SSH server configuration must be provided and must be an object.');
    }));
    it('should throw an error if command is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, executeCommand_1.executeCommand)(sshClient, sshConfig, ''))
            .rejects
            .toThrow('Command must be provided and must be a string.');
    }));
});
