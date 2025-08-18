# TODO

## Epic: Keep app working without AI; add optional LLM cleanly
- [ ] Add `llm` block to settings schema (enabled, provider, defaultModel, baseURL, apiKey, ollamaURL, lmstudioURL)
- [ ] Add env overrides + resolver (`LLM_ENABLED`, `LLM_PROVIDER`, `LLM_DEFAULT_MODEL`, `OPENAI_BASE_URL`, `OPENAI_API_KEY`, `OLLAMA_URL`, `LM_STUDIO_URL`)
- [ ] Patch OpenAI provider to honor `baseURL` (LiteLLM/OpenAI/vLLM/TGI/LM Studio)
- [ ] Add central `getLlmClient()` + `getDefaultModel()` selector (maps provider → client)
- [ ] Gate `/chat/completions` + `/model` routes (return friendly 409 if disabled)
- [ ] Make `errorAdvisor` no-op when LLM disabled (silent, no logs)
- [ ] Add friendly "instance not configured" message for `/command/executeLlm`
- [ ] (Optional) Make `/command/execute` a safe alias to first/primary enabled mode
- [ ] (Optional) Deprecate `executeFile` by delegating to shell

## Epic: Minimal WebUI to reflect capability
- [ ] Setup → LLM panel: enable toggle, provider dropdown, fields per provider
- [ ] "Test" button (pings `/model` or a noop chat) with ✅/error
- [ ] Auto-disable chat/stream/advisor UI when LLM disabled

## Epic: Remote reuse (already mostly works)
- [ ] Confirm file/folder ops use SSH/SSM when selected (no code change if already wired)
- [ ] (Later) `executeLlm` CLI runners reuse SSH/SSM transparently

## Settings WebUI
- [ ] MVP panel to configure:
  - LLM providers (Open-Interpreter, Ollama, OpenAI-compatible).
  - Python templates (uv) CRUD with validation.
  - Server/target list with `allowedTokens`.
  - Health checks (“ping provider”, “list models”).
- [ ] **Stretch:** Runtime config editing UI (respect env-overridden fields as read-only)
- [ ] **Docs:** env var reference for advanced users (**no secrets in examples**; use `${...}` placeholders).
- [ ] “Add to ChatGPT” instructions (point to `/openapi.json` or `/openapi.yaml`).

## Epic: Docs + DX
- [ ] Update `.env.sample`
- [ ] Update `README` (LLM optional; how to enable + test)
- [ ] Note deprecation of `executeFile`

## Epic (Future / Nice-to-have)
- [ ] Provider strategy: single / fallback / round-robin / weighted RR
- [ ] Brand-less protocol adapters (openai-compat, ollama) to remove vendor code entirely

