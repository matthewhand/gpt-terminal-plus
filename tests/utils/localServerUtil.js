"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocalServer = void 0;
const LocalServerHandler_1 = __importDefault(require("../../src/handlers/local/LocalServerHandler"));
const createLocalServer = () => {
    return new LocalServerHandler_1.default({ hostname: "localhost", protocol: "local", code: true });
};
exports.createLocalServer = createLocalServer;
