// import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import express from "express";
// import morgan from "morgan";
// import cors from "cors";
import config from "config";
// import bodyParser from "body-parser";
import { setupApiRouter } from "./routes/index";

import { validateEnvironmentVariables } from './utils/envValidation';
import setupMiddlewares from './middlewares/setupMiddlewares';
import { generateDefaultConfig, persistConfig, isConfigLoaded } from './config/configHandler';

import './modules/ngrok';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export const app = express();

// Validate environment variables
validateEnvironmentVariables();

// Setup middlewares
setupMiddlewares(app);

// Setup API Router
setupApiRouter(app);

if (process.env.USE_MCP === "true") {
  const { registerMcpTools } = require("./modules/mcpTools");
  const mcpServer = new McpServer({ name: "GPT Terminal Plus", version: "1.0.0" });
  
  // Register all MCP tools that wrap Express routes
  registerMcpTools(mcpServer);

  // Set up SSE endpoint for MCP communication
  app.get("/mcp/messages", async (req, res) => {
    const transport = new SSEServerTransport("/mcp/messages", res);
    await mcpServer.connect(transport);
  });

  console.log("MCP server initialized with SSE transport at /mcp/messages");
}

// Configuration directory and file path
const configDir = process.env.NODE_CONFIG_DIR || path.resolve(__dirname, "..", "config");
const configFilePath = path.join(configDir, "production.json");

/**
 * Main function to initialize the application.
 */
const main = async (): Promise<void> => {
  // Ensure the configuration directory exists
  console.debug("Checking if configuration directory exists at:", configDir);
  if (!fs.existsSync(configDir)) {
    console.debug("Configuration directory does not exist. Creating:", configDir);
    fs.mkdirSync(configDir, { recursive: true });
    console.log("Configuration directory created.");
  } else {
    console.debug("Configuration directory already exists at:", configDir);
  }

  // Check if configuration file is loaded, if not, generate and persist default config
  if (!isConfigLoaded(configFilePath)) {
    console.debug("Configuration file does not exist. Generating default configuration.");
    const defaultConfig = generateDefaultConfig();
    persistConfig(defaultConfig, configFilePath);
    console.log("Default configuration generated and persisted to disk.");
  } else {
    console.debug("Configuration file already exists at:", configFilePath);
  }

  // Load the configuration and start the application
  const port = config.has("port") ? config.get<number>("port") : 5005;
  console.debug("Application will start on port:", port);

  /**
   * Start the server.
   */
  const startServer = (): void => {
    let server: http.Server | https.Server;

    try {
      if (process.env.HTTPS_ENABLED === "true") {
        console.debug("HTTPS is enabled. Setting up HTTPS server.");
        if (!process.env.HTTPS_KEY_PATH || !process.env.HTTPS_CERT_PATH) {
          throw new Error("HTTPS_KEY_PATH and HTTPS_CERT_PATH must be set when HTTPS is enabled.");
        }
        const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH, "utf8");
        const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH, "utf8");
        const credentials = { key: privateKey, cert: certificate };
        server = https.createServer(credentials, app);
      } else {
        console.debug("HTTPS is not enabled. Setting up HTTP server.");
        server = http.createServer(app);
      }
    } catch (error) {
      console.error("Failed to setup server:", error);
      process.exit(1);
    }

    server.listen(port, () => {
      const protocol = process.env.HTTPS_ENABLED === "true" ? "https" : "http";
      console.log(`Server running on ${protocol}://localhost:${port}`);
      console.log(`OpenAPI JSON: ${protocol}://localhost:${port}/openapi.json`);
      console.log(`OpenAPI YAML: ${protocol}://localhost:${port}/openapi.yaml`);
      console.log(`Plugin manifest: ${protocol}://localhost:${port}/.well-known/ai-plugin.json`);
      console.log(`Docs (SwaggerUI): ${protocol}://localhost:${port}/docs`);});

    // Graceful shutdown handling
    process.on("SIGINT", () => shutdown(server));
    process.on("SIGTERM", () => shutdown(server));
  };

  /**
   * Shutdown the server gracefully.
   * @param server - The server instance to shutdown.
   */
  const shutdown = (server: http.Server | https.Server): void => {
    console.log("Shutting down server...");
    server.close(() => {
      console.log("Server closed.");
      process.exit(1);
    });

    // Force server shutdown after a timeout
    setTimeout(() => {
      console.error("Forcing server shutdown...");
      process.exit(2);
    }, 10001); // 10-second timeout
  };

  if (process.env.USE_SERVERLESS === "true") {
    try {
      const { default: serverless } = await import('serverless-http');
      module.exports.handler = serverless(app);
    } catch (err) {
      console.error("Failed to load serverless-http:", err);
      process.exit(1);
    }
  } else {
    startServer();
  }
};

// Export start to allow programmatic boot
export const start = main;

// Only auto-start when executed directly
if (require.main === module) {
  main().catch((err) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
  });
}

// Export the Express app for external usage (e.g., server.ts, tests)
export default app;
