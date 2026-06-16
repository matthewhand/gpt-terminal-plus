import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs";
import { ServerManager } from "../managers/ServerManager";
import { listAllServers } from "../managers/serverList";
import { getSupportedModels, isSupportedModel } from "../common/models";
import {
  getSelectedModel,
  setSelectedModel,
  getSelectedServer,
  setSelectedServer,
  getPresentWorkingDirectory,
  setPresentWorkingDirectory,
} from "../utils/GlobalStateHelper";
import { executeLlm } from "../routes/command/executeLlm";
import { applyFuzzyPatch } from "../routes/file/fuzzyPatch";

/**
 * MCP tool result helper — wraps a JSON payload as MCP text content.
 */
const toolResult = (payload: unknown, isError = false) => ({
  content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
  ...(isError ? { isError: true } : {}),
});

const errorResult = (err: unknown) =>
  toolResult({ error: err instanceof Error ? err.message : String(err) }, true);

/**
 * Resolves the server handler for the currently selected server (defaults to
 * localhost/local protocol), mirroring initializeServerHandler middleware.
 */
const currentHandler = () => {
  const hostname = getSelectedServer() || "localhost";
  return new ServerManager(hostname).createHandler();
};

/**
 * Invokes an Express-style route handler with a captured response so the real
 * JSON payload propagates back to the MCP client (instead of the old
 * `{} as any` fake res that swallowed every result).
 */
async function callRouteHandler(
  handler: (req: any, res: any) => unknown,
  body: Record<string, unknown>
): Promise<{ statusCode: number; payload: unknown }> {
  const req: any = { body, headers: {}, server: currentHandler(), on: () => req };
  let statusCode = 200;
  let payload: unknown;
  const res: any = {
    status(code: number) { statusCode = code; return this; },
    json(data: unknown) { payload = data; return this; },
    send(data: unknown) { payload = data; return this; },
    setHeader() { return this; },
    write() { return true; },
    end() { return this; },
    on() { return this; },
  };
  await handler(req, res);
  return { statusCode, payload };
}

/**
 * Registers MCP tools backed by the real server handler / service functions.
 * Tool names follow the MCP spec pattern ^[a-zA-Z0-9_-]{1,64}$ (the legacy
 * slash-separated names like `command/execute` were invalid).
 */
