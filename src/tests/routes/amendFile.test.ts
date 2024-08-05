import request from "supertest";
import express from "express";
import fs from "fs";
import path from "path";
import { amendFile } from "../../routes/file/amendFile";

const app = express();
app.use(express.json());

// Mock the server directly in the route handler for the test
app.post("/amend-file", (req, res, next) => {
  req.server = {}; // Mocked server handler
  next();
}, amendFile);

describe("Amend File Route", () => {
  const testDir = path.join(process.env.NODE_CONFIG_DIR || __dirname, "test");
  const testFile = path.join(testDir, "test.txt");

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    fs.writeFileSync(testFile, "Initial content.\n");
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true }); // Updated to fs.rmSync
    }
  });

  it("should amend file successfully", async () => {
    const filePath = path.join(testDir, "test.txt");
    const response = await request(app)
      .post("/amend-file")
      .set("Content-Type", "application/json")
      .send({
        filePath,
        content: "Appended content.",
      });

    console.log("Response status:", response.status); // Debug log

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("File amended successfully.");

    const fileContent = fs.readFileSync(filePath, "utf8");
    expect(fileContent).toContain("Initial content.\nAppended content.");
  });

  it("should return error if filePath or content is not provided", async () => {
    const response = await request(app)
      .post("/amend-file")
      .set("Content-Type", "application/json")
      .send({
        content: "Appended content.",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("File path and content are required");
  });
});
