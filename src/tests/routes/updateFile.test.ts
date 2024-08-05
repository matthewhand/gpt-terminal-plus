import request from "supertest";
import express from "express";
import fs from "fs";
import path from "path";
import { updateFile } from "../../routes/file/updateFile";
import ServerManager from "../../managers/ServerManager";

const app = express();
app.use(express.json());
app.post("/update-file", (req, res, next) => {
  req.server = new ServerManager({
    host: 'localhost',
    protocol: 'local',
    code: false,
  }).createHandler();
  console.log("Server set on request in first middleware:", req.server); // Debug log
  next();
}, (req, res, next) => {
  console.log("Middleware check after first middleware, server on request:", req.server); // Debug log
  next();
}, (req, res, next) => {
  if (!req.server) {
    console.log("Server handler is missing in third middleware");
  } else {
    console.log("Server handler is present in third middleware");
  }
  next();
}, (req, res, next) => {
  console.log("Inside updateFile route handler, server on request:", req.server); // Debug log
  next();
}, updateFile);

describe("Update File Route", () => {
  const testDir = path.join(process.env.NODE_CONFIG_DIR || __dirname, "test");
  const testFile = path.join(testDir, "test.txt");

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    fs.writeFileSync(testFile, "Initial content.\nSome more content.\n");
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true }); // Updated to fs.rmSync
    }
  });

  it("should update file successfully", async () => {
    const filePath = path.join(testDir, "test.txt");
    const response = await request(app).post("/update-file").send({
      filePath,
      pattern: "Initial",
      replacement: "Updated",
    });

    console.log("Response status:", response.status); // Debug log

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("File updated successfully.");

    const fileContent = fs.readFileSync(filePath, "utf8");
    expect(fileContent).toContain("Updated content.\nSome more content.");
  });

  it("should return error if filePath, pattern, or replacement is not provided", async () => {
    const response = await request(app).post("/update-file").send({
      pattern: "Initial",
      replacement: "Updated",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Filename, directory, pattern, and replacement are required");
  });
});
