/**
 * @fileoverview Tests for the executeCommand function.
 */

import { expect } from 'chai';
import { executeCommand } from '@src/handlers/local/actions/executeCommand';
import sinon from 'sinon';
import * as child_process from 'child_process';

describe('executeCommand', () => {
  let execStub: sinon.SinonStub;

  beforeEach(() => {
    execStub = sinon.stub(child_process, 'exec');
  });

  afterEach(() => {
    execStub.restore();
  });

  it('should execute a valid command successfully', async () => {
    console.log('Test Case: Execute valid command');
    execStub.yields(null, 'Hello, World!\n', '');

    const result = await executeCommand('echo "Hello, World!"', 0); // Changed parameter type to number

    console.log(`executeCommand returned stdout: ${result.stdout}, stderr: ${result.stderr}`);

    expect(execStub.calledOnce).to.be.true;
    expect(result.stdout.trim()).toBe('Hello, World!');
    expect(result.stderr).toBe('');
  });

  it('should handle command execution errors', async () => {
    console.log('Test Case: Handle command execution errors');
    execStub.yields(new Error('Execution failed'), '', 'Error message');

    try {
      await executeCommand('invalidcommand', 0); // Changed parameter type to number
      expect.fail('Expected error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Caught error: ${error.message}`);
        expect(error.message).toBe('Execution failed');
      } else {
        throw error;
      }
    }
  });

  it('should validate input parameters', async () => {
    console.log('Test Case: Validate input parameters');
    try {
      // @ts-ignore
      await executeCommand(null, 0); // Changed parameter type to number
      expect.fail('Expected error was not thrown for null command');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Caught error: ${error.message}`);
        expect(error.message).toBe('A valid command string must be provided.');
      } else {
        throw error;
      }
    }

    try {
      await executeCommand('print("Hello")', 0); // Changed parameter type to number
      expect.fail('Expected error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Caught error: ${error.message}`);
        expect(error.message).toBe('Language is required for code execution.');
      } else {
        throw error;
      }
    }
  });
});
