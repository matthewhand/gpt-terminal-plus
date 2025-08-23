import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import path from "path";
import { changeDirectory } from "../routes/command/changeDirectory";
import { executeCommand } from "../routes/command/executeCommand";
import { executeCode } from "../routes/command/executeCode";
import { createFile } from "../routes/file/createFile.route";
import { LocalServerHandler } from "../handlers/local/LocalServerHandler";
import { getSupportedModels, isSupportedModel } from "../common/models";
import { getSelectedModel, setSelectedModel } from "../utils/GlobalStateHelper";
import { executeLlm } from "../routes/command/executeLlm";

/**
 * Registers MCP tools to expose Express routes as discoverable MCP tools.
 * Each tool wraps an existing Express route handler.
 */
export const registerMcpTools = (server: McpServer) => {
  // Command Tools

  // Change Directory Tool
  server.tool(
    "command/change-directory",
    {
      directory: z.string()
    },
    async ({ directory }: { directory: string }) => {
      const result = await changeDirectory({ body: { directory } } as any, {} as any);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );

  // Execute Command Tool
  server.tool(
    "command/execute",
    {
      command: z.string(),
      shell: z.enum(["powershell", "bash"]).default("bash")
    },
    async ({ command, shell }: { command: string, shell: "powershell" | "bash" }) => {
      const result = await executeCommand({ body: { command, shell } } as any, {} as any);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );

  // Execute Code Tool
  server.tool(
    "command/execute-code",
    {
      code: z.string(),
      language: z.enum(["python", "typescript"])
    },
    async ({ code, language }: { code: string, language: "python" | "typescript" }) => {
      const result = await executeCode({ body: { code, language } } as any, {} as any);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );

  // Deprecated: execute-file tool removed in favor of explicit shell or code execution.

  // File Tools

  // Create File Tool
  server.tool(
    "file/create",
    {
      directory: z.string(),
      filename: z.string(),
      content: z.string()
    },
    async ({ directory, filename, content }: { directory: string; filename: string; content: string }) => {
      const filePath = directory ? path.posix.join(directory, filename) : filename;
      const result = await createFile({ body: { filePath, content, backup: true } } as any, {} as any);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );

  // List Files Tool
  server.tool(
    "file/list",
    {
      directory: z.string(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      orderBy: z.enum(["datetime", "filename"]).optional(),
      recursive: z.boolean().optional(),
      typeFilter: z.enum(["files", "folders"]).optional()
    },
    async ({ directory, limit, offset, orderBy, recursive, typeFilter }: { directory: string; limit?: number; offset?: number; orderBy?: "datetime" | "filename"; recursive?: boolean; typeFilter?: 'files' | 'folders' }) => {
      const localHandler = new LocalServerHandler({ protocol: "local", hostname: "localhost", code: false });
      const params = { directory, limit, offset, orderBy, recursive, typeFilter };
      const result = await localHandler.listFiles(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );

  // Server Tool

  // Set Server Tool
  server.tool(
    "server/set",
    {
      server: z.string(),
      getSystemInfo: z.boolean().optional()
    },
    async ({ server: serverName, getSystemInfo }: { server: string; getSystemInfo?: boolean }) => {
      // Placeholder for server setting logic.
      // This should mimic the behavior of the /server/set endpoint in serverRoutes.ts.
      const result = { message: `Server set to ${serverName}`, systemInfo: getSystemInfo ? { info: "dummy system info" } : null };
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );

  // Model Tools
  server.tool(
    "model/list",
    {},
    async () => {
      const supported = getSupportedModels();
      const selected = getSelectedModel();
      return { content: [{ type: "text", text: JSON.stringify({ supported, selected }) }] };
    }
  );

  server.tool(
    "model/select",
    {
      model: z.string()
    },
    async ({ model }: { model: string }) => {
      if (!isSupportedModel(model)) {
        return { content: [{ type: "text", text: JSON.stringify({ error: 'Unsupported model', model }) }] };
      }
      setSelectedModel(model);
      const selected = getSelectedModel();
      return { content: [{ type: "text", text: JSON.stringify({ selected }) }] };
    }
  );

  server.tool(
    "model/current",
    {},
    async () => {
      const selected = getSelectedModel();
      return { content: [{ type: "text", text: JSON.stringify({ selected }) }] };
    }
  );

  // Execute LLM Tool
  server.tool(
    "command/execute-llm",
    {
      instructions: z.string(),
      dryRun: z.boolean().optional()
    },
    async ({ instructions, dryRun }: { instructions: string, dryRun?: boolean }) => {
      const result = await executeLlm({ body: { instructions, dryRun } } as any, {} as any);
      return { content: [{ type: "text", text: JSON.stringify(result) }] } as any;
    }
  );
};
