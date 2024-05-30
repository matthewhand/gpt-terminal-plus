import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import Debug from 'debug';

const debug = Debug('app:ssmUtils');

export const determineScriptExtension = (shell: string): string => {
    switch (shell) {
        case 'powershell': return '.ps1';
        case 'python': return '.py';
        default: return '.sh';
    }
};

export const getExecuteCommand = (shell: string, filePath: string): string => {
    switch (shell) {
        case 'powershell': return `Powershell -File ${filePath}`;
        case 'python': return `python ${filePath}`;
        default: return `bash ${filePath}`;
    }
};

export const executeCommand = async (
    ssmClient: AWS.SSM,
    command: string,
    instanceId: string,
    documentName: string,
    timeout: number = 60,  // Increased default timeout
    directory?: string,
    retries: number = 3    // Default retries set to 3
): Promise<{ stdout?: string; stderr?: string; pages?: string[]; totalPages?: number; responseId?: string }> => {
    if (!command) {
        debug(`Error: No command provided for execution.`);
        throw new Error('No command provided for execution.');
    }

    debug(`Executing command: ${command}`);
    const formattedCommand = documentName.includes('ShellScript')
        ? (directory ? `cd ${directory}; ${command}` : command)
        : (directory ? `Set-Location -Path '${directory}'; ${command}` : command);

    const params: AWS.SSM.SendCommandRequest = {
        InstanceIds: [instanceId],
        DocumentName: documentName,
        Parameters: { 'commands': [formattedCommand] },
        TimeoutSeconds: timeout
    };

    let attempt = 0;
    while (attempt < retries) {
        try {
            const commandResponse = await ssmClient.sendCommand(params).promise();
            if (!commandResponse.Command || !commandResponse.Command.CommandId) {
                debug(`Failed to retrieve command response or CommandId is undefined.`);
                throw new Error('Failed to retrieve command response or CommandId is undefined.');
            }

            const result = await ssmClient.getCommandInvocation({
                CommandId: commandResponse.Command.CommandId,
                InstanceId: instanceId,
            }).promise();

            if (result && result.StandardOutputContent) {
                const pages = paginateOutput(result.StandardOutputContent);

                return {
                    stdout: result.StandardOutputContent,
                    stderr: result.StandardErrorContent,
                    pages,
                    totalPages: pages.length,
                    responseId: uuidv4()
                };
            } else {
                debug(`Command execution failed with status: ${result.Status}`);
                throw new Error(`Command execution failed with status: ${result.Status}`);
            }
        } catch (error) {
            if (attempt >= retries - 1) {
                debug(`Command execution failed after ${retries} attempts.`);
                throw error;
            }
            attempt++;
            debug(`Attempt ${attempt}: Command failed, retrying...`, error);
            await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds before retrying
        }
    }
    throw new Error("Command execution failed after retries");
};

const paginateOutput = (stdout: string, linesPerPage: number = 100): string[] => {
    const pages: string[] = [];
    if (stdout) {
        const lines = stdout.split('\n');
        for (let i = 0; i < lines.length; i += linesPerPage) {
            pages.push(lines.slice(i, i + linesPerPage).join('\n'));
        }
    }
    return pages;
};

export const createTempScript = async (
    scriptContent: string,
    scriptExtension: string,
    directory: string
): Promise<string> => {
    const tempFileName = `${uuidv4()}${scriptExtension}`;
    const tempFilePath = path.join(directory, tempFileName);
    debug(`Creating temporary script at: ${tempFilePath}`);
    fs.writeFileSync(tempFilePath, scriptContent, { mode: 0o700 }); // Setting secure permissions
    return tempFilePath;
};
