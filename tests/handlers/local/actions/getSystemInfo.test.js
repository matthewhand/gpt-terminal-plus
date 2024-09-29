"use strict";
/**
 * @fileoverview Tests for the getSystemInfo function.
 */
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
const getSystemInfo_1 = require("@src/handlers/local/actions/getSystemInfo");
const sinon_1 = __importDefault(require("sinon"));
const os_1 = __importDefault(require("os"));
describe('getSystemInfo', () => {
    let platformStub;
    let releaseStub;
    let cpusStub;
    beforeEach(() => {
        platformStub = sinon_1.default.stub(os_1.default, 'platform').returns('linux');
        releaseStub = sinon_1.default.stub(os_1.default, 'release').returns('5.8.0-53-generic');
        cpusStub = sinon_1.default.stub(os_1.default, 'cpus').returns([
            {
                model: 'Intel',
                speed: 2400,
                times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }, // Added times
            },
        ]);
    });
    afterEach(() => {
        platformStub.restore();
        releaseStub.restore();
        cpusStub.restore();
    });
    it('should retrieve system information', () => __awaiter(void 0, void 0, void 0, function* () {
        const systemInfo = yield (0, getSystemInfo_1.getSystemInfo)('bash');
        (0, chai_1.expect)(systemInfo.type).toBe('linux'); // Changed from osType
        (0, chai_1.expect)(systemInfo.osVersion).toBe('5.8.0-53-generic');
        (0, chai_1.expect)(systemInfo.cpuModel).toBe('Intel');
        (0, chai_1.expect)(systemInfo.cpuSpeed).toBe(2400);
    }));
    it('should handle different operating systems', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Test Case: Handle different operating systems');
        platformStub.returns('darwin');
        releaseStub.returns('19.6.0');
        cpusStub.returns([
            {
                model: 'Apple M1',
                speed: 1600,
                times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }, // Added times
            },
        ]);
        const systemInfo = yield (0, getSystemInfo_1.getSystemInfo)('zsh');
        (0, chai_1.expect)(systemInfo.type).toBe('darwin'); // Changed from osType
        (0, chai_1.expect)(systemInfo.osVersion).toBe('19.6.0');
        (0, chai_1.expect)(systemInfo.cpuModel).toBe('Apple M1');
        (0, chai_1.expect)(systemInfo.cpuSpeed).toBe(1600);
    }));
});
