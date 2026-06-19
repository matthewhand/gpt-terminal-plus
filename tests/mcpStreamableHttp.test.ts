/**
 * Integration test: MCP Streamable HTTP transport.
 *
 * Spins up a minimal Express app with the real MCP endpoint mounted at /mcp
 * (the deprecated SSE transport at /mcp/messages was removed) and drives it
 * with the official MCP SDK client over Streamable HTTP, asserting that real
 * tool results round-trip back to the client.
 */
process.env.API_TOKEN = process.env.API_TOKEN || "test-mcp-token";

import express from "express";
import fs from "fs";
import os from "os";
import path from "path";
import type { Server } from "http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { setupMcpServer } from "@modules/mcpServer";

const TOKEN = process.env.API_TOKEN as string;

describe("MCP Streamable HTTP endpoint", () => {
  let httpServer: Server;
  let baseUrl: string;
  let client: Client;
  let tmpDir: string;

  beforeAll(async () => {
    const { _resetGlobalStateForTests } = require('../src/utils/GlobalStateHelper');
    const { __clearSessionsForTests } = require('../src/session/ShellSessionDriver');
    _resetGlobalStateForTests();
    __clearSessionsForTests();
    // Fixtures live INSIDE the workspace so read_file goes through the real,
    // workspace-confined handler (no prod test-only bypass). Own mkdtemp subdir
    // under tmp/ keeps it isolated from sibling suites in parallel runs.
    const repoRoot = path.resolve(__dirname, "..");
    const baseTmp = path.join(repoRoot, "tmp");
    fs.mkdirSync(baseTmp, { recursive: true });
    tmpDir = fs.mkdtempSync(path.join(baseTmp, "mcp-test-"));
    fs.writeFileSync(path.join(tmpDir, "hello.txt"), "hello mcp\n");

    const app = express();
    app.use(express.json());
    setupMcpServer(app);

    await new Promise<void>((resolve) => {
      httpServer = app.listen(0, () => resolve());
    });
    const address = httpServer.address();
    if (!address || typeof address === "string") throw new Error("No ephemeral port");
    baseUrl = `http://127.0.0.1:${address.port}/mcp`;

    client = new Client({ name: "jest-mcp-client", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(baseUrl), {
      requestInit: { headers: { Authorization: `Bearer ${TOKEN}` } },
    });
    await client.connect(transport);
  }, 30000);

  afterAll(async () => {
    try { await client?.close(); } catch (e) { e; /* ignore */ }
    await new Promise<void>((resolve) => httpServer?.close(() => resolve()));
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("rejects requests without a bearer token", async () => {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
    });
    expect(res.status).toBe(401);
  });

  it("lists spec-valid tool names (no slashes)", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "execute_command",
        "execute_code",
        "execute_llm",
        "change_directory",
        "create_file",
        "read_file",
        "list_files",
        "fuzzy_patch_file",
        "list_servers",
        "server_set",
        "model_list",
        "model_select",
        "model_current",
      ])
    );
    for (const name of names) {
      expect(name).toMatch(/^[a-zA-Z0-9_-]{1,64}$/);
    }
  });

  it("execute_command round-trips real stdout", async () => {
    const result: any = await client.callTool({
      name: "execute_command",
      arguments: { command: "echo mcp-roundtrip-ok" },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(result.content[0].text);
    expect(payload.stdout).toContain("mcp-roundtrip-ok");
    expect(payload.exitCode ?? payload.error ?? 0).toBeFalsy();
  }, 20000);

  it("list_files round-trips a real directory listing", async () => {
    const result: any = await client.callTool({
      name: "list_files",
      arguments: { directory: tmpDir },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(result.content[0].text);
    const items = (payload.items ?? payload.files ?? []).map((f: any) =>
      typeof f === "string" ? f : f.name
    );
    expect(items).toContain("hello.txt");
  }, 20000);

  it("read_file returns real file content", async () => {
    const result: any = await client.callTool({
      name: "read_file",
      arguments: { filePath: path.join(tmpDir, "hello.txt") },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(result.content[0].text);
    expect(payload.content).toContain("hello mcp");
  }, 20000);

  it("list_servers reports the selected server", async () => {
    const result: any = await client.callTool({ name: "list_servers", arguments: {} });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(result.content[0].text);
    expect(payload.selected).toBeTruthy();
    expect(Array.isArray(payload.configured)).toBe(true);
  });

  it("server_set returns REAL system info (not a dummy stub)", async () => {
    const result: any = await client.callTool({
      name: "server_set",
      arguments: { server: "local", getSystemInfo: true },
    });
    expect(result.isError).toBeFalsy();
    const payload = JSON.parse(result.content[0].text);
    expect(payload.selected).toBe("local");
    expect(payload.systemInfo).toBeTruthy();
    // The old stub returned { info: "dummy" }; real getSystemInfo reports actual fields.
    expect(payload.systemInfo.info).toBeUndefined();
    const keys = Object.keys(payload.systemInfo);
    expect(keys.length).toBeGreaterThan(1);
  });

  it("server_set omits system info when not requested", async () => {
    const result: any = await client.callTool({
      name: "server_set",
      arguments: { server: "local" },
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.systemInfo).toBeNull();
  });
});
