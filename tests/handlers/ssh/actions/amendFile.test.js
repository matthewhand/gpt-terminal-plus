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
const amendFile_1 = require("../../../../src/handlers/ssh/actions/amendFile");
const GlobalStateHelper_1 = require("../../../../src/utils/GlobalStateHelper");
const escapeSpecialChars_1 = require("../../../../src/common/escapeSpecialChars");
jest.mock('ssh2');
jest.mock('../../../../src/utils/GlobalStateHelper');
jest.mock('../../../../src/common/escapeSpecialChars');
describe('amendFile', () => {
    let sshClient;
    let mockExec;
    beforeEach(() => {
        sshClient = new ssh2_1.Client();
        mockExec = jest.fn();
        sshClient.exec = mockExec;
        GlobalStateHelper_1.presentWorkingDirectory.mockReturnValue('/home/user');
        escapeSpecialChars_1.escapeSpecialChars.mockImplementation((content) => content);
    });
    it('should append content to a file on an SSH server', () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = 'test.txt';
        const content = 'Hello, world!';
        mockExec.mockImplementation((command, callback) => {
            const stream = {
                on: (event, handler) => {
                    if (event === 'close')
                        handler();
                    return stream;
                }
            };
            callback(null, stream);
        });
        const result = yield (0, amendFile_1.amendFile)(sshClient, filePath, content);
        expect(result).toBe(true);
        expect(mockExec).toHaveBeenCalledWith(`cat << EOF >> /home/user/${filePath}\n${content}\nEOF\n`, expect.any(Function));
    }));
    it('should throw an error if SSH client is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, amendFile_1.amendFile)(null, 'test.txt', 'Hello, world!'))
            .rejects
            .toThrow('SSH client must be provided and must be an instance of Client.');
    }));
    it('should throw an error if file path is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, amendFile_1.amendFile)(sshClient, '', 'Hello, world!'))
            .rejects
            .toThrow('File path must be provided and must be a string.');
    }));
    it('should throw an error if content is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, amendFile_1.amendFile)(sshClient, 'test.txt', ''))
            .rejects
            .toThrow('Content must be provided and must be a string.');
    }));
});
