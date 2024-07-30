import { SSMClient } from '@aws-sdk/client-ssm';

/**
 * Interface representing server configuration.
 */
export interface ServerConfig {
  /** Whether to clean up scripts after execution. */
  cleanupScripts?: boolean;

  /** The host of the server. */
  host: string;

  /** The path to the private key file. */
  privateKeyPath?: string;

  /** The path to the key file. */
  keyPath?: string;

  /** Whether the server uses a POSIX-compliant operating system. */
  posix?: boolean;

  /** The method of retrieving system information ('local', 'python', 'powershell', 'auto'). */
  systemInfo?: 'local' | 'python' | 'powershell' | 'auto';

  /** The port number of the server. */
  port?: number;

  /** Whether the server is used for code execution. */
  code?: boolean;

  /** The username for authentication. */
  username?: string;

  /** The protocol used to connect to the server ('ssh', 'ssm', 'local'). */
  protocol?: 'ssh' | 'ssm' | 'local';

  /** The shell to use for command execution. */
  shell?: string;

  /** The AWS region for SSM connections. */
  region?: string;

  /** The instance ID for SSM connections. */
  instanceId?: string;

  /** The home folder on the server. */
  homeFolder?: string;

  /** The container ID for containerized environments. */
  containerId?: number;

  /** The list of tasks to run on the server. */
  tasks?: string[];

  /** The folder to store scripts on the server. */
  scriptFolder?: string;

  /** The default folder on the server. */
  defaultFolder?: string;
}

/**
 * Interface representing system information.
 */
export interface SystemInfo {
    /** The operating system of the server. */
    os: string;

    /** The version of the operating system. */
    version: string;
}

/**
 * Interface representing a paginated response.
 * @template T - The type of the items in the response.
 */
export interface PaginatedResponse<T> {
    /** The items in the current page. */
    items: T[];

    /** The total number of pages. */
    totalPages: number;

    /** The unique identifier for the response. */
    responseId: string;

    /** The standard output logs of the command execution, split by lines. */
    stdout: string;

    /** The standard error logs of the command execution, split by lines. */
    stderr: string;
}

/**
 * Interface representing the server handler.
 */
export interface ServerHandlerInterface {
    /**
     * Executes a command on the server.
     * @param {string} command - The command to execute.
     * @param {number} [timeout] - Optional timeout for the command.
     * @param {string} [directory] - Optional directory to execute the command in.
     * @returns {Promise<{ stdout: string; stderr: string }>} - The standard output and standard error of the command.
     */
    executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;

    /**
     * Creates a file in a directory.
     * @param {string} directory - The directory to create the file in.
     * @param {string} filename - The name of the file.
     * @param {string} content - The content of the file.
     * @param {boolean} [backup] - Whether to create a backup of the file.
     * @returns {Promise<boolean>} - Whether the file was created successfully.
     */
    createFile(directory: string, filename: string, content: string, backup?: boolean): Promise<boolean>;

    /**
     * Amends a file by appending content to it.
     * @param {string} filePath - The path of the file to amend.
     * @param {string} content - The content to append.
     * @returns {Promise<boolean>} - Whether the file was amended successfully.
     */
    amendFile(filePath: string, content: string): Promise<boolean>;

    /**
     * Lists files in a directory.
     * @param {string} [directory] - The directory to list files in.
     * @param {number} [limit] - Optional limit on the number of files to return.
     * @param {number} [offset] - Optional offset for pagination.
     * @param {string} [orderBy] - Optional order criteria.
     * @returns {Promise<PaginatedResponse<string>>} - A paginated response with file names.
     */
    listFiles(directory?: string, limit?: number, offset?: number, orderBy?: string): Promise<PaginatedResponse<string>>;

    /**
     * Updates a file by replacing a pattern with a replacement.
     * @param {string} filePath - The path of the file to update.
     * @param {string} pattern - The pattern to replace.
     * @param {string} replacement - The replacement text.
     * @param {boolean} [backup] - Whether to create a backup of the file.
     * @returns {Promise<boolean>} - Whether the file was updated successfully.
     */
    updateFile(filePath: string, pattern: string, replacement: string, backup?: boolean): Promise<boolean>;

    /**
     * Retrieves system information from the server.
     * @returns {Promise<SystemInfo>} - The system information.
     */
    getSystemInfo(): Promise<SystemInfo>;

    /**
     * Determines the script extension based on the shell type.
     * @param {string} shell - The shell type.
     * @returns {string} - The script extension.
     */
    determineScriptExtension(shell: string): string;

    /**
     * Creates a temporary script file on the server.
     * @param {string} scriptContent - The content of the script.
     * @param {string} scriptExtension - The extension of the script.
     * @param {string} directory - The directory to create the script in.
     * @returns {Promise<string>} - The path of the created script.
     */
    createTempScript(scriptContent: string, scriptExtension: string, directory: string): Promise<string>;
}
