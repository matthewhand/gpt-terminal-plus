"use strict";
/**
 * @fileoverview Tests for the createFile function in SSH actions.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const createFile_1 = require("@src/handlers/ssh/actions/createFile");
const sinon_1 = __importDefault(require("sinon"));
const fs_1 = __importDefault(require("fs"));
describe('createFile', () => {
    let writeFileSyncStub;
    beforeEach(() => {
        writeFileSyncStub = sinon_1.default.stub(fs_1.default, 'writeFileSync');
    });
    afterEach(() => {
        writeFileSyncStub.restore();
    });
    it('should create a file successfully', () => {
        const directory = '/remote/path';
        const filename = 'remote.txt';
        const content = 'Remote content';
        (0, createFile_1.createFile)(directory, filename, content);
        (0, chai_1.expect)(writeFileSyncStub.calledOnce).to.be.true;
        (0, chai_1.expect)(writeFileSyncStub.calledWith(`${directory}/${filename}`, content)).to.be.true;
    });
    it('should throw an error if directory does not exist', () => {
        const directory = '/nonexistent/path';
        const filename = 'remote.txt';
        const content = 'Remote content';
        writeFileSyncStub.throws(new Error('Directory does not exist'));
        (0, chai_1.expect)(() => (0, createFile_1.createFile)(directory, filename, content)).to.throw('Directory does not exist');
    });
});
