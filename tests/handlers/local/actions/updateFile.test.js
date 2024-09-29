"use strict";
/**
 * @fileoverview Tests for the updateFile function.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs_1 = __importDefault(require("fs"));
const sinon_1 = __importDefault(require("sinon"));
const updateFile_1 = require("@src/handlers/local/actions/updateFile");
describe('updateFile', () => {
    let readFileSyncStub;
    let writeFileSyncStub;
    beforeEach(() => {
        readFileSyncStub = sinon_1.default.stub(fs_1.default, 'readFileSync');
        writeFileSyncStub = sinon_1.default.stub(fs_1.default, 'writeFileSync');
    });
    afterEach(() => {
        readFileSyncStub.restore();
        writeFileSyncStub.restore();
    });
    it('should update the file with the replacement text', () => {
        console.log('Test Case: Update file with replacement text');
        const filePath = 'test.txt';
        const fileContent = 'Hello World';
        readFileSyncStub.returns(fileContent);
        const pattern = 'World';
        const replacement = 'Universe';
        const multiline = false; // Added argument
        const result = (0, updateFile_1.updateFile)(filePath, pattern, replacement, multiline); // Passed argument
        console.log(`updateFile returned: ${result}`);
        (0, chai_1.expect)(result).to.be.true;
        (0, chai_1.expect)(writeFileSyncStub.calledOnce).to.be.true;
        const updatedContent = writeFileSyncStub.getCall(0).args[1];
        (0, chai_1.expect)(updatedContent).toBe('Hello Universe');
    });
    it('should throw an error if file does not exist', () => {
        console.log('Test Case: Update non-existent file');
        const filePath = 'nonexistent.txt';
        readFileSyncStub.throws(new Error('File not found'));
        try {
            (0, updateFile_1.updateFile)(filePath, 'pattern', 'replacement', false); // Passed argument
            chai_1.expect.fail('Expected error was not thrown');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Caught error: ${error.message}`);
                (0, chai_1.expect)(error.message).toBe('File not found');
            }
            else {
                throw error;
            }
        }
    });
    it('should handle invalid input parameters', () => {
        console.log('Test Case: Handle invalid input parameters');
        try {
            (0, updateFile_1.updateFile)('', 'pattern', 'replacement', false); // Passed argument
            chai_1.expect.fail('Expected error was not thrown for invalid file path');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Caught error: ${error.message}`);
                (0, chai_1.expect)(error.message).toBe('Invalid file path');
            }
            else {
                throw error;
            }
        }
        try {
            (0, updateFile_1.updateFile)('file.txt', '', 'replacement', false); // Passed argument
            chai_1.expect.fail('Expected error was not thrown for invalid pattern');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Caught error: ${error.message}`);
                (0, chai_1.expect)(error.message).toBe('Invalid pattern');
            }
            else {
                throw error;
            }
        }
        try {
            (0, updateFile_1.updateFile)('file.txt', 'pattern', '', false); // Passed argument
            chai_1.expect.fail('Expected error was not thrown for invalid replacement');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Caught error: ${error.message}`);
                (0, chai_1.expect)(error.message).toBe('Invalid replacement');
            }
            else {
                throw error;
            }
        }
    });
});
