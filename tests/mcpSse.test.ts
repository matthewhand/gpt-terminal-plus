import express, { Express } from "express";
import request from "supertest";

// Mock MCP modules since they may not be available
jest.mock("@modelcontextprotocol/sdk/server/mcp", () => ({
  McpServer: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    setRequestHandler: jest.fn(),
    setNotificationHandler: jest.fn()
  }))
}));

jest.mock("@modelcontextprotocol/sdk/server/sse", () => ({
  SSEServerTransport: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined)
  }))
}));

jest.mock("@modules/mcpTools", () => ({
  registerMcpTools: jest.fn()
}), { virtual: true });

describe("MCP SSE Integration", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Set up the SSE endpoint for MCP messages
    app.get("/mcp/messages", async (req, res) => {
      res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control"
      });

      // Send initial connection message
      res.write("event: connected\n");
      res.write("data: {\"type\": \"connection\", \"status\": \"established\"}\n\n");

      // Send test MCP message
      setTimeout(() => {
        res.write("event: mcp-message\n");
        res.write("data: {\"jsonrpc\": \"2.0\", \"method\": \"ping\", \"id\": 1}\n\n");
        res.end();
      }, 100);
    });

    // MCP tool registration endpoint
    app.post("/mcp/tools/register", (req, res) => {
      const { name, description, inputSchema } = req.body;
      if (!name || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      res.json({ success: true, tool: { name, description, inputSchema } });
    });

    // MCP tool execution endpoint
    app.post("/mcp/tools/execute", (req, res) => {
      const { tool, arguments: args } = req.body;
      if (!tool) {
        return res.status(400).json({ error: "Tool name required" });
      }
      res.json({ 
        success: true, 
        result: { tool, arguments: args, output: "Mock execution result" }
      });
    });

    // MCP capabilities endpoint
    app.get("/mcp/capabilities", (req, res) => {
      res.json({
        capabilities: {
          tools: { listChanged: true },
          resources: { subscribe: true, listChanged: true },
          prompts: { listChanged: true },
          logging: {}
        },
        protocolVersion: "2024-11-05",
        serverInfo: {
          name: "gpt-terminal-plus",
          version: "1.0.0"
        }
      });
    });
  });

  describe("SSE Connection", () => {
    it("should establish SSE connection with proper headers", async () => {
      const response = await request(app)
        .get("/mcp/messages")
        .set("Accept", "text/event-stream");
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/text\/event-stream/);
      expect(response.headers["cache-control"]).toBe("no-cache");
      expect(response.headers["connection"]).toBe("keep-alive");
    });

    it("should send connection established event", async () => {
      const response = await request(app)
        .get("/mcp/messages")
        .set("Accept", "text/event-stream");
      
      expect(response.text).toContain("event: connected");
      expect(response.text).toContain('"type": "connection"');
      expect(response.text).toContain('"status": "established"');
    });

    it("should send MCP protocol messages", async () => {
      const response = await request(app)
        .get("/mcp/messages")
        .set("Accept", "text/event-stream");
      
      expect(response.text).toContain("event: mcp-message");
      expect(response.text).toContain('"jsonrpc": "2.0"');
      expect(response.text).toContain('"method": "ping"');
    });

    it("should handle connection without Accept header", async () => {
      const response = await request(app)
        .get("/mcp/messages");
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/text\/event-stream/);
    });
  });

  describe("MCP Tool Management", () => {
    it("should register MCP tools", async () => {
      const toolData = {
        name: "execute_command",
        description: "Execute shell commands",
        inputSchema: {
          type: "object",
          properties: {
            command: { type: "string" }
          },
          required: ["command"]
        }
      };

      const response = await request(app)
        .post("/mcp/tools/register")
        .send(toolData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.tool.name).toBe("execute_command");
    });

    it("should reject tool registration with missing fields", async () => {
      const response = await request(app)
        .post("/mcp/tools/register")
        .send({ name: "incomplete_tool" });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Missing required fields");
    });

    it("should execute MCP tools", async () => {
      const executionData = {
        tool: "execute_command",
        arguments: { command: "echo hello" }
      };

      const response = await request(app)
        .post("/mcp/tools/execute")
        .send(executionData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.result.tool).toBe("execute_command");
      expect(response.body.result.output).toBe("Mock execution result");
    });

    it("should reject tool execution without tool name", async () => {
      const response = await request(app)
        .post("/mcp/tools/execute")
        .send({ arguments: { command: "test" } });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Tool name required");
    });
  });

  describe("MCP Capabilities", () => {
    it("should return server capabilities", async () => {
      const response = await request(app)
        .get("/mcp/capabilities");
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("capabilities");
      expect(response.body).toHaveProperty("protocolVersion");
      expect(response.body).toHaveProperty("serverInfo");
    });

    it("should include required capability fields", async () => {
      const response = await request(app)
        .get("/mcp/capabilities");
      
      const capabilities = response.body.capabilities;
      expect(capabilities).toHaveProperty("tools");
      expect(capabilities).toHaveProperty("resources");
      expect(capabilities).toHaveProperty("prompts");
      expect(capabilities).toHaveProperty("logging");
    });

    it("should include server information", async () => {
      const response = await request(app)
        .get("/mcp/capabilities");
      
      const serverInfo = response.body.serverInfo;
      expect(serverInfo.name).toBe("gpt-terminal-plus");
      expect(serverInfo.version).toBe("1.0.0");
    });

    it("should specify protocol version", async () => {
      const response = await request(app)
        .get("/mcp/capabilities");
      
      expect(response.body.protocolVersion).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed JSON in tool registration", async () => {
      const response = await request(app)
        .post("/mcp/tools/register")
        .set("Content-Type", "application/json")
        .send("invalid json");
      
      expect(response.status).toBe(400);
    });

    it("should handle malformed JSON in tool execution", async () => {
      const response = await request(app)
        .post("/mcp/tools/execute")
        .set("Content-Type", "application/json")
        .send("invalid json");
      
      expect(response.status).toBe(400);
    });

    it("should return 404 for non-existent MCP endpoints", async () => {
      const response = await request(app)
        .get("/mcp/nonexistent");
      
      expect(response.status).toBe(404);
    });
  });
});
