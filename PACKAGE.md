# Package & Release Notes

This document tracks notable updates and packaging details.

---

## Releases

### Unreleased
- WebUI Settings overhaul:
  - Added engine-specific panels (Codex, Interpreter, Ollama)
  - Codex defaults: `gpt-5`, full-auto, JSON config with `model_reasoning_effort=high`
  - YOLO toggle injects sandbox + approval policy for Codex
  - Interpreter defaults and type-correct casting on submit
  - Ollama panel: model, host, format, no-word-wrap, verbose
  - Advanced Overrides merged last; JSON validation for both Codex config and overrides
- General Settings + OpenAPI Preview:
  - Localhost handler toggle, File Ops toggle, Allowed shells (multi-select)
  - SSH and SSM targets management tables
  - Live OpenAPI YAML preview (`GET /config/openapi`) that filters paths based on toggles
- feat(circuit): enforce input/output/session/budget limits with graceful termination and partial outputs
- feat(config): allow secure API key override via WebUI with generator; redacted in settings
- Documentation sync:
  - New `AGENTS.md` explaining engines, routing, and demo commands
  - Cleaned `README.md` with features and examples
- Convict schema additions:
  - `execution.llm.timeoutMs` with `EXECUTE_LLM_TIMEOUT_MS`
  - `engines.codex/*`, `engines.interpreter/*`, `engines.ollama/*` keys (mapped to env vars)

---

## Packaging

- Node 18+ recommended.
- No binary dependencies required for Ollama or OpenAI-compatible providers; Interpreter engine requires `interpreter` CLI on PATH.
