declare module '@modelcontextprotocol/sdk/server/mcp' {
  export interface McpServerConfig {
    name: string;
    version: string;
  }
  export class McpServer {
    constructor(config: McpServerConfig);
    tool(name: string, inputSchema: any, handler: (args: any) => Promise<any>): void;
    connect(transport: any): Promise<void>;
  }
}

declare module '@modelcontextprotocol/sdk/server/sse' {
  export class SSEServerTransport {
    constructor(endpoint: string, res?: any);
    handlePostMessage(req: any, res: any): Promise<void>;
  }
}