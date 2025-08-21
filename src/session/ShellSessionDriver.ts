/**
 * ShellSessionDriver
 *
 * Provides a persistent shell session using node-pty.
 * Supports running multiple commands within the same environment.
 */

import { spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { SessionDriver, SessionMeta, ExecutionResult, ExecutionLog } from "./SessionDriver";

interface ShellSession {
  proc: ReturnType<typeof spawn>;
  logs: ExecutionLog[];
}

export class ShellSessionDriver implements SessionDriver {
  private sessions: Map<string, ShellSession> = new Map();

  async start(opts: any): Promise<SessionMeta> {
    const shell = opts?.shell || process.env.SHELL || "bash";
    const id = `sess-${uuidv4()}`;
    const proc = spawn(shell, [], { stdio: "pipe" });

    this.sessions.set(id, { proc, logs: [] });

    const meta: SessionMeta = {
      id,
      mode: "shell",
      server: "local",
      startedAt: new Date().toISOString(),
    };

    return meta;
  }

  async exec(id: string, input: string): Promise<ExecutionResult> {
    const session = this.sessions.get(id);
    if (!session) throw new Error(`Session ${id} not found`);

    return new Promise((resolve) => {
      let stdout = "";
      let stderr = "";

      session.proc.stdout?.on("data", (data) => {
        stdout += data.toString();
      });

      session.proc.stderr?.on("data", (data) => {
        stderr += data.toString();
      });

      session.proc.stdin?.write(input + "\n");

      // crude: wait a moment for output, then resolve
      setTimeout(() => {
        const result: ExecutionResult = {
          stdout,
          stderr,
          exitCode: 0, // not tracked per command in long-lived session
          timestamp: new Date().toISOString(),
        };

        const log: ExecutionLog = { ...result, command: input };
        session.logs.push(log);

        const dir = path.join("data/activity", new Date().toISOString().split("T")[0], id);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${Date.now()}.json`), JSON.stringify(log, null, 2));

        resolve(result);
      }, 300);
    });
  }

  async stop(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.proc.kill();
      this.sessions.delete(id);
    }
  }

  async logs(id: string): Promise<ExecutionLog[]> {
    const session = this.sessions.get(id);
    return session ? session.logs : [];
  }
}
