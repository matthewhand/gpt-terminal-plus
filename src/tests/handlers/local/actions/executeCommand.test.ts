/* 
  Updated tests for executeCommand using jest.isolateModules to correctly isolate module imports 
  based on the USE_EXECFILE environment variable.
*/

describe('executeCommand with execFile (USE_EXECFILE=true)', () => {
    beforeEach(() => {
        process.env.USE_EXECFILE = 'true';
        jest.resetModules();
    });

    it('should execute command using execFile and return output', async () => {
        const { executeCommand } = require('@src/handlers/local/actions/executeCommand');
        const childProcess = require('child_process');
        // Ensure execFile is mocked as a jest function.
        childProcess.execFile = jest.fn((cmd, args, options, callback) => {
            callback(null, 'command output', '');
        });

        const command = 'ls -l';
        const result = await executeCommand(command);
        expect(result).toEqual(expect.objectContaining({ stdout: 'command output' }));
        expect(childProcess.execFile).toHaveBeenCalled();
    });

    it('should reject if execFile returns an error', async () => {
        const { executeCommand } = require('@src/handlers/local/actions/executeCommand');
        const childProcess = require('child_process');
        childProcess.execFile = jest.fn((cmd, args, options, callback) => {
            callback(new Error('execFile error'), '', '');
        });

        const command = 'invalid-command';
        await expect(executeCommand(command)).rejects.toEqual(
            expect.objectContaining({ stdout: '', stderr: '', presentWorkingDirectory: expect.any(String) })
        );
    });
});

describe('executeCommand with exec (USE_EXECFILE=false)', () => {
    beforeEach(() => {
        process.env.USE_EXECFILE = 'false';
        jest.resetModules();
    });

    it('should execute command using exec and return output', async () => {
        const { executeCommand } = require('@src/handlers/local/actions/executeCommand');
        const childProcess = require('child_process');
        childProcess.exec = jest.fn((cmd, options, callback) => {
            callback(null, 'exec output', '');
        });

        const command = 'echo hello';
        const result = await executeCommand(command);
        expect(result).toEqual(expect.objectContaining({ stdout: 'exec output' }));
        expect(childProcess.exec).toHaveBeenCalled();
    });

    it('should reject if exec returns an error', async () => {
        const { executeCommand } = require('@src/handlers/local/actions/executeCommand');
        const childProcess = require('child_process');
        childProcess.exec = jest.fn((cmd, options, callback) => {
            callback(new Error('exec error'), '', '');
        });

        const command = 'non-existent-command';
        await expect(executeCommand(command)).rejects.toEqual(
            expect.objectContaining({ stdout: '', stderr: '', presentWorkingDirectory: expect.any(String) })
        );
    });
});
