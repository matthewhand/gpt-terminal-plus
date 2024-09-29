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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const createFile_1 = require("../../../../src/handlers/local/actions/createFile");
const debug_1 = __importDefault(require("debug"));
jest.mock('fs');
jest.mock('path');
jest.mock('../../../../src/utils/GlobalStateHelper');
// Mocked dependencies
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const GlobalStateHelper_1 = require("../../../../src/utils/GlobalStateHelper");
// Create mock implementations for fs.promises methods
const writeFileMock = jest.fn();
const copyFileMock = jest.fn();
fs_1.default.promises = { writeFile: writeFileMock, copyFile: copyFileMock };
fs_1.default.existsSync = jest.fn();
// Enable debug logging for the test run
const debug = (0, debug_1.default)('app:createFile');
debug.enabled = true;
// Create an Express app for testing
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Define the route
app.post('/file/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received parameters:', req.body); // Log the request body
    try {
        const { filePath, content, backup } = req.body;
        yield (0, createFile_1.createFile)(filePath, content, backup);
        res.status(200).send({ success: true });
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).send({ error: errorMessage });
    }
}));
describe('POST /file/create', () => {
    const filePath = 'test.txt';
    const content = 'Hello, World!';
    const fullPath = path_1.default.join(process.env.NODE_CONFIG_DIR || '/mocked/path', filePath);
    beforeEach(() => {
        jest.clearAllMocks();
        path_1.default.join.mockReturnValue(fullPath);
        GlobalStateHelper_1.presentWorkingDirectory.mockReturnValue('/mocked/path');
    });
    it('should create a file with the given content', () => __awaiter(void 0, void 0, void 0, function* () {
        writeFileMock.mockResolvedValueOnce(undefined);
        const response = yield (0, supertest_1.default)(app)
            .post('/file/create')
            .send({ filePath, content, backup: false })
            .set('Content-Type', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(writeFileMock).toHaveBeenCalledWith(fullPath, content);
    }));
    it('should back up the existing file before creating a new one', () => __awaiter(void 0, void 0, void 0, function* () {
        fs_1.default.existsSync.mockReturnValue(true);
        copyFileMock.mockResolvedValueOnce(undefined);
        writeFileMock.mockResolvedValueOnce(undefined);
        const response = yield (0, supertest_1.default)(app)
            .post('/file/create')
            .send({ filePath, content, backup: true })
            .set('Content-Type', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(copyFileMock).toHaveBeenCalledWith(fullPath, fullPath + '.bak');
        expect(writeFileMock).toHaveBeenCalledWith(fullPath, content);
    }));
    it('should throw an error if the file path is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/file/create')
            .send({ filePath: '', content, backup: false })
            .set('Content-Type', 'application/json');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('File path must be provided and must be a string.');
    }));
    it('should throw an error if the content is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/file/create')
            .send({ filePath, content: '', backup: false })
            .set('Content-Type', 'application/json');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Content must be provided and must be a string.');
    }));
    it('should handle file creation errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
        writeFileMock.mockRejectedValueOnce(new Error('Write error'));
        const response = yield (0, supertest_1.default)(app)
            .post('/file/create')
            .send({ filePath, content, backup: false })
            .set('Content-Type', 'application/json');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to create file ' + fullPath + ': Write error');
    }));
});
