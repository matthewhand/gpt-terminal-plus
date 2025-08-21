# Session Mode Architecture Overview

## 1. Why Sessions?
Most current executions (`shell`, `code`, `llm`) are stateless: each request runs in isolation.

Some use cases require *stateful execution*, where context persists across multiple commands:
- Shell sessions with maintained environment and working directory
- Python/TypeScript REPLs retaining variables
- LLM conversations retaining chat history

Introducing **Session Mode** provides a unified abstraction for persistent execution contexts.

---

## 2. Unified Abstraction
A Session is defined as:
```ts
Session = { id: string, mode: string, server: string, state: object }
```
- **id**: Stable identifier for lookup
- **mode**: Execution type (`shell`, `python`, `typescript`, `llm`)
- **server**: Where it runs (`local`, `ssh`, `ssm`)
- **state**: Context maintained across executions

---

## 3. Driver Responsibilities
Each mode implements a `SessionDriver` interface:
```ts
interface SessionDriver {
  start(opts): Promise<SessionMeta>;
  exec(id: string, input: string): Promise<ExecutionResult>;
  stop(id: string): Promise<void>;
  logs(id: string, since?: string): Promise<ExecutionLog[]>;
}
```
- **ShellSessionDriver**: Manages PTY processes (local/ssh/ssm)
- **PythonSessionDriver**: Wraps REPL, keeps variables/imports
- **TypeScriptSessionDriver**: Wraps ts-node REPL
- **LlmSessionDriver**: Maintains conversation state

---

## 4. Session Registry
A central registry maps session IDs → drivers. Routes call into the registry to perform lifecycle ops.
```ts
SessionRegistry = Map<string, { driver: SessionDriver, meta: SessionMeta }>
```

---

## 5. API Surface

### Lifecycle Routes
- `POST /session/start` → Create new session
- `POST /session/{id}/exec` → Execute command/input
- `POST /session/{id}/stop` → Terminate session
- `GET /session/{id}/logs` → Retrieve past logs
- `GET /session/list` → List active sessions

### Example
```json
POST /session/start
{ "mode": "python", "server": "local" }
→ { "id": "sess-123", "startedAt": "..." }
```

---

## 6. Persistence Model
Logs and metadata stored under:
```
data/activity/YYYY-MM-DD/session_<id>/
  meta.json
  01-exec.json
  02-exec.json
```
Ensures audit trail and replay capability.

---

## 7. Extensibility
Adding a new mode requires:
1. Implementing a new `SessionDriver`
2. Registering it in the registry
3. Adding docs & tests

---

## 8. Security Considerations
- Sessions are long-lived; must enforce TTL and idle cleanup
- Stronger permission model (admin-only by default)
- Disable by default via env flag `ENABLE_SESSIONS`

---

## 9. Configuration
Example config toggle:
```json
{
  "executionModes": {
    "shell": true,
    "code": true,
    "llm": true,
    "session": false
  }
}
```
Or via `.env`:
```env
ENABLE_SESSIONS=false
```

---

## 10. Next Steps
- Write comment stubs for drivers and registry
- Add OpenAPI annotations for new endpoints
- Implement shell sessions first, then extend to python/ts/llm

