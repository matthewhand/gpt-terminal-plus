import fs from "fs";
import path from "path";

/**
 * Log a step in a session's activity timeline.
 * Each call creates a JSON file under data/activity/<date>/<sessionId>/.
 */
export async function logSessionStep(
  type: string,
  payload: any,
  sessionId?: string
) {
  const date = new Date().toISOString().slice(0, 10);
  const dir = path.join(
    "data",
    "activity",
    date,
    sessionId || `session_${Date.now()}`
  );

  fs.mkdirSync(dir, { recursive: true });

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const stepNum = String(files.length + 1).padStart(2, "0");
  const filename = `${stepNum}-${type}.json`;

  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));

  return filePath;
}
