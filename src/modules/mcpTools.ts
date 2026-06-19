import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { changeDirectory, executeCommand, executeCode, executeLlm } from "../routes/command";
import { createFile } from "../routes/file";
// readFileRoute available from file routes if needed for MCP
import { applyFuzzyPatch } from "../routes/file/fuzzyPatch";
import { LocalServerHandler } from "../handlers/local/LocalServerHandler";
import { getSupportedModels, isSupportedModel } from "../common/models";
import { getSelectedModel, setSelectedModel, getSelectedServer, setSelectedServer } from "../utils/GlobalStateHelper";
import { ServerManager } from "../managers/ServerManager";

/**
 * Registers MCP tools to expose Express routes as discoverable MCP tools.
 * Each tool wraps an existing Express route handler.
 */
function makeFakeReq(body: any = {}) {
  const localHandler = new LocalServerHandler({ protocol: "local", hostname: "localhost", code: false } as any);
  return { body, server: localHandler, serverHandler: localHandler } as any;
}

function makeCapturingRes() {
  let captured: any = null;
  const res: any = {
    statusCode: 200,
    status(code: number) { this.statusCode = code; return this; },
    json(data: any) { captured = data; return this; },
    send(data: any) { captured = data; return this; }
  };
  return {
    res,
    getCaptured: () => captured
  };
}

