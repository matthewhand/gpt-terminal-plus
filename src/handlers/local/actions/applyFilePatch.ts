import fs from "fs";
import { diff_match_patch } from "diff-match-patch";

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

  // Use diff-match-patch for fuzzy matching to apply hunks even if file drifted
  const dmp = new diff_match_patch();
  
  // Create patches from oldText to newText
  const patches = dmp.patch_make(oldText, newText);
  
  if (patches.length === 0) {
    return { success: false, error: "No patches to apply" };
  }

  // Apply patches to current file content with fuzzy matching
  const [patchedText, results] = dmp.patch_apply(patches, current);
  
  // Check if any hunks were successfully applied
  const appliedCount = results.filter(Boolean).length;
  if (appliedCount === 0) {
    return { success: false, error: "No hunks could be applied - file may have drifted too much" };
  }

  if (preview) {
    return { 
      success: true, 
      patchedText, 
      results,
      error: appliedCount < results.length ? `Only ${appliedCount}/${results.length} hunks applied` : undefined
    };
  }

  fs.writeFileSync(filePath, patchedText, "utf-8");
  return { 
    success: true, 
    results,
    error: appliedCount < results.length ? `Only ${appliedCount}/${results.length} hunks applied` : undefined
  };
}
