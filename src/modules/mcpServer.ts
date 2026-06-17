import { randomUUID } from "node:crypto";
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { registerMcpTools } from "./mcpTools";
import { checkAuthToken } from "../middlewares/checkAuthToken";

// NOTE: the deprecated SSE transport (GET /mcp/messages) was removed in favor
// of the MCP Streamable HTTP transport (spec 2025-03-26+), which modern
// agentic frameworks (Hermes Agent, NVIDIA NemoClaw OpenShell, Claude, etc.)
// expect. Sessions are negotiated via the `mcp-session-id` header.

/**
 * Mounts the MCP Streamable HTTP endpoint on the given Express app:
 *   POST   /mcp  — JSON-RPC requests (initialize creates a session)
 *   GET    /mcp  — server-to-client notification stream (SSE within Streamable HTTP)
 *   DELETE /mcp  — session termination
 *
 * All methods require the standard bearer token (same as the REST API).
 */
export function setupMcpServer(app: express.Application, basePath = "/mcp"): void {
  // session id -> active transport
  const transports: Record<string, StreamableHTTPServerTransport> = {};

  app.post(basePath, checkAuthToken as any, async (req, res) => {
    try {
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        // Existing session
        transport = transports[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request — create a session and a server instance
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid: string) => {
            transports[sid] = transport;
          },
        });
        transport.onclose = () => {
          if (transport.sessionId) delete transports[transport.sessionId];
        };

        const mcpServer = new McpServer({ name: "gpt-terminal-plus", version: "1.0.0" });
        registerMcpTools(mcpServer);
        await mcpServer.connect(transport);
      } else {
        res.status(400).json({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Bad Request: No valid session ID provided" },
          id: null,
        });
        return;
      }

      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error: " + (err as Error).message },
          id: null,
        });
      }
    }
  });

  // GET (notification stream) and DELETE (session termination) share lookup logic
  const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    const transport = sessionId ? transports[sessionId] : undefined;
    if (!transport) {
      res.status(400).send("Invalid or missing mcp-session-id header");
      return;
    }
    await transport.handleRequest(req, res);
  };

  app.get(basePath, checkAuthToken as any, handleSessionRequest);
  app.delete(basePath, checkAuthToken as any, handleSessionRequest);

  console.log(`MCP server initialized with Streamable HTTP transport at ${basePath}`);
}
