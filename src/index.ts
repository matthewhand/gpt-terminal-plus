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
import shellRouter from './routes/shell';
import publicRouter from './routes/publicRouter';
import { registerOpenApiRoutes } from "./openapi";
import swaggerUi from "swagger-ui-express";

import { validateEnvironmentVariables } from './utils/envValidation';
import setupMiddlewares from './middlewares/setupMiddlewares';
import { generateDefaultConfig, persistConfig, isConfigLoaded } from './config/configHandler';
import { registerServersFromConfig } from './bootstrap/serverLoader';

import './modules/ngrok';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export const app = express();

// Validate environment variables
validateEnvironmentVariables();

// Setup middlewares
setupMiddlewares(app);

/**
 * Static assets
 * - Serve public/ at /
 * - Serve repository docs/ at /docs-static (distinct from Swagger UI at /docs)
 */
// Serve static assets from public/
app.use(express.static(path.resolve(__dirname, '..', 'public')));
// Serve documentation markdown as static files
app.use('/docs-static', express.static(path.resolve(__dirname, '..', 'docs')));

// Setup API Router and additional route groups
setupApiRouter(app);
app.use('/shell', shellRouter);
app.use(publicRouter);

// Dynamic OpenAPI routes
registerOpenApiRoutes(app);

// Enhanced Swagger UI at /docs
const swaggerOptions: any = {
  swaggerUrl: '/openapi.json',
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customCssUrl: '/swagger-theme.css',
  customJs: '/theme.js',
  customSiteTitle: 'GPT Terminal Plus API',
  customfavIcon: '/favicon.ico'
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

  // (duplicate OpenAPI/Swagger mounts removed)

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
  // Load servers from config into memory registry
  registerServersFromConfig();
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
  // Prefer explicit env PORT if provided and valid; otherwise fall back to config or default
  const rawEnvPort = process.env.PORT;
  let port: number;
  if (rawEnvPort && !Number.isNaN(Number(rawEnvPort))) {
    port = Number(rawEnvPort);
    console.debug(`Port selection: honoring process.env.PORT=${rawEnvPort}`);
  } else {
    port = config.has("port") ? config.get<number>("port") : 5005;
    console.debug(
      `Port selection: using config/default (${port})${
        rawEnvPort ? " (ignored invalid PORT)" : ""
      }`
    );
  }
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
      console.log(`OpenAPI (JSON): ${protocol}://localhost:${port}/openapi.json`);
      console.log(`OpenAPI (YAML): ${protocol}://localhost:${port}/openapi.yaml`);
      console.log(`OpenAPI YAML: ${protocol}://localhost:${port}/openapi.yaml`);
      console.log(`Plugin manifest: ${protocol}://localhost:${port}/.well-known/ai-plugin.json`);
      console.log(`Docs (SwaggerUI): ${protocol}://localhost:${port}/docs`);
    });

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
