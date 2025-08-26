import fs from "fs";
import { diff_match_patch } from "diff-match-patch";

const dmp = new diff_match_patch();

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

  // Diff + patch generation
  const diffs = dmp.diff_main(oldText, newText);
  dmp.diff_cleanupSemantic(diffs);
  const patches = dmp.patch_make(oldText, newText, diffs);

  // Apply patches fuzzily to current file
  const [patched, results] = dmp.patch_apply(patches, current);

  if (results.every((r: boolean) => !r)) {
    return { success: false, error: "Patch could not be applied" };
  }

  if (preview) {
    return { success: true, patchedText: patched, results };
  }

  fs.writeFileSync(filePath, patched, "utf-8");
  return { success: true, results };
}