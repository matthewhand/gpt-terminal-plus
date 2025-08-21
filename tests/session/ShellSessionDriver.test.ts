import { ShellSessionDriver } from "../../src/session/ShellSessionDriver";

jest.setTimeout(5000);

describe("ShellSessionDriver", () => {
  it("should start a session, exec a command, and stop", async () => {
    const driver = new ShellSessionDriver();

    // Start
    const meta = await driver.start({ shell: "bash" });
    expect(meta.id).toMatch(/^sess-/);

    // Exec
    const result = await driver.exec(meta.id, "echo hello-world");
    expect(result.stdout).toContain("hello-world");
    expect(result.exitCode).toBe(0);

    // Logs
    const logs = await driver.logs(meta.id);
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].command).toBe("echo hello-world");

    // Stop
    await driver.stop(meta.id);
  });
});
