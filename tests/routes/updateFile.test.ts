import request from "supertest";
import express from "express";
import fs from "fs";
import path from "path";
import { updateFile } from "../../src/routes/file/updateFile";
import { createLocalServer } from "../utils/localServerUtil";

const app = express();
app.use(express.json());
app.post("/update-file", (req, res, next) => {
  req.ServerHandler = createLocalServer();
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
      fs.rmdirSync(testDir, { recursive: true });
    }
  });

  it("should update file successfully", async () => {
    const response = await request(app).post("/update-file").send({
      directory: testDir,
      filename: "test.txt",
      pattern: "Initial",
      replacement: "Updated",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("File updated successfully.");

    const fileContent = fs.readFileSync(testFile, "utf8");
    expect(fileContent).toContain("Updated content.\nSome more content.");
  });

  it("should return error if filename, directory, pattern, or replacement is not provided", async () => {
    const response = await request(app).post("/update-file").send({
      pattern: "Initial",
      replacement: "Updated",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Filename, directory, pattern, and replacement are required");
  });
});
