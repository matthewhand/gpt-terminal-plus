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
const fileExists_1 = require("../../../../src/handlers/ssh/actions/fileExists");
jest.mock('ssh2');
describe('fileExists', () => {
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
    });
    it('should return true if the file exists on the SSH server', () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = '/path/to/file.txt';
        const mockStdout = 'exists\n';
        mockExec.mockImplementation((execCommand, callback) => {
            console.debug(`Mock exec command: ${execCommand}`);
            const stream = {
                on: (event, handler) => {
                    if (event === 'data')
                        handler(Buffer.from(mockStdout));
                    if (event === 'end')
                        handler();
                    return stream;
                }
            };
            callback(null, stream);
        });
        const result = yield (0, fileExists_1.fileExists)(sshClient, sshConfig, filePath);
        expect(result).toBe(true);
        expect(mockExec).toHaveBeenCalledWith(`test -f ${filePath} && echo "exists"`, expect.any(Function));
    }));
    it('should return false if the file does not exist on the SSH server', () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = '/path/to/file.txt';
        const mockStdout = '';
        mockExec.mockImplementation((execCommand, callback) => {
            console.debug(`Mock exec command: ${execCommand}`);
            const stream = {
                on: (event, handler) => {
                    if (event === 'data')
                        handler(Buffer.from(mockStdout));
                    if (event === 'end')
                        handler();
                    return stream;
                }
            };
            callback(null, stream);
        });
        const result = yield (0, fileExists_1.fileExists)(sshClient, sshConfig, filePath);
        expect(result).toBe(false);
        expect(mockExec).toHaveBeenCalledWith(`test -f ${filePath} && echo "exists"`, expect.any(Function));
    }));
    it('should throw an error if SSH client is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, fileExists_1.fileExists)(null, sshConfig, '/path/to/file.txt'))
            .rejects
            .toThrow('SSH client must be provided and must be an instance of Client.');
    }));
    it('should throw an error if SSH server configuration is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, fileExists_1.fileExists)(sshClient, null, '/path/to/file.txt'))
            .rejects
            .toThrow('Server configuration must be provided and must be an object.');
    }));
    it('should throw an error if file path is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, fileExists_1.fileExists)(sshClient, sshConfig, ''))
            .rejects
            .toThrow('File path must be provided and must be a string.');
    }));
});
