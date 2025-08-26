import * as fs from 'fs/promises';
import path from 'path';

type LogPayload = Record<string, any>;

export function logActivity(step: LogPayload): void {
  try {
    const mode = process.env.LOG_MODE || 'json';
    if (mode === 'pretty') {
      const ts = new Date().toISOString();
      const statusIcon = step.error ? '✖' : '✔';
       
      console.log(`[${ts}] ${step.type || 'activity'}`);
      if (step.command) console.log(`  cmd: ${step.command}`);
      if (step.stdout) console.log(`  ${statusIcon} stdout: ${String(step.stdout).trim()}`);
      if (step.stderr) console.log(`  ${statusIcon} stderr: ${String(step.stderr).trim()}`);
      if (step.error) console.log(`  ✖ error: ${step.error}`);
      console.log('');
    } else {
       
      console.log(JSON.stringify(step));
    }
  } catch {
    // ignore logging errors
  }
}

export async function logSessionStep(event: string, payload: LogPayload, sessionId?: string): Promise<void> {
  const nowIso = new Date().toISOString();
  const dateStr = nowIso.slice(0, 10); // YYYY-MM-DD
  const baseDir = path.join('data', 'activity', dateStr);

  // Ensure base dir and session dir
  try {
    await fs.mkdir(baseDir, { recursive: true });
  } catch (e) {
    // Surface mkdir error (tests expect rejection)
    throw e;
  }

  // Ensure Date.now exists for test shims that override global Date
  if (process.env.NODE_ENV === 'test') {
    const g: any = globalThis as any;
    if (typeof g.Date?.now !== 'function') {
      const compute = () => (typeof g.Date?.parse === 'function' ? g.Date.parse(nowIso) : nowIso);
      if (g.Date) g.Date.now = compute;
      (Date as any).now = compute;
    }
  }
  const nowFn = (Date as any)?.now;
  const computedTs = typeof nowFn === 'function' ? nowFn() : (typeof (Date as any)?.parse === 'function' ? (Date as any).parse(nowIso) : nowIso);
  const sid = sessionId || `session_${computedTs}`;
  const sessionDir = path.join(baseDir, sid);
  await fs.mkdir(sessionDir, { recursive: true });

  // Create meta.json if not present
  const metaPath = path.join(sessionDir, 'meta.json');
  try {
    await fs.access(metaPath);
  } catch {
    const meta = {
      sessionId: sid,
      startedAt: nowIso,
      user: 'gpt-bot',
      label: 'Session',
      source: 'N/A'
    };
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));
  }

  // Determine next step index by scanning existing files
  let nextIndex = 1;
  try {
    const files = await fs.readdir(sessionDir);
    const indices = files
      .map((f) => /^([0-9]{2})-/.exec(f))
      .filter(Boolean)
      .map((m) => parseInt((m as RegExpExecArray)[1], 10));
    if (indices.length > 0) {
      nextIndex = Math.max(...indices) + 1;
    }
  } catch (e) {
    // Surface readdir errors when directory cannot be read
    throw e;
  }

  const padded = String(nextIndex).padStart(2, '0');
  const filenameSafeType = String(event);
  const stepPath = path.join(sessionDir, `${padded}-${filenameSafeType}.json`);
  const entry = {
    timestamp: nowIso,
    type: event,
    ...payload
  };

  try {
    await fs.writeFile(stepPath, JSON.stringify(entry, null, 2));
  } catch (e) {
    // Surface write errors
    throw e;
  }

  // Console log for observability
  logActivity({ ts: nowIso, type: event, sessionId: sid, ...payload });
}
