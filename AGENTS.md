# LLM Engines and Automation

This project supports multiple LLM-driven “engines” for command planning and code execution. This document explains each engine, default behavior, configuration keys, and example requests.

---

## Engines Overview

- Codex: Plans shell commands using a hosted model and can run in full-auto.
- Interpreter: Uses a local Open Interpreter-style runtime invoked via the `interpreter` CLI.
- Ollama: Uses a local Ollama server for chat/plan requests.

Use the WebUI at `/settings.html` to toggle engines and set defaults. Advanced users can override any key using the “Advanced Overrides” JSON panel.

---

## Codex

- Defaults: `CODEX_MODEL=gpt-5`, `CODEX_FULL_AUTO=true`, `CODEX_CONFIG={"model_reasoning_effort":"high"}`
- YOLO Mode: When enabled, injects into `CODEX_CONFIG`:
  - `sandbox_permissions: ["disk-full-read-access"]`
  - `approval_policy: "never"

Config keys:
- `CODEX_MODEL`: string
- `CODEX_FULL_AUTO`: boolean
- `CODEX_CONFIG`: object (JSON)

Example payload:
```json
{
  "LLM_ENGINE": "codex",
  "CODEX_MODEL": "gpt-5",
  "CODEX_FULL_AUTO": true,
  "CODEX_CONFIG": { "model_reasoning_effort": "high" }
}
```

---


## Interpreter

Runs via the `interpreter` CLI. The API calls spawn the interpreter with stdin and collect output. Use `AUTO_RUN` to allow free execution.

Config keys:
- `INTERPRETER_MODEL`: string (default `gpt-4o`)
- `INTERPRETER_TEMPERATURE`: number (default `0.7`)
- `INTERPRETER_AUTO_RUN`: boolean (default `true`)
- `INTERPRETER_LOOP`: boolean (default `false`)
- `INTERPRETER_CONTEXT_WINDOW`: number (default `8192`)
- `INTERPRETER_MAX_TOKENS`: number (default `2048`)
- `INTERPRETER_DEBUG`: boolean (default `false`)
- `INTERPRETER_SAFE_MODE`: `auto|ask|off` (default `auto`)

Example payload:
```json
{
  "LLM_ENGINE": "interpreter",
  "INTERPRETER_MODEL": "gpt-4o",
  "INTERPRETER_AUTO_RUN": true,
  "INTERPRETER_TEMPERATURE": 0.7,
  "INTERPRETER_CONTEXT_WINDOW": 8192,
  "INTERPRETER_MAX_TOKENS": 2048,
  "INTERPRETER_SAFE_MODE": "auto"
}
```

---


## Ollama

When the selected server uses `llm.provider=ollama`, requests are dispatched to its base URL and model map. For local defaults, configure via WebUI.

Config keys:
- `OLLAMA_MODEL`: string (default `llama2`)
- `OLLAMA_HOST`: string URL (default `http://localhost:11434`)
- `OLLAMA_FORMAT`: string (e.g. `text`, `json`)
- `OLLAMA_NOWORDWRAP`: boolean
- `OLLAMA_VERBOSE`: boolean

Example payload:
```json
{
  "LLM_ENGINE": "ollama",
  "OLLAMA_MODEL": "llama2",
  "OLLAMA_HOST": "http://localhost:11434",
  "OLLAMA_FORMAT": "text",
  "OLLAMA_NOWORDWRAP": false,
  "OLLAMA_VERBOSE": false
}
```

---


## Routing and Behavior

- Route: `POST /command/execute-llm`
- Body fields: `instructions`, optional `engine` and `model`, `stream` boolean
- `engine: "interpreter"` triggers the local Interpreter flow. Other values use the remote planner (Ollama by default unless per-server overrides).
- Safety: The planner output is evaluated. Dangerous commands may be flagged as `needsConfirm` and return HTTP 409 with details.
- Timeouts: LLM command execution uses a default timeout of 120s (override via `EXECUTE_LLM_TIMEOUT_MS`).

---


## Demo Script

Replace `$TOKEN` and `$BASE` with your values.

1) Codex – simple inline command
```bash
curl -sS -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"engine":"codex","instructions":"echo hello"}' \
  "$BASE/command/execute-llm"
```

2) Codex – needs confirmation
```bash
curl -sS -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"engine":"codex","instructions":"rm -rf /tmp/test"}' \
  "$BASE/command/execute-llm"
# Expect 409 with reason: needs-confirmation
```

3) Interpreter – auto_run
```bash
curl -sS -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"engine":"interpreter","instructions":"print(\"hi\")"}' \
  "$BASE/command/execute-llm"
```

4) Ollama – simple prompt
```bash
curl -sS -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"engine":"ollama","instructions":"write me a haiku"}' \
  "$BASE/command/execute-llm"
```

5) WebUI
- Open `/settings.html`, switch engines, submit.
- Inspect the request body in the browser dev tools Network tab.

---


## Notes

- This repo does not expose separate `CodexEngine.ts`/`InterpreterEngine.ts`/`OllamaEngine.ts` files. Engines are wired via `routes/command/executeLlm.ts` and provider implementations under `src/llm/providers/*`.
- `/config/override` and `/config/schema` may be added; the WebUI already sends a structured body that will work with a future endpoint.

### Circuit Breakers

All engines respect configured circuit breakers:

- Input: requests exceeding `MAX_INPUT_CHARS` are rejected (or truncated if allowed).
- Output: combined stdout+stderr is clipped at `MAX_OUTPUT_CHARS` with termination.
- Sessions: `/shell/session/*` enforces `MAX_SESSION_DURATION` and `MAX_SESSION_IDLE`.
- Budget: when `MAX_LLM_COST_USD` is set, new LLM requests are rejected once exceeded.

Terminated operations return partial outputs and flags: `truncated: true`, `terminated: true`.

### Authentication

- API key is required for most routes (Bearer token).
- Set/rotate your key from the WebUI (Settings → API Token) or via env `API_TOKEN`.
- Keys are always redacted in settings responses (`[REDACTED]`).