export const registerMcpTools = (server: McpServer) => {
  // ----- Command tools -----

  // inputSchema cast as any + explicit any on args to bypass TS2589 deep
  // instantiation and ZodOptional/Effects compatibility issues with the
  // @modelcontextprotocol/sdk@1.29 registerTool generic under strict TS + zod.
  // Runtime validation still works (SDK consumes the zod shape).
  server.registerTool(
    "execute_command",
    {
      description: "Execute a shell command on the selected server and return stdout/stderr/exit code.",
      inputSchema: {
        command: z.string().describe("Shell command to execute"),
        timeout: z.number().optional().describe("Timeout in milliseconds"),
        directory: z.string().optional().describe("Working directory for the command"),
      } as any,
    },
    async (args: any) => {
      const { command, timeout, directory } = args;
      try {
        const result = await currentHandler().executeCommand(command, timeout, directory);
        return toolResult(result);
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  server.registerTool(
    "execute_code",
    {
      description: "Execute a code snippet in the given language (e.g. python, typescript, bash) on the selected server.",
      inputSchema: {
        code: z.string().describe("Source code to execute"),
        language: z.string().describe("Interpreter/language, e.g. python, typescript, bash"),
        timeout: z.number().optional().describe("Timeout in milliseconds"),
        directory: z.string().optional().describe("Working directory for execution"),
      } as any,
    },
    async (args: any) => {
      const { code, language, timeout, directory } = args;
      try {
        const result = await currentHandler().executeCode(code, language, timeout, directory);
        return toolResult(result);
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  server.registerTool(
    "execute_llm",
    {
      description: "Translate natural-language instructions into shell commands via the configured LLM and optionally execute them (set dryRun to only plan).",
      inputSchema: {
        instructions: z.string().describe("Natural language instructions"),
        dryRun: z.boolean().optional().describe("If true, return the plan without executing"),
        confirm: z.boolean().optional().describe("Confirm execution of commands flagged by safety policy"),
      } as any,
    },
    async (args: any) => {
      const { instructions, dryRun, confirm } = args;
      try {
        const { statusCode, payload } = await callRouteHandler(executeLlm, { instructions, dryRun, confirm });
        return toolResult(payload, statusCode >= 400);
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  server.registerTool(
    "change_directory",
    {
      description: "Change the present working directory used for subsequent commands on the selected server.",
      inputSchema: {
        directory: z.string().describe("Directory to change to"),
      } as any,
    },
    async (args: any) => {
      const { directory } = args;
      try {
        if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
          return toolResult({ error: `Directory not found: ${directory}` }, true);
        }
        setPresentWorkingDirectory(directory);
        return toolResult({ message: "Directory changed successfully.", presentWorkingDirectory: getPresentWorkingDirectory() });
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  // ----- File tools -----

  server.registerTool(
    "create_file",
    {
      description: "Create or replace a file on the selected server (existing files are backed up by default).",
      inputSchema: {
        filePath: z.string().describe("Absolute or relative path of the file to create"),
        content: z.string().optional().describe("File content (default empty)"),
        backup: z.boolean().optional().describe("Back up an existing file before overwriting (default true)"),
      } as any,
    },
    async (args: any) => {
      const { filePath, content, backup } = args;
      try {
        const ok = await currentHandler().createFile(filePath, content ?? "", backup ?? true);
        return toolResult({ success: ok, filePath });
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  server.registerTool(
    "read_file",
    {
      description: "Read the content of a file on the selected server.",
      inputSchema: {
        filePath: z.string().describe("Path of the file to read"),
      } as any,
    },
    async (args: any) => {
      const { filePath } = args;
      try {
        const content = await currentHandler().getFileContent(filePath);
        return toolResult({ filePath, content });
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  server.registerTool(
    "list_files",
    {
      description: "List files in a directory on the selected server (paginated).",
      inputSchema: {
        directory: z.string().describe("Directory to list"),
        limit: z.number().optional().describe("Max entries to return"),
        offset: z.number().optional().describe("Pagination offset"),
        orderBy: z.enum(["datetime", "filename"]).optional().describe("Sort order"),
      } as any,
    },
    async (args: any) => {
      const { directory, limit, offset, orderBy } = args;
      try {
        const result = await currentHandler().listFiles({ directory, limit, offset, orderBy });
        return toolResult(result);
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  server.registerTool(
    "fuzzy_patch_file",
    {
      description: "Apply a fuzzy (diff-match-patch) edit to a file: provide the old text and the new text; the change is located tolerantly. Set preview to test without writing.",
      inputSchema: {
        filePath: z.string().describe("Path of the file to patch"),
        oldText: z.string().describe("Existing text to replace (matched fuzzily)"),
        newText: z.string().describe("Replacement text"),
        preview: z.boolean().optional().describe("If true, return patched text without writing"),
      } as any,
    },
    async (args: any) => {
      const { filePath, oldText, newText, preview } = args;
      try {
        const { statusCode, payload } = await callRouteHandler(applyFuzzyPatch, { filePath, oldText, newText, preview });
        return toolResult(payload, statusCode >= 400);
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  // ----- Server tools -----

  server.registerTool(
    "list_servers",
    {
      description: "List servers configured for this instance (local/ssh/ssm) and the currently selected one.",
      inputSchema: {} as any,
    },
    async () => {
      try {
        const configured = ServerManager.listAvailableServers().map((s) => ({
          hostname: s.hostname,
          protocol: s.protocol,
        }));
        const registry = listAllServers().map((s) => ({
          key: s.key,
          label: s.label,
          protocol: s.protocol,
          hostname: s.hostname ?? null,
        }));
        return toolResult({ selected: getSelectedServer() || "localhost", configured, registry });
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  server.registerTool(
    "server_set",
    {
      description: "Select the target server (by hostname) for subsequent command and file tools. Optionally return its system info.",
      inputSchema: {
        hostname: z.string().describe("Hostname of a configured server"),
        getSystemInfo: z.boolean().optional().describe("Also return system info for the selected server"),
      } as any,
    },
    async (args: any) => {
      const { hostname, getSystemInfo } = args;
      try {
        // Mirrors /server/set route logic (routes/server/setServer.ts):
        // resolve config via ServerManager and persist the selection.
        const manager = new ServerManager(hostname);
        const serverConfig = manager.getServerConfig();
        setSelectedServer(hostname);
        let systemInfo;
        if (getSystemInfo) {
          systemInfo = await manager.createHandler().getSystemInfo();
        }
        return toolResult({ message: `Server set to: ${hostname}`, serverConfig, ...(systemInfo ? { systemInfo } : {}) });
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  // ----- Model tools -----

  server.registerTool(
    "model_list",
    {
      description: "List supported LLM models and the currently selected model.",
      inputSchema: {} as any,
    },
    async () => {
      try {
        return toolResult({ supported: getSupportedModels(), selected: getSelectedModel() });
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  server.registerTool(
    "model_select",
    {
      description: "Select the LLM model used by execute_llm.",
      inputSchema: {
        model: z.string().describe("Model name (must be in model_list)"),
      } as any,
    },
    async (args: any) => {
      const { model } = args;
      try {
        if (!isSupportedModel(model)) {
          return toolResult({ error: "Unsupported model", model }, true);
        }
        setSelectedModel(model);
        return toolResult({ selected: getSelectedModel() });
      } catch (err) {
        return errorResult(err);
      }
    }
  );

  server.registerTool(
    "model_current",
    {
      description: "Get the currently selected LLM model.",
      inputSchema: {} as any,
    },
    async () => {
      try {
        return toolResult({ selected: getSelectedModel() });
      } catch (err) {
        return errorResult(err);
      }
    }
  );
};
