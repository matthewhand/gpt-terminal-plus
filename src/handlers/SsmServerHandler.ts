import * as os from 'os';
import { ServerHandler } from '../handlers/ServerHandler';
import { ServerConfig, SystemInfo, PaginatedResponse, ServerHandlerInterface } from '../types/index';
import * as AWS from 'aws-sdk';
import Debug from 'debug';
import { getCurrentFolder } from '../utils/GlobalStateHelper'; // Ensure this is imported
import { createPaginatedResponse } from '../utils/PaginationUtils';

const debug = Debug('app:SsmServerHandler');

/**
 * The SsmServerHandler class manages interactions with servers via AWS Systems Manager (SSM).
 * It provides methods to execute commands, manage files, and retrieve system information.
 * This class ensures secure and efficient handling of server operations using SSM.
 */
export default class SsmServerHandler extends ServerHandler {
    private ssmClient: AWS.SSM;

    /**
     * Constructs a new SsmServerHandler.
     * @param serverConfig - Configuration details for the SSM server.
     */
    constructor(serverConfig: ServerConfig) {
        super(serverConfig);
        this.ssmClient = new AWS.SSM({ region: serverConfig.region || 'us-west-2' });
        debug('SSM Server Handler initialized for:', serverConfig.host);
    }

    /**
     * Executes a command on the server using SSM.
     * @param command - The command to execute.
     * @param timeout - Optional timeout for the command execution.
     * @param directory - Optional directory to execute the command in.
     * @returns The command's stdout and stderr output.
     */
    async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
        debug('Executing command:', command, 'on directory:', directory);
        
        if (!command) {
            const error = new Error('No command provided for execution.');
            debug(error.message);
            throw error;
        }

        if (!this.serverConfig.instanceId) {
            const error = new Error('Instance ID is undefined. Unable to execute command.');
            debug(error.message);
            throw error;
        }

        const documentName = this.serverConfig.posix ? 'AWS-RunShellScript' : 'AWS-RunPowerShellScript';
        const formattedCommand = this.serverConfig.posix
            ? (directory ? `cd ${directory}; ${command}` : command)
            : (directory ? `Set-Location -Path '${directory}'; ${command}` : command);

        const params = {
            InstanceIds: [this.serverConfig.instanceId],
            DocumentName: documentName,
            Parameters: { commands: [formattedCommand] },
        };

        debug('Sending command to SSM', params);
        const commandResponse = await this.ssmClient.sendCommand(params).promise();

        if (!commandResponse.Command || !commandResponse.Command.CommandId) {
            const error = new Error('Failed to retrieve command response or CommandId is undefined. Command execution failed.');
            debug(error.message);
            throw error;
        }