export const registerMcpTools = (server: McpServer) => {
  // Command Tools - use flat names for spec compliance (no slashes) and test expectations

  // Change Directory Tool
  server.tool(
    "change_directory",
    {
      directory: z.string()
    } as any,
    async ({ directory }: { directory: string }) => {
      const req = makeFakeReq({ directory });
      const { res, getCaptured } = makeCapturingRes();
      await changeDirectory(req, res);
      const data = getCaptured() || { message: "ok" };
      return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
    }
  );

  // Execute Command Tool
  server.tool(
    "execute_command",
    {
      command: z.string(),
      shell: z.enum(["powershell", "bash"]).default("bash")
    } as any,
    async ({ command, shell }: { command: string, shell: "powershell" | "bash" }) => {
      const req = makeFakeReq({ command, shell });
      const { res, getCaptured } = makeCapturingRes();
      await executeCommand(req, res);
      let data: any = getCaptured() || { stdout: "", stderr: "", exitCode: 0 };
      if (data && data.result) data = data.result; // unnest common wrapper for test compat
      return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
    }
  );

  // Execute Code Tool
  server.tool(
    "execute_code",
    {
      code: z.string(),
      language: z.enum(["python", "typescript"])
    } as any,
    async ({ code, language }: { code: string, language: "python" | "typescript" }) => {
      const req = makeFakeReq({ code, language });
      const { res, getCaptured } = makeCapturingRes();
      await executeCode(req, res);
      const data = getCaptured() || { result: { stdout: "", exitCode: 0 } };
      return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
    }
  );

  // Execute LLM Tool
  server.tool(
    "execute_llm",
    {
      instructions: z.string(),
      dryRun: z.boolean().optional()
    } as any,
    async ({ instructions, dryRun }: { instructions: string, dryRun?: boolean }) => {
      const req = makeFakeReq({ instructions, dryRun });
      const { res, getCaptured } = makeCapturingRes();
      await executeLlm(req, res);
      const data = getCaptured() || { result: "ok" };
      return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
    }
  );

  // File Tools

  // Create File Tool (maps dir+file or filePath)
  server.tool(
    "create_file",
    {
      directory: z.string().optional(),
      filename: z.string().optional(),
      filePath: z.string().optional(),
      content: z.string()
    } as any,
    async (args: any) => {
      let filePath = args.filePath;
      if (!filePath && args.filename) {
        filePath = args.directory ? `${args.directory.replace(/\/$/, '')}/${args.filename}` : args.filename;
      }
      const req = makeFakeReq({ filePath, content: args.content });
      const { res, getCaptured } = makeCapturingRes();
      await createFile(req, res);
      const data = getCaptured() || {};
      return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
    }
  );

  // Read File Tool — always goes through the workspace-confined local handler.
  server.tool(
    "read_file",
    {
      filePath: z.string()
    } as any,
    async ({ filePath }: { filePath: string }) => {
      try {
        const localHandler = new LocalServerHandler({ protocol: "local", hostname: "localhost", code: false } as any);
        const content = await (localHandler as any).readFile(filePath);
        const payload = typeof content === 'string' ? { content } : (content || {});
        return { content: [{ type: "text" as const, text: JSON.stringify(payload) }] };
      } catch (e: any) {
        return { content: [{ type: "text" as const, text: JSON.stringify({ content: '', error: e.message }) }] };
      }
    }
  );

  // List Files Tool
  server.tool(
    "list_files",
    {
      directory: z.string(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      orderBy: z.enum(["datetime", "filename"]).optional(),
      recursive: z.boolean().optional(),
      typeFilter: z.enum(["files", "folders"]).optional()
    } as any,
    async (params: any) => {
      const localHandler = new LocalServerHandler({ protocol: "local", hostname: "localhost", code: false } as any);
      const result = await localHandler.listFiles(params);
      return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
    }
  );

  // Fuzzy Patch Tool
  server.tool(
    "fuzzy_patch_file",
    {
      filePath: z.string(),
      oldText: z.string().optional(),
      newText: z.string().optional(),
      instructions: z.string().optional()
    } as any,
    async (args: any) => {
      const req = makeFakeReq({ filePath: args.filePath, oldText: args.oldText, newText: args.newText, instructions: args.instructions });
      const { res, getCaptured } = makeCapturingRes();
      await applyFuzzyPatch(req, res);
      const data = getCaptured() || {};
      return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
    }
  );

  // Server Tools
  server.tool(
    "list_servers",
    {},
    async () => {
      const sm = ServerManager.getInstance ? ServerManager.getInstance() : null;
      const configured = sm && sm.listServers ? sm.listServers() : [];
      const selected = getSelectedServer ? getSelectedServer() : 'local';
      const payload = { selected, configured: Array.isArray(configured) ? configured : [] };
      return { content: [{ type: "text" as const, text: JSON.stringify(payload) }] };
    }
  );

  server.tool(
    "server_set",
    {
      server: z.string(),
      getSystemInfo: z.boolean().optional()
    } as any,
    async ({ server: serverName, getSystemInfo }: { server: string; getSystemInfo?: boolean }) => {
      try { if (setSelectedServer) setSelectedServer(serverName); } catch {}
      let systemInfo: unknown = null;
      if (getSystemInfo) {
        try {
          const localHandler = new LocalServerHandler({ protocol: "local", hostname: "localhost", code: false } as any);
          systemInfo = await localHandler.getSystemInfo();
        } catch (e: any) {
          systemInfo = { error: e?.message || 'failed to collect system info' };
        }
      }
      const result = { message: `Server set to ${serverName}`, systemInfo, selected: serverName };
      return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
    }
  );

  // Model Tools
  server.tool(
    "model_list",
    {},
    async () => {
      const supported = getSupportedModels();
      const selected = getSelectedModel();
      return { content: [{ type: "text" as const, text: JSON.stringify({ supported, selected }) }] };
    }
  );

  server.tool(
    "model_select",
    {
      model: z.string()
    } as any,
    async ({ model }: { model: string }) => {
      if (!isSupportedModel(model)) {
        return { content: [{ type: "text" as const, text: JSON.stringify({ error: 'Unsupported model', model }) }] };
      }
      setSelectedModel(model);
      const selected = getSelectedModel();
      return { content: [{ type: "text" as const, text: JSON.stringify({ selected }) }] };
    }
  );

  server.tool(
    "model_current",
    {},
    async () => {
      const selected = getSelectedModel();
      return { content: [{ type: "text" as const, text: JSON.stringify({ selected }) }] };
    }
  );
};
