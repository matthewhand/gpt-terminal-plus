import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { amendFile } from "../../routes/file/amendFile";

describe("Direct Amend File Function", () => {
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
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it("should amend file successfully", async () => {
    const req = {
      body: {
        filePath: path.join(testDir, "test.txt"),
        content: "Appended content.",
      },
      server: {}, // Mocked server handler
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await amendFile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "File amended successfully." });

    const fileContent = fs.readFileSync(req.body.filePath, "utf8");
    expect(fileContent).toContain("Initial content.\nAppended content.");
  });

  it("should return error if filePath or content is not provided", async () => {
    const req = {
      body: {
        content: "Appended content.",
      },
      server: {}, // Mocked server handler
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await amendFile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "File path and content are required" });
  });
});