        debug('Command sent to SSM successfully', commandResponse.Command);
        return await this.fetchCommandResult(commandResponse.Command.CommandId, this.serverConfig.instanceId);
    }

    /**
     * Fetches the result of an executed command from SSM.
     * @param commandId - The ID of the executed command.
     * @param instanceId - The ID of the instance on which the command was executed.
     * @returns The command's stdout and stderr output.
     */
    private async fetchCommandResult(commandId: string, instanceId: string): Promise<{ stdout: string; stderr: string }> {
        let retries = 10;
        while (retries > 0) {
            const result = await this.ssmClient.getCommandInvocation({
                CommandId: commandId,
                InstanceId: instanceId,
            }).promise();

            if (result && result.Status && ['Success', 'Failed', 'Cancelled', 'TimedOut'].includes(result.Status)) {
                return {
                    stdout: result.StandardOutputContent ? result.StandardOutputContent.trim() : '',
                    stderr: result.StandardErrorContent ? result.StandardErrorContent.trim() : ''
                };
            }
            retries--;
            await new Promise(resolve => setTimeout(resolve, 20000)); // TODO make configuration
        }
        throw new Error('Timeout while waiting for command result');
    }

    /**
     * Lists files in a specified directory on the server.
     * @param directory - The directory to list files in.
     * @param limit - Maximum number of files to return.
     * @param offset - Number of files to skip before starting to collect the result set.
     * @param orderBy - Criteria to order files by.
     * @returns A paginated response containing files in the directory.
     */
    /**
     * Lists files in a specified directory on the server.
     * @param directory - The directory to list files in.
     * @param limit - Maximum number of files to return.
     * @param offset - Number of files to skip before starting to collect the result set.
     * @param orderBy - Criteria to order files by.
     * @returns A paginated response containing files in the directory.
     */
    async listFiles(directory: string = '', limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<PaginatedResponse> {
        const targetDirectory = directory || getCurrentFolder();
        debug(`Listing files in directory: ${targetDirectory}, Limit: ${limit}, Offset: ${offset}, OrderBy: ${orderBy}`);

        const command = `ls -l ${targetDirectory} | tail -n +${offset + 1} | head -n ${limit}`;
        const { stdout } = await this.executeCommand(command);

        const files = stdout.split('\n').filter(line => line).map(line => {
            const parts = line.split(/\s+/);
            return parts.pop() || "";
        });

        const paginatedResponse = createPaginatedResponse(files, limit, offset);
        return paginatedResponse;
    }

    /**
     * Creates a file on the server.
     * This operation is not supported for SSM Server Handler.
     * @param directory - The directory to create the file in.
     * @param filename - The name of the file to create.
     * @param content - The content to write to the file.
     * @param backup - Whether to create a backup of the file if it exists.
     * @returns False indicating the operation is not supported.
     */
    async createFile(directory: string, filename: string, content: string, backup: boolean = false): Promise<boolean> {
        console.error("Create file operation is not supported for SSM Server Handler.");
        return false;
    }

    /**
     * Updates a file on the server by replacing a specified pattern with a replacement string.
     * @param filePath - The path of the file to update.
     * @param pattern - The pattern to replace.
     * @param replacement - The replacement string.
     * @param backup - Whether to create a backup of the file before updating.
     * @returns True if the file is updated successfully.
     */
    async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
        const command = `${backup ? `cp ${filePath} ${filePath}.bak && ` : ''}sed -i 's/${pattern}/${replacement}/g' ${filePath}`;
        await this.executeCommand(command);
        return true;
    }

    /**
     * Appends content to a file on the server.
     * This operation is not supported for SSM Server Handler.
     * @param filePath - The path of the file to amend.
     * @param content - The content to append.
     * @param backup - Whether to create a backup of the file before amending.
     * @returns False indicating the operation is not supported.
     */
    async amendFile(filePath: string, content: string, backup: boolean = false): Promise<boolean> {
        throw new Error("This operation is not supported by the current server handler.");
    }

    /**
     * Parses system information from the command output.
     * @param info - The raw system information output.
     * @param isPosix - Flag indicating if the system is POSIX compliant.
     * @returns Parsed system information.
     */
    parseSystemInfo(info: string, isPosix: boolean): SystemInfo {
        // Placeholder: Implement parsing logic based on output format
        // The parsing will differ significantly between POSIX and non-POSIX outputs
        // Return a SystemInfo object based on parsed information
        return {
            homeFolder: os.homedir(),
            type: os.type(),
            release: os.release(),
            platform: os.platform(),
            architecture: os.arch(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            uptime: os.uptime(),
            currentFolder: process.cwd(),
            // Other fields like `pythonVersion` or `powershellVersion` can be filled as needed
        };
    }

    /**
     * Retrieves system information from the server.
     * @returns System information.
     */
    async getSystemInfo(): Promise<SystemInfo> {
        const command = this.serverConfig.posix ? 'uname -a && df -h && free -m' : 'Get-CimInstance Win32_OperatingSystem | Format-List *';
        const { stdout } = await this.executeCommand(command);

        if (this.serverConfig.posix) {
            const lines = stdout.split('\n');
            const systemInfo = {
                os: lines[0] || 'Unknown',
                disk: lines[1] || 'Unknown',
                memory: lines[2] || 'Unknown',
            };
            return {
                homeFolder: process.env.HOME || '/',
                type: systemInfo.os,
                release: 'N/A',
                platform: systemInfo.os.split(' ')[0],
                architecture: process.arch,
                totalMemory: parseInt(systemInfo.memory.split(' ')[1], 10),
                freeMemory: parseInt(systemInfo.memory.split(' ')[3], 10),
                uptime: process.uptime(),
                currentFolder: process.cwd(),
            };
        } else {
            return {
                homeFolder: 'N/A',
                type: 'Windows',
                release: 'N/A',
                platform: 'N/A',
                architecture: 'N/A',
                totalMemory: 0,
                freeMemory: 0,
                uptime: 0,
                currentFolder: 'N/A',
            };
        }
    }

    /**
     * Deletes a file on the server.
     * @param filePath - The path of the file to delete.
     * @returns True if the file is deleted successfully.
     */
    async deleteFile(filePath: string): Promise<boolean> {
        const command = `rm -f ${filePath}`;
        await this.executeCommand(command);
        return true;
    }

    /**
     * Checks if a file exists on the server.
     * @param filePath - The path of the file to check.
     * @returns True if the file exists, otherwise false.
     */
    async fileExists(filePath: string): Promise<boolean> {
        const command = `test -f ${filePath} && echo "exists" || echo "not exists"`;
        const { stdout } = await this.executeCommand(command);
        return stdout.trim() === "exists";
    }
}
