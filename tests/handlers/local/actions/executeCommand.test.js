"use strict";
/**
 * @fileoverview Tests for the executeCommand function.
 */
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
const chai_1 = require("chai");
const executeCommand_1 = require("@src/handlers/local/actions/executeCommand");
const sinon_1 = __importDefault(require("sinon"));
const child_process = __importStar(require("child_process"));
describe('executeCommand', () => {
    let execStub;
    beforeEach(() => {
        execStub = sinon_1.default.stub(child_process, 'exec');
    });
    afterEach(() => {
        execStub.restore();
    });
    it('should execute a valid command successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Test Case: Execute valid command');
        execStub.yields(null, 'Hello, World!\n', '');
        const result = yield (0, executeCommand_1.executeCommand)('echo "Hello, World!"', 0); // Changed parameter type to number
        console.log(`executeCommand returned stdout: ${result.stdout}, stderr: ${result.stderr}`);
        (0, chai_1.expect)(execStub.calledOnce).to.be.true;
        (0, chai_1.expect)(result.stdout.trim()).toBe('Hello, World!');
        (0, chai_1.expect)(result.stderr).toBe('');
    }));
    it('should handle command execution errors', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Test Case: Handle command execution errors');
        execStub.yields(new Error('Execution failed'), '', 'Error message');
        try {
            yield (0, executeCommand_1.executeCommand)('invalidcommand', 0); // Changed parameter type to number
            chai_1.expect.fail('Expected error was not thrown');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Caught error: ${error.message}`);
                (0, chai_1.expect)(error.message).toBe('Execution failed');
            }
            else {
                throw error;
            }
        }
    }));
    it('should validate input parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Test Case: Validate input parameters');
        try {
            // @ts-ignore
            yield (0, executeCommand_1.executeCommand)(null, 0); // Changed parameter type to number
            chai_1.expect.fail('Expected error was not thrown for null command');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Caught error: ${error.message}`);
                (0, chai_1.expect)(error.message).toBe('A valid command string must be provided.');
            }
            else {
                throw error;
            }
        }
        try {
            yield (0, executeCommand_1.executeCommand)('print("Hello")', 0); // Changed parameter type to number
            chai_1.expect.fail('Expected error was not thrown');
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Caught error: ${error.message}`);
                (0, chai_1.expect)(error.message).toBe('Language is required for code execution.');
            }
            else {
                throw error;
            }
        }
    }));
});
