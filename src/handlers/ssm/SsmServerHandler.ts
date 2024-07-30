import { SSMClient } from "@aws-sdk/client-ssm";
import { ServerConfig } from "../../types/ServerConfig";
import { ServerHandlerInterface } from "../../types/ServerHandlerInterface";
import { executeCommand } from "./functions/executeCommand";
import { createFile } from "./functions/createFile";
import { amendFile } from "./functions/amendFile";
import { listFiles } from "./functions/listFiles";
import { updateFile } from "./functions/updateFile";
import { getSystemInfo } from "./functions/getSystemInfo";
import { determineScriptExtension } from "./functions/determineScriptExtension";
import { createTempScript } from "./functions/createTempScript";
import { SystemInfo } from "../../types/SystemInfo";
import { PaginatedResponse } from "../../types/PaginatedResponse";
import debug from "debug";

const log = debug("ssm-server-handler");

/**
 * SSM Server Handler to handle various SSM operations.
 */
export class SsmServerHandler implements ServerHandlerInterface {
    private ssmClient: SSMClient;
    private instanceId: string;
    private config: ServerConfig;

    /**
     * Constructs an SsmServerHandler instance.
     * @param {ServerConfig} config - The server configuration.
     */
    constructor(config: ServerConfig) {
        this.ssmClient = new SSMClient({ region: config.region });
        this.instanceId = config.instanceId || "";
        this.config = config;
        log(`SsmServerHandler initialized with config: ${JSON.stringify(config)}`);
    }

    /**
     * Executes a command on the SSM instance.
     * @param {string} command - The command to execute.
     * @param {number} [timeout=60] - The timeout for the command execution.
     * @param {string} [directory] - The directory in which to execute the command.
     * @returns {Promise<{ stdout: string; stderr: string }>} - The command output.
     */
    async executeCommand(command: string, timeout: number = 60, directory?: string): Promise<{ stdout: string; stderr: string }> {
        log(`Executing command: ${command} with timeout: ${timeout} and directory: ${directory}`);
        const output = await executeCommand(this.ssmClient, command, this.instanceId, "AWS-RunShellScript", timeout, directory);
        log(`Command executed with stdout: ${output.stdout} and stderr: ${output.stderr}`);
        return { stdout: output.stdout || "", stderr: output.stderr || "" };
    }

    /**
     * Creates a file on the SSM instance.
     * @param {string} directory - The directory in which to create the file.
     * @param {string} filename - The name of the file.
     * @param {string} content - The content of the file.
     * @param {boolean} [backup=true] - Whether to create a backup of the file.
     * @returns {Promise<boolean>} - Whether the file was created successfully.
     */
    async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
        log(`Creating file: ${filename} in directory: ${directory} with backup: ${backup}`);
        const result = await createFile(this.ssmClient, this.instanceId, directory, filename, content, backup);
        log(`File created: ${result}`);
        return result;
    }

    /**
     * Amends a file on the SSM instance.
     * @param {string} filePath - The path to the file.
     * @param {string} content - The content to add to the file.
     * @returns {Promise<boolean>} - Whether the file was amended successfully.
     */
    async amendFile(filePath: string, content: string): Promise<boolean> {
        log(`Amending file: ${filePath} with content: ${content}`);
        const result = await amendFile(this.ssmClient, this.instanceId, filePath, content);
        log(`File amended: ${result}`);
        return result;
    }

    /**
     * Lists files in a directory on the SSM instance.
     * @param {string} [directory=""] - The directory to list files in.
     * @param {number} [limit=42] - The maximum number of files to list.
     * @param {number} [offset=0] - The offset from which to start listing files.
     * @param {"filename" | "datetime"} [orderBy="filename"] - The order by which to list files.
     * @returns {Promise<PaginatedResponse<string>>} - The list of files.
     */
    async listFiles(directory: string = "", limit: number = 42, offset: number = 0, orderBy: "filename" | "datetime" = "filename"): Promise<PaginatedResponse<string>> {
        log(`Listing files in directory: ${directory} with limit: ${limit}, offset: ${offset}, orderBy: ${orderBy}`);
        const result = await listFiles(this.ssmClient, this.instanceId, directory, limit, offset, orderBy);
        log(`Files listed: ${JSON.stringify(result)}`);
        return result;
    }

    /**
     * Updates a file on the SSM instance.
     * @param {string} filePath - The path to the file.
     * @param {string} pattern - The pattern to search for in the file.
     * @param {string} replacement - The replacement for the pattern.
     * @param {boolean} [backup=true] - Whether to create a backup of the file.
     * @returns {Promise<boolean>} - Whether the file was updated successfully.
     */
    async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
        log(`Updating file: ${filePath} with pattern: ${pattern} and replacement: ${replacement} with backup: ${backup}`);
        const result = await updateFile(this.ssmClient, this.instanceId, filePath, pattern, replacement, backup);
        log(`File updated: ${result}`);
        return result;
    }

    /**
     * Gets system information from the SSM instance.
     * @returns {Promise<SystemInfo>} - The system information.
     */
    async getSystemInfo(): Promise<SystemInfo> {
        log(`Getting system info`);
        const output = await getSystemInfo(this.ssmClient, this.instanceId, "bash", "src/scripts/system-info.sh");
        log(`System info retrieved: ${output}`);
        return JSON.parse(output) as SystemInfo;
    }

    /**
     * Determines the script extension based on the shell type.
     * @param {string} shell - The shell type.
     * @returns {string} - The script extension.
     */
    determineScriptExtension(shell: string): string {
        log(`Determining script extension for shell: ${shell}`);
        return determineScriptExtension(shell);
    }

    /**
     * Creates a temporary script on the SSM instance.
     * @param {string} scriptContent - The content of the script.
     * @param {string} scriptExtension - The extension of the script.
     * @param {string} directory - The directory in which to create the script.
     * @returns {Promise<string>} - The path to the temporary script.
     */
    async createTempScript(scriptContent: string, scriptExtension: string, directory: string): Promise<string> {
        log(`Creating temporary script in directory: ${directory} with extension: ${scriptExtension}`);
        return createTempScript(scriptContent, scriptExtension, directory);
    }
}

