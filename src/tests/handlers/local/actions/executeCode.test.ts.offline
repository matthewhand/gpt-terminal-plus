/**
 * @fileoverview Tests for the executeCode function.
 */

import { expect } from 'chai';
import { executeCode } from '@src/handlers/local/actions/executeCode';
import sinon from 'sinon';
import * as child_process from 'child_process';

describe('executeCode', () => {
  let execStub: sinon.SinonStub;

  beforeEach(() => {
    execStub = sinon.stub(child_process, 'exec');
  });

  afterEach(() => {
    execStub.restore();
  });

  it('should execute code in Python successfully', async () => {
    console.log('Test Case: Execute Python code successfully');
    execStub.yields(null, 'Hello, World!\n', '');

    const result = await executeCode('print("Hello, World!")', 0); // Changed parameter type to number

    console.log(`executeCode returned stdout: ${result.stdout}, stderr: ${result.stderr}`);

    expect(execStub.calledOnce).to.be.true;
    expect(result.stdout.trim()).toBe('Hello, World!');
    expect(result.stderr).toBe('');
  });

  it('should handle execution errors', async () => {
    console.log('Test Case: Handle execution errors');
    execStub.yields(new Error('Execution failed'), '', 'Error message');

    try {
      await executeCode('print("Hello, World!"', 0); // Changed parameter type to number
      expect.fail('Expected error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Caught error: ${error.message}`);
        expect(error.message).to.include('Failed to execute code');
      } else {
        throw error;
      }
    }
  });

  it('should validate input parameters', async () => {
    console.log('Test Case: Validate input parameters');
    try {
      await executeCode('', 0); // Changed parameter type to number
      expect.fail('Expected error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Caught error: ${error.message}`);
        expect(error.message).toBe('Code is required for execution.');
      } else {
        throw error;
      }
    }

    try {
      await executeCode('print("Hello")', 0); // Changed parameter type to number
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
