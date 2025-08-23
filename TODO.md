# TODO

## 🔝 Priority 1 — Activity Logging + WebUI Integration
- [ ] **Activity logging utility**
  - `logSessionStep(type, payload, sessionId?)`
  - Write JSON logs to `data/activity/yyyy-mm-dd/session_xxx/`
  - Files like: `01-executeShell.json`, `02-fileRead.json`, etc.
  - `meta.json` for session metadata.

- [ ] **Activity API**
  - `GET /activity/list` → paginated recent executions
  - Response includes: function, timestamp, input (truncated), output (truncated), success/error
  - Filters: endpoint type, status

- [ ] **WebSocket/SSE streaming**
  - Push logs in real time to WebUI
  - Event format: `{ id, type, timestamp, input, output, status }`

- [ ] **Frontend WebUI**
  - Add Activity tab in Admin UI
  - Live list of ~50 latest executions
  - Colored chips: ✅ success, ⚠️ warning, ❌ error
  - Filters: endpoint type + status

---

## 🔧 Priority 2 — File Listing Fixes
- [ ] Default path → `.` if none provided
- [ ] Implement pagination for large responses

---

## 🛠 Priority 3 — Logging & Guards
- [ ] Add truncated stdout/stderr logging in `executeCode`
- [ ] Ensure raw + wrapper logs in `executeCommand`
- [x] Clamp `limit`/`offset` in file listing
- [x] Validate `orderBy` and reject invalid values (+ comprehensive parameter validation)
- [ ] Handle symlink/stat errors safely
- [ ] Normalize paths with `path.resolve`, prevent traversal

---

## 🧱 Priority 4 — TypeScript & Build Fixes
- [ ] Use shared `ListParams` type in `LocalServerHandler.listFiles`
- [ ] Fix build error: `Type 'string' is not assignable to type ...`
- [ ] Ensure `npm run lint` passes
- [ ] Ensure `npm run build` passes
- [ ] Ensure `npm test` passes (fix ResponseTooLargeError)

---

## 📝 Later
- [ ] Abstract common actions (`getSystemInfo`, `presentWorkingDirectory`) to shared layer
- [ ] Ensure consistency across Local, SSH, and SSM handlers
- [ ] Fix test runner environment: npm test fails due to missing bash. Ensure jest can run (install bash or adapt scripts).

---

## ✅ Completed Changes
- [x] **Fixed hanging tests:** Identified and removed a corrupted file (`/home/chatgpt/gpt-terminal-plus/[D@dn@8`), and resolved TypeScript errors in `src/tests/handlers/ssh/actions/getSystemInfo.test.ts` and `src/tests/routes/shell/websocket.test.ts`.
- [x] **Fixed OpenAPI spec:** Removed redundant `GET` method for `/file/list` and updated `operationId` to `fileList`.
- [x] **Added change working directory endpoint:** Implemented `changeDirectory` action for local, SSH, and SSM handlers, and integrated it into the session route (`POST /shell/session/{id}/cd`).

---

## 🚀 MCP Integration
- [ ] **MCP Configuration**
  - Add support for MCP tool configurations in profiles (e.g., `mcp-npx-fetch`).
- [ ] **Runtime Tool Discovery**
  - Interrogate the MCP instance at runtime to discover available tools.
- [ ] **OpenAPI Endpoint Publication**
  - Dynamically publish discovered MCP tools as OpenAPI endpoints.
  - Ensure this is on a per-profile basis.

---

## ✨ LLM Features
- [ ] **Output Grammar for OpenAPI Spec Generation**
  - Investigate if `gpt-oss:20b` can reliably generate OpenAPI specs based on a restricted output grammar.
  - Goal: Automate OpenAPI spec generation from tool discovery.