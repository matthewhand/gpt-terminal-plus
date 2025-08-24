# TODO

## 🔧 Priority 1 — Activity Logging
- [ ] Session activity logging improvements
- [ ] Enhanced error tracking and reporting
- [ ] Performance metrics collection

## 🔧 Priority 2 — File Handling
### File Listing
- [ ] Default path → `.` if none provided
- [ ] Pagination for large directories
- [ ] Normalize paths with `path.resolve`, prevent traversal
- [ ] Handle symlink/stat errors safely

### File Patching
- [x] Implement **`applyFilePatch`** (fuzzy patching)
  - New file: `src/handlers/local/actions/applyFilePatch.ts`
  - Uses `https://www.npmjs.com/package/diff-match-patch`
  - Signature:
    ```ts
    interface ApplyFilePatchOptions {
      filePath: string;
      oldText: string;
      newText: string;
      preview?: boolean;
    }
    export function applyFilePatch(opts: ApplyFilePatchOptions): {
      success: boolean;
      patchedText?: string;
      results?: boolean[];
      error?: string;
    };
    ```
  - Behavior:
    - Fuzzy matching to apply hunks even if file drifted
    - Dry-run mode with `preview`
    - Reject if no hunks applied
  - Future:
    - Support `mode: "replace" | "insert" | "delete"`
    - Support `startLine` / `endLine`
- [ ] Update merge conflict workflows to use `applyFilePatch`
- [ ] Deprecate `updateFile` (keep temporarily for trivial replaces)

## 🔧 Priority 3 — Logging & Guards
- [ ] Enhanced security logging
- [ ] Input validation improvements
- [ ] Rate limiting implementation

## 🔧 Priority 4 — TypeScript & Build
- [ ] Type safety improvements
- [ ] Build optimization
- [ ] Dependency updates

## 🔧 Later — MCP Integration
- [ ] MCP protocol enhancements
- [ ] Tool integration improvements
- [ ] Performance optimizations

## 🔧 LLM Features
### Core LLM Integration
- [ ] Add `llm` block to settings schema (enabled, provider, defaultModel, baseURL, apiKey, ollamaURL, lmstudioURL)
- [ ] Add env overrides + resolver (`LLM_ENABLED`, `LLM_PROVIDER`, `LLM_DEFAULT_MODEL`, `OPENAI_BASE_URL`, `OPENAI_API_KEY`, `OLLAMA_URL`, `LM_STUDIO_URL`)
- [ ] Patch OpenAI provider to honor `baseURL` (LiteLLM/OpenAI/vLLM/TGI/LM Studio)
- [ ] Add central `getLlmClient()` + `getDefaultModel()` selector (maps provider → client)
- [ ] Gate `/chat/completions` + `/model` routes (return friendly 409 if disabled)
- [ ] Make `errorAdvisor` no-op when LLM disabled (silent, no logs)
- [ ] Add friendly "instance not configured" message for `/command/executeLlm`
- [ ] (Optional) Make `/command/execute` a safe alias to first/primary enabled mode
- [ ] (Optional) Deprecate `executeFile` by delegating to shell

### WebUI Integration
- [ ] Setup → LLM panel: enable toggle, provider dropdown, fields per provider
- [ ] "Test" button (pings `/model` or a noop chat) with ✅/error
- [ ] Auto-disable chat/stream/advisor UI when LLM disabled

### Remote Reuse
- [ ] Confirm file/folder ops use SSH/SSM when selected (no code change if already wired)
- [ ] (Later) `executeLlm` CLI runners reuse SSH/SSM transparently

### Settings WebUI
- [ ] MVP panel to configure:
  - LLM providers (Open-Interpreter, Ollama, OpenAI-compatible).
  - Python templates (uv) CRUD with validation.
  - Server/target list with `allowedTokens`.
  - Health checks ("ping provider", "list models").
- [ ] **Stretch:** Runtime config editing UI (respect env-overridden fields as read-only)
- [ ] **Docs:** env var reference for advanced users (**no secrets in examples**; use `${...}` placeholders).
- [ ] "Add to ChatGPT" instructions (point to `/openapi.json` or `/openapi.yaml`).

## 🔧 Documentation & DX
- [ ] Update `.env.sample`
- [ ] Update `README` (LLM optional; how to enable + test)
- [ ] Note deprecation of `executeFile`

## 🔧 Future / Nice-to-have
- [ ] Provider strategy: single / fallback / round-robin / weighted RR
- [ ] Brand-less protocol adapters (openai-compat, ollama) to remove vendor code entirely

## ✅ Completed
- [x] Test coverage for critical utilities (GlobalStateHelper, fileOperations, activityLogger)
- [x] Test coverage for services (interpreterClient, ollamaClient)
