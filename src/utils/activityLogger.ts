import fs from 'fs/promises';
import path from 'path';

export async function logSessionStep(type: string, payload: any, sessionId?: string) {
  const now = new Date();
  const dateDir = path.join('data', 'activity', now.toISOString().slice(0, 10));
  await fs.mkdir(dateDir, { recursive: true });

  const session = sessionId || `session_${Date.now()}`;
  const sessionDir = path.join(dateDir, session);
  await fs.mkdir(sessionDir, { recursive: true });

  // Create meta.json if it doesn't exist
  const metaPath = path.join(sessionDir, 'meta.json');
  try {
    await fs.access(metaPath);
  } catch {
    const meta = {
      sessionId: session,
      startedAt: now.toISOString(),
      user: 'gpt-bot', // This can be customized later
      label: 'Session', // This can be customized later
      source: 'N/A' // This can be customized later
    };
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));
  }

  const stepFiles = await fs.readdir(sessionDir);
  const nextStepNum = stepFiles.filter(f => f.match(/^\d+-/)).length + 1;
  const stepFilename = path.join(sessionDir, `${String(nextStepNum).padStart(2, '0')}-${type}.json`);
  
  const logEntry = {
    timestamp: now.toISOString(),
    type: type,
    ...payload
  };

  await fs.writeFile(stepFilename, JSON.stringify(logEntry, null, 2));
}