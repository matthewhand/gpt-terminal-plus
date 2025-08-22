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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Ensure consistency across Local, SSH, and SSM handlers# TODO

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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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
- [ ] Clamp `limit`/`offset` in file listing
- [ ] Validate `orderBy` and reject invalid values
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