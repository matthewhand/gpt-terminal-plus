import { LocalServerHandler } from "../src/handlers/local/LocalServerHandler";
import path from "path";
import os from "os";

(async () => {
  const handler = new LocalServerHandler({ directory: os.tmpdir() });
  const fileName = "jit-demo.txt";
  const filePath = path.join(os.tmpdir(), fileName);

  console.log("=== DEMO: Execute Shell ===");
  const shellResult = await handler.executeCommand("echo hello from shell");
  console.log("stdout:", shellResult.stdout.trim());
  console.log("stderr:", shellResult.stderr.trim());

  console.log("\n=== DEMO: Execute Code ===");
  const codeResult = await handler.executeCode("print('hi from python')", "python");
  console.log("stdout:", codeResult.stdout.trim());
  console.log("stderr:", codeResult.stderr.trim());

  console.log("\n=== DEMO: File Operations ===");
  await handler.createFile(fileName, "hello");
  console.log("Created file:", filePath);
  console.log("Read file:", await handler.getFileContent(fileName));
  await handler.amendFile(fileName, " world");
  console.log("Amended file:", await handler.getFileContent(fileName));
  await handler.updateFile(fileName, "world", "WORLD");
  console.log("Updated file:", await handler.getFileContent(fileName));
  const list = await handler.listFiles({ directory: os.tmpdir(), limit: 5 });
  console.log("Listed files:", list.items);
})();