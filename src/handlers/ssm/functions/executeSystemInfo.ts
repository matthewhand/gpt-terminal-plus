import * as AWS from 'aws-sdk';

/**
 * Executes a system info command on an SSM instance.
 * @param ssmClient - The SSM client.
 * @param instanceId - The ID of the instance.
 * @param command - The command to execute.
 * @returns The system info as a string.
 */
export async function executeSystemInfo(ssmClient: AWS.SSM, instanceId: string, command: string): Promise<string> {
    const params = {
        InstanceIds: [instanceId],
        DocumentName: 'AWS-RunShellScript',
        Parameters: { commands: [command] }
    };

    try {
        const commandOutput = await ssmClient.sendCommand(params).promise();
        return commandOutput.Command?.StatusDetails || '';
    } catch (error) {
        console.error(`Failed to execute system info command: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}
