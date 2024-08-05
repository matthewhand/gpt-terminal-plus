import request from "supertest";
import express from "express";
import fs from "fs";
import path from "path";
import { createFile } from "../../src/routes/file/createFile";
import { createLocalServer } from "../utils/localServerUtil";

const app = express();
app.use(express.json());
app.post("/create-file", (req, res, next) => {
  req.server = createLocalServer();
  next();
}, createFile);

describe("Create File Route", () => {
  // Use $NODE_CONFIG_DIR for testing
  const testDir = path.join(process.env.NODE_CONFIG_DIR || __dirname, "test");

  // Ensure test directory exists
  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  // Clean up test directory
  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir, { recursive: true });
    }
  });

  it("should create file successfully", async () => {
    const response = await request(app).post("/create-file").send({ directory: testDir, filename: "test.txt", content: "Hello, World!" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("File created successfully.");
  });

  it("should return error if filename or directory is not provided", async () => {
    const response = await request(app).post("/create-file").send({ content: "Hello, World!" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Filename and directory are required");
  });
});
