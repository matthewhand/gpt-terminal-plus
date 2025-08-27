import fs from "fs";

export interface ApplyFilePatchOptions {
  filePath: string;
  oldText: string;
  newText: string;
  preview?: boolean;
}

export function applyFilePatch(
  opts: ApplyFilePatchOptions
): {
  success: boolean;
  patchedText?: string;
  results?: boolean[];
  error?: string;
} {
  const { filePath, oldText, newText, preview } = opts;

  if (!fs.existsSync(filePath)) {
    return { success: false, error: `File not found: ${filePath}` };
  }

  const current = fs.readFileSync(filePath, "utf-8");

  // Simple, dependency-free approach:
  // - If current contains oldText, replace the first occurrence with newText.
  // - Otherwise, fall back to replacing the closest match by line-based heuristic.
  let patched = current;
  let results: boolean[] = [];

  if (oldText && current.includes(oldText)) {
    patched = current.replace(oldText, newText);
    // If replacement yields no change, treat as failure (no hunks applied)
    if (patched === current) {
      return { success: false, error: "Patch could not be applied" };
    }
    results = [true];
  } else {
    // Line-based heuristic: find a line that starts with the first non-empty line
    const oldLines = oldText.split(/\r?\n/).filter(l => l.trim().length > 0);
    const anchor = oldLines[0] || '';
    const idx = anchor ? current.indexOf(anchor) : -1;
    if (idx >= 0) {
      // Replace that region approximately
      patched = current.slice(0, idx) + newText + current.slice(idx + (anchor.length));
      if (patched === current) {
        return { success: false, error: "Patch could not be applied" };
      }
      results = [true];
    } else {
      return { success: false, error: "Patch could not be applied" };
    }
  }

  if (preview) {
    return { success: true, patchedText: patched, results };
  }

  fs.writeFileSync(filePath, patched, "utf-8");
  return { success: true, results };
}
