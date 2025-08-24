import fs from "fs";
import path from "path";
import { logSessionStep } from "../../src/utils/activityLogger";

describe("activityLogger", () => {
  const baseDir = path.join("data", "activity");

  afterEach(() => {
    if (fs.existsSync(baseDir)) {
      fs.rmSync(baseDir, { recursive: true, force: true });
    }
  });

  it("creates a log file with correct structure", async () => {
    const sessionId = "testSession";
    const payload = { foo: "bar" };

    const filePath = await logSessionStep("executeTest", payload, sessionId);

    expect(fs.existsSync(filePath)).toBe(true);

    const contents = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    expect(contents).toEqual(payload);
  });

  it("increments step numbers correctly", async () => {
    const sessionId = "incrementTest";

    const file1 = await logSessionStep("first", { a: 1 }, sessionId);
    const file2 = await logSessionStep("second", { b: 2 }, sessionId);

    expect(path.basename(file1).startsWith("01-")).toBe(true);
    expect(path.basename(file2).startsWith("02-")).toBe(true);
  });
});
