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
  const entry = {
    ts: new Date().toISOString(),
    type: event,
    sessionId: sessionId || '',
    ...payload
  };
  logActivity(entry);
}

