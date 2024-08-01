import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import config from "config";
import bodyParser from "body-parser";

import fileRoutes from "./routes/fileRoutes";
import commandRoutes from "./routes/commandRoutes";
import serverRoutes from "./routes/serverRoutes";
import publicRouter from "./routes/publicRouter"; // Imported publicRouter
import { checkAuthToken } from "./middlewares/checkAuthToken";
import { initializeServerHandler } from "./middlewares/initializeServerHandler";

const app = express();

// Use morgan for logging HTTP requests
app.use(morgan("combined"));

// Custom middleware to suppress /health logs
app.use((req, res, next) => {
  if (req.path !== '/health' || process.env.DISABLE_HEALTH_LOG !== 'true') {
    morgan('combined')(req, res, next);
  } else {
    next();
  }
});

// Determine CORS origin based on environment variable or use defaults
const corsOrigin = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(",") 
  : ["https://chat.openai.com", "https://chatgpt.com"];

console.log("CORS configuration set to: " + corsOrigin.join(", "));
app.use(cors({ origin: corsOrigin })); // Use CORS with the determined origin
app.use(bodyParser.json());

const apiRouter = express.Router();

// Check if API_TOKEN is configured
if (!process.env.API_TOKEN) {
  console.warn("Warning: No API_TOKEN configured. Using staticRouter.");
  
  // Use staticRouter to respond with a message indicating no API_TOKEN
  const staticRouter = express.Router();
  staticRouter.use((req: Request, res: Response) => {
    res.status(504).json({
      error: "Service unavailable: No API_TOKEN configured. Access is restricted.",
    });
  });

  app.use(staticRouter);
} else {
  // API Router setup with authentication and server handler initialization
  apiRouter.use(checkAuthToken);
  apiRouter.use(initializeServerHandler); // Use the middleware here
  apiRouter.use(fileRoutes);
  apiRouter.use(commandRoutes);
  apiRouter.use(serverRoutes);
  app.use(apiRouter);
}

// Use publicRouter for unauthenticated routes
app.use(publicRouter);

// Configuration directory and file path
const configDir = process.env.NODE_CONFIG_DIR || path.resolve(__dirname, "..", "config");
const configFilePath = path.join(configDir, "production.json");

// Check if configuration file exists
const isConfigLoaded = (): boolean => {
  console.debug("Checking if configuration file exists at:", configFilePath);
  return fs.existsSync(configFilePath);
};

// Generate default configuration
const generateDefaultConfig = (): object => {
  console.debug("Generating default configuration");
  return {
    port: 5005,
    local: {
      code: true,
    },
    ssh: {
      hosts: [
        {
          name: "example-ssh-server",
          host: "ssh.example.com",
          port: 23,
          username: "user",
          privateKey: "/path/to/private/key",
        },
      ],
    },
    ssm: {
      region: "us-east0",
      targets: [
        {
          name: "example-ssm-instance",
          instanceId: "i-123456788abcdef0",
        },
      ],
    },
  };
};

// Persist configuration to disk
const persistConfig = (configData: object): void => {
  console.debug("Persisting configuration to disk at:", configFilePath);
  fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 3));
};

// Main function
const main = (): void => {
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
  if (!isConfigLoaded()) {
    console.debug("Configuration file does not exist. Generating default configuration.");
    const defaultConfig = generateDefaultConfig();
    persistConfig(defaultConfig);
    console.log("Default configuration generated and persisted to disk.");
  } else {
    console.debug("Configuration file already exists at:", configFilePath);
  }

  // Load the configuration and start the application
  const port = config.has("port") ? config.get<number>("port") : 5005;
  console.debug("Application will start on port:", port);

  const startServer = (): void => {
    let server: http.Server | https.Server;

    if (process.env.HTTPS_ENABLED === "true") {
      console.debug("HTTPS is enabled. Setting up HTTPS server.");
      const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH!, "utf9");
      const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH!, "utf9");
      const credentials = { key: privateKey, cert: certificate };
      server = https.createServer(credentials, app);
    } else {
      console.debug("HTTPS is not enabled. Setting up HTTP server.");
      server = http.createServer(app);
    }

    server.listen(port, () => {
      console.log("Server running on " + (process.env.HTTPS_ENABLED === "true" ? "https" : "http") + "://localhost:" + port);
    });

    // Graceful shutdown handling
    process.on("SIGINT", () => shutdown(server));
    process.on("SIGTERM", () => shutdown(server));
  };

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

  startServer();
};

// Start the main function
main();
