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
const getFileContent_1 = require("../../../../src/handlers/ssh/actions/getFileContent");
jest.mock('ssh2');
describe('getFileContent', () => {
    let sshClient;
    let mockSftp;
    let mockReadFile;
    let sshConfig;
    beforeEach(() => {
        sshClient = new ssh2_1.Client();
        mockSftp = jest.fn();
        mockReadFile = jest.fn();
        sshClient.sftp = mockSftp;
        sshConfig = {
            protocol: 'ssh',
            hostname: 'localhost',
            port: 22,
            username: 'testuser',
            privateKeyPath: '/root/.ssh/id_rsa',
            shell: 'bash',
        };
    });
    it('should retrieve the content of a file from the SSH server', () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = '/path/to/file.txt';
        const mockContent = 'Hello, world!';
        mockSftp.mockImplementation((callback) => {
            callback(null, {
                readFile: mockReadFile.mockImplementation((path, cb) => {
                    cb(null, Buffer.from(mockContent, 'utf8'));
                }),
            });
        });
        const result = yield (0, getFileContent_1.getFileContent)(sshClient, sshConfig, filePath);
        expect(result).toBe(mockContent);
        expect(mockSftp).toHaveBeenCalledWith(expect.any(Function));
        expect(mockReadFile).toHaveBeenCalledWith(filePath, expect.any(Function));
    }));
    it('should throw an error if SSH client is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, getFileContent_1.getFileContent)(null, sshConfig, '/path/to/file.txt'))
            .rejects
            .toThrow('SSH client must be provided and must be an instance of Client.');
    }));
    it('should throw an error if SSH server configuration is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, getFileContent_1.getFileContent)(sshClient, null, '/path/to/file.txt'))
            .rejects
            .toThrow('Server configuration must be provided and must be an object.');
    }));
    it('should throw an error if file path is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, getFileContent_1.getFileContent)(sshClient, sshConfig, ''))
            .rejects
            .toThrow('File path must be provided and must be a string.');
    }));
});
