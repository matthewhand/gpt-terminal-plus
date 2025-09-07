import { ShellSessionDriver } from "../../src/session/ShellSessionDriver";

jest.setTimeout(10000);

describe("ShellSessionDriver", () => {
  let driver: ShellSessionDriver;

  beforeEach(() => {
    driver = new ShellSessionDriver();
  });

  afterEach(async () => {
    // Clean up any remaining sessions
    try {
      const sessions = await driver.list();
      for (const session of sessions) {
        await driver.stop(session.id);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe("session lifecycle", () => {
    it("should start a session, exec a command, and stop", async () => {
      // Start session
      const meta = await driver.start({ shell: "bash" });
      expect(meta.id).toMatch(/^sess-/);
      expect(meta.shell).toBe("bash");
      expect(meta.status).toBe("running");
      expect(typeof meta.createdAt).toBe('number');
      expect(meta.createdAt).toBeGreaterThan(0);

      // Execute command
      const result = await driver.exec(meta.id, "echo hello-world");
      expect(result.stdout).toContain("hello-world");
      expect(result.exitCode).toBe(0);
      expect(result.success).toBe(true);
      expect(result.stderr).toBe("");

      // Check logs
      const logs = await driver.logs(meta.id);
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].command).toBe("echo hello-world");
      expect(logs[0].exitCode).toBe(0);
      expect(logs[0].timestamp).toBeInstanceOf(Date);

      // Stop session
      await driver.stop(meta.id);
    });

    it("should handle multiple sessions concurrently", async () => {
      const session1 = await driver.start({ shell: "bash" });
      const session2 = await driver.start({ shell: "bash" });

      expect(session1.id).not.toBe(session2.id);
      expect(session1.id).toMatch(/^sess-/);
      expect(session2.id).toMatch(/^sess-/);

      // Execute different commands in each session
      const [result1, result2] = await Promise.all([
        driver.exec(session1.id, "echo session1"),
        driver.exec(session2.id, "echo session2")
      ]);

      expect(result1.stdout).toContain("session1");
      expect(result2.stdout).toContain("session2");

      // Clean up
      await Promise.all([
        driver.stop(session1.id),
        driver.stop(session2.id)
      ]);
    });

    it("should list active sessions", async () => {
      const session1 = await driver.start({ shell: "bash" });
      const session2 = await driver.start({ shell: "bash" });

      const sessions = await driver.list();
      expect(sessions.length).toBeGreaterThanOrEqual(2);
      
      const sessionIds = sessions.map(s => s.id);
      expect(sessionIds).toContain(session1.id);
      expect(sessionIds).toContain(session2.id);

      // Clean up
      await driver.stop(session1.id);
      await driver.stop(session2.id);
    });
  });

  describe("command execution", () => {
    let sessionId: string;

    beforeEach(async () => {
      const meta = await driver.start({ shell: "bash" });
      sessionId = meta.id;
    });

    afterEach(async () => {
      await driver.stop(sessionId);
    });

    it("should execute simple commands successfully", async () => {
      const result = await driver.exec(sessionId, "echo test");
      
      expect(result.exitCode).toBe(0);
      expect(result.success).toBe(true);
      expect(result.stdout).toContain("test");
      expect(result.stderr).toBe("");
    });

    it("should handle commands with exit codes", async () => {
      const result = await driver.exec(sessionId, "exit 42");
      
      expect(result.exitCode).toBe(42);
      expect(result.success).toBe(false);
    });

    it("should capture stderr output", async () => {
      const result = await driver.exec(sessionId, "echo error >&2");
      
      expect(result.stderr).toContain("error");
      expect(result.exitCode).toBe(0);
    });

    it("should handle multiline commands", async () => {
      const command = `echo "line1"
echo "line2"
echo "line3"`;
      
      const result = await driver.exec(sessionId, command);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("line1");
      expect(result.stdout).toContain("line2");
      expect(result.stdout).toContain("line3");
    });

    it("should execute commands in sequence", async () => {
      // Execute a simple command
      const result1 = await driver.exec(sessionId, "echo first");
      expect(result1.stdout).toContain("first");
      expect(result1.exitCode).toBe(0);

      // Execute another command
      const result2 = await driver.exec(sessionId, "echo second");
      expect(result2.stdout).toContain("second");
      expect(result2.exitCode).toBe(0);
    });

    it("should handle long-running commands", async () => {
      const result = await driver.exec(sessionId, "sleep 1 && echo done");
      
      expect(result.stdout).toContain("done");
      expect(result.exitCode).toBe(0);
    });
  });

  describe("logging and history", () => {
    let sessionId: string;

    beforeEach(async () => {
      const meta = await driver.start({ shell: "bash" });
      sessionId = meta.id;
    });

    afterEach(async () => {
      await driver.stop(sessionId);
    });

    it("should maintain command history", async () => {
      await driver.exec(sessionId, "echo first");
      await driver.exec(sessionId, "echo second");
      await driver.exec(sessionId, "echo third");

      const logs = await driver.logs(sessionId);
      
      expect(logs.length).toBe(3);
      expect(logs[0].command).toBe("echo first");
      expect(logs[1].command).toBe("echo second");
      expect(logs[2].command).toBe("echo third");
    });

    it("should include timestamps in logs", async () => {
      const beforeExec = new Date();
      await driver.exec(sessionId, "echo timestamped");
      const afterExec = new Date();

      const logs = await driver.logs(sessionId);
      
      expect(logs.length).toBe(1);
      expect(logs[0].timestamp).toBeInstanceOf(Date);
      expect(logs[0].timestamp.getTime()).toBeGreaterThanOrEqual(beforeExec.getTime());
      expect(logs[0].timestamp.getTime()).toBeLessThanOrEqual(afterExec.getTime());
    });

    it("should include execution results in logs", async () => {
      await driver.exec(sessionId, "echo logged");

      const logs = await driver.logs(sessionId);
      
      expect(logs.length).toBe(1);
      expect(logs[0].stdout).toContain("logged");
      expect(logs[0].exitCode).toBe(0);
      expect(logs[0].stderr).toBe("");
    });
  });

  describe("error handling", () => {
    it("should handle invalid session IDs gracefully", async () => {
      await expect(driver.exec("invalid-session-id", "echo test"))
        .rejects
        .toThrow();
    });

    it("should handle stopping non-existent sessions", async () => {
      await expect(driver.stop("non-existent-session"))
        .rejects
        .toThrow();
    });

    it("should handle getting logs for non-existent sessions", async () => {
      await expect(driver.logs("non-existent-session"))
        .rejects
        .toThrow();
    });

    it("should handle empty commands", async () => {
      const meta = await driver.start({ shell: "bash" });
      
      await expect(driver.exec(meta.id, ""))
        .rejects
        .toThrow();
        
      await driver.stop(meta.id);
    });

    it("should handle commands with special characters", async () => {
      const meta = await driver.start({ shell: "bash" });
      
      const result = await driver.exec(meta.id, 'echo "special chars: $@#%^&*()"');
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("special chars:");
      
      await driver.stop(meta.id);
    });
  });

  describe("different shell types", () => {
    it("should work with bash shell", async () => {
      const meta = await driver.start({ shell: "bash" });
      const result = await driver.exec(meta.id, "echo $0");
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toMatch(/bash/);
      
      await driver.stop(meta.id);
    });

    it("should work with sh shell", async () => {
      const meta = await driver.start({ shell: "sh" });
      const result = await driver.exec(meta.id, "echo $0");
      
      expect(result.exitCode).toBe(0);
      
      await driver.stop(meta.id);
    });
  });
});
