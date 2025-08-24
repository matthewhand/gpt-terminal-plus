# TODO

## 🔝 Priority 1 — Activity Logging + WebUI Integration
### Backend
- [ ] Activity logging utility
  - `logSessionStep(type, payload, sessionId?)`
  - Write JSON logs to `data/activity/yyyy-mm-dd/session_xxx/`
  - File naming convention: `01-executeShell.json`, `02-fileRead.json`, etc.
  - `meta.json` for session metadata
- [ ] Activity API
  - `GET /activity/list` → paginated executions
  - Filters: endpoint type, status
  - Response includes: function, timestamp, input (truncated), output (truncated), success/error

### Realtime
- [ ] WebSocket/SSE streaming
  - Event format: `{ id, type, timestamp, input, output, status }`

### Frontend
- [ ] WebUI Activity tab
  - Live list of ~50 latest executions
  - Filters: endpoint type + status
  - Colored chips: ✅ success, ⚠️ warning, ❌ error

---

## 🔧 Priority 2 — File Handling
### File Listing
- [ ] Default path → `.` if none provided
- [ ] Pagination for large directories
- [ ] Normalize paths with `path.resolve`, prevent traversal
- [ ] Handle symlink/stat errors safely

### File Patching
- [ ] Implement **`applyFilePatch`** (fuzzy patching)
  - New file: `src/handlers/local/actions/applyFilePatch.ts`
  - Uses [`diff-match-patch`](https://www.npmjs.com/package/diff-match-patch)
  - Signature:
    ```ts
    interface ApplyFilePatchOptions {
      filePath: string;
      oldText: string;
      newText: string;
      preview?: boolean;
    }
    ```
    Returns `{ success, patchedText?, results?, error? }`.
  - Behavior:
    - Fuzzy matching to apply hunks even if file drifted
    - Dry-run mode with `preview`
    - Reject if no hunks applied
  - Future:
    - Support `mode: "replace" | "insert" | "delete"`
    - Support `startLine` / `endLine`
- [ ] Update merge conflict workflows to use `applyFilePatch`
- [ ] Deprecate `updateFile` (keep temporarily for trivial replaces)

---

## 🛠 Priority 3 — Logging & Guards
- [ ] Truncated stdout/stderr logging in `executeCode`
- [ ] Ensure raw + wrapper logs in `executeCommand`

---

## 🧱 Priority 4 — TypeScript & Build
- [ ] Fix type error: `Type 'string' is not assignable to type ...`
- [ ] Ensure `npm run lint` passes
- [ ] Ensure `npm test` passes (fix ResponseTooLargeError)

---

## 📝 Later
- [ ] Abstract common actions (`getSystemInfo`, `presentWorkingDirectory`) into shared layer
- [ ] Ensure consistency across Local, SSH, and SSM handlers
- [ ] Fix test runner env: jest fails due to missing bash

---

## 🚀 MCP Integration
- [ ] Profile-based MCP tool configuration
- [ ] Runtime tool discovery from MCP instance
- [ ] Publish discovered tools as OpenAPI endpoints (per profile)

---

## ✨ LLM Features
- [ ] Investigate restricted output grammar for OpenAPI spec generation
- [ ] Goal: auto-generate OpenAPI spec from discovered tools

---

## ✅ Completed
- [x] Fixed hanging tests (removed corrupted file, TypeScript fixes)
- [x] Fixed OpenAPI spec: cleaned up `/file/list`
- [x] Added `changeDirectory` endpoint for Local, SSH, SSM
