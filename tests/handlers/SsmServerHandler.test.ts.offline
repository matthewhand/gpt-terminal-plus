import AWS from 'aws-sdk';
import { mocked } from 'jest-mock';
import SsmServerHandler from '../../src/handlers/SsmServerHandler'; // Adjust path as necessary
import { ServerConfig } from '../../src/types'; // Adjust path as necessary

// Mock the AWS SDK SSM service
jest.mock('aws-sdk', () => ({
  SSM: jest.fn().mockImplementation(() => ({
    sendCommand: jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve({ Command: { CommandId: '12345' } })
    })),
    getCommandInvocation: jest.fn().mockImplementation(() => ({
      promise: () => Promise.resolve({
        Status: 'Success',
        StandardOutputContent: 'Test output',
        StandardErrorContent: ''
      })
    }))
  }))
})
);

const mockedAWS = mocked(AWS.SSM); // Wrap AWS.SSM for type-safe mocking

// Server configuration for testing
const mockServerConfig: ServerConfig = {
  host: 'example-host',
  instanceId: 'i-0123456789abcdef0',
  region: 'us-west-2',
  protocol: 'ssm',
  posix: true,
  username: 'ec2-user',
  homeFolder: '/home/ec2-user'
};

describe('SsmServerHandler Basic Execution Test', () => {
  let ssmServerHandler: SsmServerHandler;

  beforeEach(() => {
    // Instantiate a new SsmServerHandler before each test
    ssmServerHandler = new SsmServerHandler(mockServerConfig);
  });

  it('should execute a simple command and return the output', async () => {
    const command = 'echo "Hello, World!"';
    // Options could include timeout, directory, etc., depending on the method signature
    const options = { timeout: 60, directory: '/tmp' };

    // Execute the command using the SsmServerHandler
    const result = await ssmServerHandler.executeCommand(command, options);

    // Assertions to check if the command was executed successfully
    expect(result.stdout).toEqual('Test output');
    expect(result.stderr).toEqual('');
    expect(mockedAWS.prototype.sendCommand).toHaveBeenCalledTimes(1);
    expect(mockedAWS.prototype.getCommandInvocation).toHaveBeenCalled();
  });

  afterEach(() => {
    // Reset mocks after each test to prevent test leakage
    jest.resetAllMocks();
  });
});

export {};
