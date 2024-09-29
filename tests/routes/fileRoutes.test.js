"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const fileRoutes_1 = __importDefault(require("../../src/routes/fileRoutes"));
const createFileHandler = __importStar(require("../../src/routes/file/createFile"));
const updateFileHandler = __importStar(require("../../src/routes/file/updateFile"));
const amendFileHandler = __importStar(require("../../src/routes/file/amendFile"));
const listFilesHandler = __importStar(require("../../src/routes/file/listFiles"));
jest.mock('../../src/routes/file/createFile');
jest.mock('../../src/routes/file/updateFile');
jest.mock('../../src/routes/file/amendFile');
jest.mock('../../src/routes/file/listFiles');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/file', fileRoutes_1.default);
describe('fileRoutes', () => {
    it('should call createFile handler on POST /file/create', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCreateFile = jest.spyOn(createFileHandler, 'createFile').mockImplementation((req, res) => {
            res.status(200).send({ message: 'File created successfully.' });
            return Promise.resolve(res);
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/file/create')
            .send({ filePath: 'test.txt', content: 'Hello, world!' });
        expect(mockCreateFile).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File created successfully.');
    }));
    it('should call updateFile handler on POST /file/update', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdateFile = jest.spyOn(updateFileHandler, 'updateFile').mockImplementation((req, res) => {
            res.status(200).send({ message: 'File updated successfully.' });
            return Promise.resolve(res);
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/file/update')
            .send({ filePath: 'test/test.txt', pattern: 'Hello', replacement: 'Hi' });
        expect(mockUpdateFile).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File updated successfully.');
    }));
    it('should call amendFile handler on POST /file/amend', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAmendFile = jest.spyOn(amendFileHandler, 'amendFile').mockImplementation((req, res) => {
            res.status(200).send({ message: 'File amended successfully.' });
            return Promise.resolve(res);
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/file/amend')
            .send({ filePath: 'test/test.txt', content: 'Appended text' });
        expect(mockAmendFile).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File amended successfully.');
    }));
    it('should call listFiles handler on POST /file/list', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockListFiles = jest.spyOn(listFilesHandler, 'listFiles').mockImplementation((req, res) => {
            res.status(200).send({ files: [], total: 0 });
            return Promise.resolve(res);
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/file/list')
            .send({ directory: 'test' });
        expect(mockListFiles).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ files: [], total: 0 });
    }));
});
