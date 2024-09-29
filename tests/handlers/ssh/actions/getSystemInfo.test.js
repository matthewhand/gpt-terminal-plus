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
const getSystemInfo_1 = require("../../../../src/handlers/ssh/actions/getSystemInfo");
const escapeSpecialChars_1 = require("../../../../src/common/escapeSpecialChars");
jest.mock('ssh2');
jest.mock('../../../../src/common/escapeSpecialChars');
describe('getSystemInfo', () => {
    let sshClient;
    let mockExec;
    beforeEach(() => {
        sshClient = new ssh2_1.Client();
        mockExec = jest.fn();
        sshClient.exec = mockExec;
        escapeSpecialChars_1.escapeSpecialChars.mockImplementation((content) => content);
    });
    // it('should retrieve system information from the SSH server', async () => {
    //     const shell = 'bash';
    //     const scriptPath = '/path/to/script.sh';
    //     const mockStdout = JSON.stringify({ os: 'Linux', version: '1.0.0' });
    //     mockExec.mockImplementation((execCommand, callback) => {
    //         console.debug(`Mock exec command: ${execCommand}`);
    //         const stream = {
    //             on: (event: string, handler: (data?: Buffer) => void) => {
    //                 if (event === 'data') handler(Buffer.from(mockStdout));
    //                 if (event === 'close') handler(0); // Simulate successful command execution
    //                 return stream;
    //             },
    //             stderr: {
    //                 on: (event: string, handler: (data?: Buffer) => void) => {
    //                     if (event === 'data') handler(Buffer.from(''));
    //                     return stream;
    //                 }
    //             }
    //         };
    //         callback(null, stream);
    //     });
    //     const result = await getSystemInfo(sshClient, shell, scriptPath);
    //     expect(result).toEqual({ os: 'Linux', version: '1.0.0' });
    //     expect(mockExec).toHaveBeenCalledWith(
    //         `${shell} ${scriptPath}`,
    //         expect.any(Function)
    //     );
    // });
    it('should throw an error if SSH client is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, getSystemInfo_1.getSystemInfo)(null, 'bash', '/path/to/script.sh'))
            .rejects
            .toThrow('SSH client must be provided and must be an instance of Client.');
    }));
    it('should throw an error if shell is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, getSystemInfo_1.getSystemInfo)(sshClient, '', '/path/to/script.sh'))
            .rejects
            .toThrow('Shell must be provided and must be a string.');
    }));
    it('should throw an error if script path is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, getSystemInfo_1.getSystemInfo)(sshClient, 'bash', ''))
            .rejects
            .toThrow('Script path must be provided and must be a string.');
    }));
});
