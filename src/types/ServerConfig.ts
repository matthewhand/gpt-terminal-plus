/**
 * Interface representing the configuration options for a server.
 */
import * as AWS from 'aws-sdk';

export interface ServerConfig {
  /**
   * Indicates whether cleanup scripts should be executed.
   * @default false
   */
  cleanupScripts?: boolean;

  /**
   * The host address of the server.
   */
  host: string;

  /**
   * The path to the private key file for authentication.
   */
  privateKeyPath?: string;

  /**
   * The path to the key file for authentication.
   */
  keyPath?: string;

  /**
   * Indicates whether the server is running a POSIX-compliant operating system.
   * @default false
   */
  posix?: boolean;

  /**
   * Specifies the system information script to use.
   * Supported value: 'python'
   */
  systemInfo?: 'python';

  /**
   * The port number to connect to the server.
   */
  port?: number;

  /**
   * Indicates whether code execution is enabled.
   * @default false
   */
  code?: boolean;

  /**
   * The username for authentication.
   */
  username?: string;

  /**
   * The protocol used to connect to the server.
   * Supported values: 'ssh', 'ssm', 'local'
   */
  protocol?: 'ssh' | 'ssm' | 'local';

  /**
   * The default shell to use for executing commands.
   */
  shell?: string;

  /**
   * The AWS region where the instance is located.
   */
  region?: string;

  /**
   * The ID of the AWS instance to connect to.
   */
  instanceId?: string;

  /**
   * The home folder path on the server.
   */
  homeFolder?: string;

  /**
   * The ID of the container running on the server.
   */
  containerId?: number;

  /**
   * A list of tasks to be performed on the server.
   */
  tasks?: string[];

  /**
   * The folder path where scripts are located.
   */
  scriptFolder?: string;

  /**
   * The default folder to use for operations.
   */
  defaultFolder?: string;

  /**
   * The SSM client for AWS operations.
   */
  // TODO extend so to keep this interface generic and free of protocol specifics
  ssmClient?: AWS.SSM; // Added ssmClient property
}
