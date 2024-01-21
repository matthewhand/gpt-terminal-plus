const mockServerConfig: ServerConfig = {
    host: 'ubuntu-gtx',
    instanceId: 'mi-018ff0cf808611ed0',
    region: 'us-west-2',
    protocol: 'ssm',
    posix: true,
    // ... other necessary properties
  };

import SsmServerHandler from '../../src/handlers/SsmServerHandler';
import { ServerConfig } from '../../src/types';
import AWS from 'aws-sdk';

// Create a mock instance of AWS.SSM
const mockSsmInstance = {
  sendCommand: jest.fn().mockImplementation(() => ({
    promise: jest.fn().mockResolvedValue({
      Command: { CommandId: 'testCommandId' }
    })
  })),
  getCommandInvocation: jest.fn().mockImplementation(() => ({
    promise: jest.fn().mockResolvedValue({
      Status: 'Success',
      StandardOutputContent: 'hello\n',
      StandardErrorContent: ''
    })
  }))
};

// Mock the SSM constructor to return the mock instance
jest.mock('aws-sdk', () => {
  return {
    SSM: jest.fn(() => mockSsmInstance)
  };
});

 
describe('SsmServerHandler Tests', () => {
  let ssmServerHandler: SsmServerHandler;

  beforeEach(() => {
    ssmServerHandler = new SsmServerHandler(mockServerConfig);
  });

  it('should execute a command on the SSM server', async () => {
    const testCommand = 'echo hello';
    await ssmServerHandler.executeCommand(testCommand);
  
    // Asserting the mock functions directly
    expect(mockSsmInstance.sendCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        DocumentName: 'AWS-RunShellScript',
        Parameters: { commands: [testCommand] }
      })
    );
  
    expect(mockSsmInstance.getCommandInvocation).toHaveBeenCalledWith(
      expect.anything()
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

export {};
