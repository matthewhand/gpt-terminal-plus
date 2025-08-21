/* Minimal, permissive ambient declarations to relax AWS SDK v3 SSM typings for Jest mocks.
   This intentionally broadens generics so mockClient.send(... as any) is acceptable. */

declare module '@aws-sdk/client-ssm' {
  // Constructors are permissive; details are not needed for tests
  export class SSMClient {
    constructor(...args: any[]);
    // Loosen send signature for mocks
    send(command: any, ...args: any[]): Promise<any>;
  }

  export class SendCommandCommand {
    constructor(...args: any[]);
  }

  export class GetCommandInvocationCommand {
    constructor(...args: any[]);
  }

  // Common shapes used in tests; make them indexable
  export interface SendCommandCommandOutput {
    [key: string]: any;
  }

  export interface GetCommandInvocationCommandOutput {
    [key: string]: any;
    Status?: string;
    StandardOutputContent?: string;
    StandardErrorContent?: string;
  }
}