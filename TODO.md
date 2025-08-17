# TODO

## LLM Provider Plumbing
- [x] Support provider selection via `LLM_PROVIDER=ollama|open-interpreter`
- [x] Default model via `LLM_MODEL` (fallback: `gpt-oss:20b`)
- [x] Ollama host override via `OLLAMA_HOST` (e.g., `http://127.0.0.1:11434`)
- [x] Open Interpreter host/port via `INTERPRETER_SERVER_HOST`/`INTERPRETER_SERVER_PORT`
- [x] Keep existing test shim behavior when `NODE_ENV=test` and no provider set

## Dockerized Runtimes (future)
- [ ] **Ollama in Docker**
  - Image: `ollama/ollama:latest`
  - Map persistent model cache and expose `11434`
  - Allow selecting "docker mode" per server config in Settings UI
  - Auto-set `OLLAMA_HOST=http://127.0.0.1:11434` for local-docker target
- [ ] **Open Interpreter in Docker**
  - Build a minimal image that runs the interpreter server (exposes `:8000`)
  - Allow `INTERPRETER_SERVER_HOST`/`INTERPRETER_SERVER_PORT` to target the container
  - Toggle "docker mode" per server config in Settings UI

## Settings WebUI (future)
- [ ] Add a Providers section:
  - Choose provider: Ollama / Open Interpreter
  - Model text input (with sensible defaults)
  - **Transport**:
    - Local process (CLI)
    - Remote env (use provided HOST/PORT envvars)
    - **Docker mode** (start/stop container for this server profile)
  - Validate connectivity (ping/test button) and show friendly errors

## Nice-to-haves
- [ ] Model suggestions per provider (e.g., list models from Ollama `/api/tags`)
- [ ] Log viewer for provider streams
- [ ] Retry/backoff on transient errors
- [ ] Dockerize Open-Interpreter and allow enabling per server config (future Settings UI toggle)
- [ ] Dockerize Ollama and allow enabling per server config (future Settings UI toggle)

## TODO: `execute` command v2 (flex args + defaults)

**Goal:** one universal `execute` command that supports:
- **Flexible args:** key/value payloads *or* nameless/positional params (one or many).
- **Defaults:** `set_default` field to set persistent defaults for:
  - `modes`: e.g. `["shell"]` or `["python"]`
  - `shell`: default POSIX = `bash`; on Windows auto-detect and prefer `powershell`
  - `pythonEngine`: default `python3`
  - `remote`: `{ protocol: "local" | "ssh" | "ssm", host?, user? }`
- **Mode listing:** return supported modes via `listModes` flag.
- **Remote options:** if remote settings provided, use them; otherwise use defaults.
- **Back-compat:** legacy `{ command: "echo ok" }` continues to work and still returns `aiAnalysis` on non-zero exit.

**API sketch (HTTP POST /command/execute):**
- **Nameless examples**
  - `{ "params": ["echo hello"] }`
  - `{ "args": ["echo", "hello world"] }`
  - `{ "text": "echo hello" }`
- **KV examples**
  - `{ "mode": "shell", "cmd": "echo hi", "shell": "bash" }`
  - `{ "mode": "python", "code": "print('hi')", "pythonEngine": "python3.11" }`
  - `{ "modes": ["shell","python"], "remote": { "protocol": "ssh", "host": "x", "user": "y" } }`
- **Set defaults**
  - `{ "set_default": { "modes": ["shell"], "shell": "bash", "pythonEngine": "python3", "remote": { "protocol": "local" } } }`
- **List modes**
  - `{ "listModes": true }` -> `{ "modes": ["shell","python"], "defaults": { ... } }`

### Replace legacy `execute` with universal `execute`
- The old implementation effectively becomes the internal **execute_shell** path.
- New **/command/execute** supports:
  - key/value or nameless params
  - persistent `set_default` (modes, shell, pythonEngine, remote)
  - `listModes` response
  - modes: `shell` (default; bash on POSIX, powershell on Windows), `python` (default engine python3)
  - optional remote `{ protocol: "local" | "ssh" | "ssm", host?, user? }`
- Back-compat: `{ "command": "exit 2" }` still returns `aiAnalysis.text`.
