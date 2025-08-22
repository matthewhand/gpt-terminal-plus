# GPT Terminal Plus

A modular terminal server with pluggable engines (shells, file ops, LLMs) and a WebUI for configuration.

---

## ✨ Features

- 🔧 Execution Engines: local shell, remote shell (SSH/SSM), file ops, LLM planning
- 🤖 LLM Engines: Codex, Interpreter, Ollama
- 🛡️ Automation: full-auto, ask-to-approve, YOLO toggle (dangerous)
- 🌐 WebUI: `/settings.html` with engine panels + Advanced JSON overrides
- 🧰 General settings: localhost toggle, file ops, SSH/SSM targets, allowed shells
- 📜 Live OpenAPI preview on the settings page
- ⚙️ Config: Convict-backed schema, `.env` overrides, future `/config/override`, `/config/schema`

---

## 🚀 Usage

### Start Server
```bash
npm start
```

### Configure via WebUI
Visit `http://localhost:PORT/settings.html`.

- Choose LLM Engine: Codex, Interpreter, or Ollama
- Fill engine panel fields; use Advanced Overrides for any key
- Submit to send JSON to `/config/override` (if implemented)
- Toggle General Settings and watch the OpenAPI preview update in real time

### Example LLM Configs

Codex
```json
{
  "LLM_ENGINE": "codex",
  "CODEX_MODEL": "gpt-5",
  "CODEX_FULL_AUTO": true,
  "CODEX_CONFIG": { "model_reasoning_effort": "high" }
}
```

Interpreter
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

Ollama
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

## 🔒 Authentication
- API uses bearer token (see `.env` or generated on start)
- WebUI management: set custom API key via `/settings.html`
  - Type custom key or click “Generate” (32 chars, alphanumeric)
  - Overrides temporary token, updates in-memory config immediately
  - Token is always redacted in settings responses as `[REDACTED]`
- `/healthz` is public; most routes require token

---

## 📚 Related Docs
- [AGENTS.md](./AGENTS.md) — engine details, session behavior, config examples
- [PACKAGE.md](./PACKAGE.md) — release notes and packaging

---

## 🧯 Circuit Breakers for Full Auto Mode

To prevent runaway cost or output floods in Full Auto / YOLO modes, runtime limits are enforced:

- MAX_INPUT_CHARS: rejects long inputs or truncates if allowed.
- MAX_OUTPUT_CHARS: cuts off combined stdout+stderr and terminates the process with partial output.
- MAX_SESSION_DURATION / MAX_SESSION_IDLE: shell sessions terminated on breach.
- MAX_LLM_COST_USD: if set, subsequent LLM requests are rejected once budget is exceeded.

All terminations return partial output with flags:
`{ stdout, stderr, exitCode?, truncated?: true, terminated?: true, error?: string }`.
