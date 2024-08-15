import { Request, Response } from 'express';
import { exec } from 'child_process';
import * as os from 'os';
import { AbstractServerHandler } from '../AbstractServerHandler';
import { createFile as createLocalFile } from './actions/createFile';
import { amendFile as amendLocalFile } from './actions/amendFile';
import { getSystemInfo as getLocalSystemInfo } from './actions/getSystemInfo';
import { updateFile as updateLocalFile } from './actions/updateFile';
import { executeCommand as executeLocalCommand } from './actions/executeCommand';
import { executeCode as executeLocalCode } from './actions/executeCode';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { LocalConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import debug from 'debug';

const localServerDebug = debug('app:LocalServer');

/**
 * Implementation of the local server handler.
 */
class LocalServer extends AbstractServerHandler {
    code: boolean;

    /**
     * Initializes the LocalServer with a given server configuration.
     * @param serverConfig - The configuration of the local server.
     */
    constructor(serverConfig: LocalConfig) {
        super(serverConfig);
        this.code = serverConfig.code ?? false;
        localServerDebug(`Initialized LocalServer with config: ${JSON.stringify(serverConfig)}`);
    }

    /**
     * Executes a command on the local server.
     * @param command - The command to execute.
     * @param timeout - The optional timeout for the command execution.
     * @param directory - The optional directory to execute the command in.
     * @returns The command execution result.
     */
    async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
        localServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);
        return executeLocalCommand(command, timeout, directory);
    }

    /**
     * Executes code on the local server in a specified language.
     * 
     * @param {string} code - The code to execute.
     * @param {string} language - The programming language of the code.
     * @param {number} [timeout=5000] - Optional timeout in milliseconds for code execution. Defaults to 5000ms.
     * @param {string} [directory=os.tmpdir()] - The directory from which to execute the code. Defaults to the system's temporary directory.
     * @returns {Promise<ExecutionResult>} - A promise that resolves with the execution result.
     * @throws {Error} - Will throw an error if code execution fails.
     */
    async executeCode(
        code: string, 
        language: string,  // Updated to allow any string for language
        timeout: number = 5000, 
        directory: string = os.tmpdir()
    ): Promise<ExecutionResult> {
        // Guard clauses to ensure valid inputs
        if (!code) {
            localServerDebug(`No code provided for execution.`);
            throw new Error('Code is required for execution.');
        }

        if (!language) {
            localServerDebug(`No language specified for code execution.`);
            throw new Error('Language is required for code execution.');
        }

        localServerDebug(`Executing code: ${code}, language: ${language}, timeout: ${timeout}, directory: ${directory}`);

        try {
            // Execute the code using the local handler
            const result = await executeLocalCode(code, language, timeout, directory);
            localServerDebug(`Code execution result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            // Log the error and rethrow it
            localServerDebug(`Error during code execution: ${(error as Error).message}`);
            throw new Error(`Failed to execute code: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves the system information of the local server.
     * @returns The system information.
     */
    async getSystemInfo(): Promise<SystemInfo> {
        localServerDebug('Retrieving system info');
        return getLocalSystemInfo('bash');
    }

    /**
     * Amends a file on the local server.
     * @param filePath - The path of the file to amend.
     * @param content - The content to append to the file.
     * @param backup - Whether to back up the file before amending.
     * @returns Whether the file was successfully amended.
     */
    async amendFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
        localServerDebug(`Amending file at path: ${filePath}, content: ${content}, backup: ${backup}`);
        return amendLocalFile(filePath, content);
    }

    /**
     * Creates a file on the local server.
     * @param filePath - The path of the file to create.
     * @param content - The content of the file.
     * @param backup - Whether to create a backup of the file.
     * @returns Whether the file was successfully created.
     */
    async createFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
        localServerDebug(`Creating file at path: ${filePath}, content: ${content}, backup: ${backup}`);
        return createLocalFile(filePath, content, backup);
    }

    /**
     * Lists files in a directory on the local server.
     * @param params - The parameters for listing files.
     * @returns A paginated response with the list of files.
     */
    async listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>> {
        localServerDebug(`Listing files with params: ${JSON.stringify(params)}`);
        throw new Error('listFiles action not implemented');
    }

    /**
     * Updates a file on the local server.
     * @param filePath - The path of the file to update.
     * @param pattern - The pattern to replace in the file.
     * @param replacement - The replacement for the pattern.
     * @param multiline - Whether to treat the pattern as multiline.
     * @returns Whether the file was successfully updated.
     */
    async updateFile(filePath: string, pattern: string, replacement: string, multiline: boolean = false): Promise<boolean> {
        localServerDebug(`Updating file at path: ${filePath}, pattern: ${pattern}, replacement: ${replacement}, multiline: ${multiline}`);
        return updateLocalFile(filePath, pattern, replacement, multiline);
    }

    /**
     * Changes the working directory on the local server.
     * @param directory - The directory to change to.
     * @returns Whether the directory was successfully changed.
     */
    async changeDirectory(directory: string): Promise<boolean> {
        localServerDebug(`Changing directory to: ${directory}`);
        return super.changeDirectory(directory);
    }

    /**
     * Retrieves the present working directory on the local server.
     * @returns The present working directory.
     */
    async presentWorkingDirectory(): Promise<string> {
        localServerDebug('Retrieving present working directory');
        return super.presentWorkingDirectory();
    }
}

export default LocalServer;
