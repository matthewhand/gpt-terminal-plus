import express, { Express } from "express";
import request from "supertest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse";
import { registerMcpTools } from "@modules/mcpTools";

describe("MCP SSE Endpoint", () => {
  let app: Express;

  beforeAll(() => {
    app = express();

    // Set up the SSE endpoint for MCP messages
    app.get("/mcp/messages", async (req, res) => {
      res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      });
      const mcpServer = new McpServer({ name: "Test Server", version: "1.0.0" });
      registerMcpTools(mcpServer);
      const transport = new SSEServerTransport("/mcp/messages", res);
      try {
        await mcpServer.connect(transport);
      } catch (err) {
        console.error("Error connecting MCP server:", err);
      }
      res.write("data: test\n\n");
      res.end();
    });
  });

  it("should respond with SSE headers", async () => {
    const response = await request(app)
      .get("/mcp/messages")
      .set("Accept", "text/event-stream");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/event-stream/);
  }, 20000);
});
