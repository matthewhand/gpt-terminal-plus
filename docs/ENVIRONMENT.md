# Environment and Configuration

This document explains the runtime configuration system, how environment variables map to the Convict schema, default values, secret redaction behavior, and how the public base URL for OpenAPI is derived. It also shows how to safely inspect the effective configuration at runtime.

- Core sources:
  - [src/config/convictConfig.ts](src/config/convictConfig.ts)
  - [src/openapi.ts](src/openapi.ts)
  - [public/index.html](public/index.html)
  - [public/settings.html](public/settings.html)

- Deterministic API artifacts:
  - [public/openapi.json](public/openapi.json)
  - [public/openapi.yaml](public/openapi.yaml)
  - Swagger UI: GET /docs (points to /openapi.json)

- Make targets:
  - [Makefile](Makefile)
    - `make test` (preferred), `make lint`, `make build`


Quick start

- Start the server and open [public/settings.html](public/settings.html) in your browser. It calls GET /settings and renders a redacted view (secrets masked; env-overridden values are read-only).
- Fetch redacted settings via CLI:
  - curl -H "Authorization: Bearer <YOUR_API_TOKEN>" http://localhost:5005/settings
- Deterministic OpenAPI artifacts are served at:
  - GET /openapi.json
  - GET /openapi.yaml
  - Swagger UI: GET /docs


Configuration precedence

- Defaults are defined in the Convict schema.
- Environment variables (process.env) override defaults.
- The server reads directly from process.env (e.g., exported in your shell or loaded by your process manager).
- Some compatibility environment variables are exposed under llm.compat for node-config style interop.


Secrets and redaction

- The following paths are treated as sensitive and masked in the redacted settings returned by GET /settings:
  - security.apiToken
  - llm.openai.apiKey
- When an environment variable is present for a config key, that key is marked readOnly in the redacted response to signal the value is controlled outside of the app.
- The /settings endpoint is protected by HTTP Bearer auth using the API_TOKEN:
  - Pass Authorization: Bearer <YOUR_API_TOKEN> on requests.
  - The minimal UI in [public/settings.html](public/settings.html) will prompt for the token if not present.


Public base URL derivation for OpenAPI servers[0].url

The URL exposed in the OpenAPI servers list is chosen with a static-first mindset but adapts to proxies:

1. If server.publicBaseUrl (env PUBLIC_BASE_URL) is set, it is used verbatim.
2. Otherwise, the server attempts to derive it from the incoming request:
   - Prefer X-Forwarded-Proto and X-Forwarded-Host if present (typical in reverse-proxy setups).
   - Fall back to the request protocol and host or to PUBLIC_HOST plus server.port when headers are missing.
3. HTTPS and PORT environment hints can influence derivation depending on platform.

This keeps local development convenient while ensuring production deployments behind proxies emit correct absolute URLs in generated OpenAPI docs and in startup logs.

Tip: When deploying behind a proxy, explicitly set PUBLIC_BASE_URL (e.g., https://api.example.com) to make the advertised URL unambiguous.


Schema reference (Convict)

Server (env group: server)
- port
  - Type: port
  - Default: 5005
  - Env: PORT
- httpsEnabled
  - Type: boolean
  - Default: false
  - Env: HTTPS_ENABLED
- httpsKeyPath
  - Type: string (path)
  - Default: ""
  - Env: HTTPS_KEY_PATH
- httpsCertPath
  - Type: string (path)
  - Default: ""
  - Env: HTTPS_CERT_PATH
- corsOrigin
  - Type: string (CSV list)
  - Default: "https://chat.openai.com,https://chatgpt.com"
  - Env: CORS_ORIGIN
- disableHealthLog
  - Type: boolean
  - Default: false
  - Env: DISABLE_HEALTH_LOG
- sseHeartbeatMs
  - Type: natural number (ms)
  - Default: 15000
  - Env: SSE_HEARTBEAT_MS
- useServerless
  - Type: boolean
  - Default: false
  - Env: USE_SERVERLESS
- useMcp
  - Type: boolean
  - Default: false
  - Env: USE_MCP
- publicBaseUrl
  - Type: string (absolute URL)
  - Default: ""
  - Env: PUBLIC_BASE_URL
- publicHost
  - Type: string (host name for derivation fallback)
  - Default: "localhost"
  - Env: PUBLIC_HOST

Security (env group: security)
- apiToken
  - Type: string (sensitive)
  - Default: ""
  - Env: API_TOKEN
  - Notes: Used for Bearer auth to protected endpoints such as GET /settings.
- denyCommandRegex
  - Type: string (CSV of regex patterns)
  - Default: ""
  - Env: DENY_COMMAND_REGEX
- confirmCommandRegex
  - Type: string (CSV of regex patterns)
  - Default: ""
  - Env: CONFIRM_COMMAND_REGEX

LLM (env group: llm)
- provider
  - Type: enum: ["openai", "ollama", "lmstudio", "open-interpreter", "auto", ""]
  - Default: ""
  - Env: AI_PROVIDER
- openai.baseUrl
  - Type: string (URL)
  - Default: ""
  - Env: OPENAI_BASE_URL
- openai.apiKey
  - Type: string (sensitive)
  - Default: ""
  - Env: OPENAI_API_KEY
- ollama.baseUrl
  - Type: string (URL)
  - Default: ""
  - Env: OLLAMA_BASE_URL
- lmstudio.baseUrl
  - Type: string (URL)
  - Default: ""
  - Env: LMSTUDIO_BASE_URL

Compatibility (llm.compat)
- llmProvider
  - Default: ""
  - Env: LLM_PROVIDER
- llmModel
  - Default: ""
  - Env: LLM_MODEL
- ollamaHost
  - Default: ""
  - Env: OLLAMA_HOST
- interpreterHost
  - Default: ""
  - Env: INTERPRETER_SERVER_HOST
- interpreterPort
  - Type: port
  - Default: 0
  - Env: INTERPRETER_SERVER_PORT
- interpreterOffline
  - Type: boolean
  - Default: false
  - Env: INTERPRETER_OFFLINE
- interpreterVerbose
  - Type: boolean
  - Default: true
  - Env: INTERPRETER_VERBOSE


Operational guidance

- Development
  - Start the server; open [public/index.html](public/index.html) for links to docs and settings UI.
  - Use GET /docs for Swagger UI. It is configured to load the static JSON at /openapi.json to preserve determinism.
- Testing and linting
  - Use [Makefile](Makefile) targets: `make test`, `make lint`, `make build`.
- Security
  - Never log secrets. Examples in this document use placeholders rather than real tokens.
  - Keep API_TOKEN secret; rotate regularly.


Examples (no secrets shown; placeholders only)

- Minimal environment for local development:
  - PORT=5005
  - PUBLIC_BASE_URL=http://localhost:5005
  - AI_PROVIDER=ollama
  - OLLAMA_BASE_URL=http://127.0.0.1:11434

- OpenAI-compatible provider (example; do not hardcode secrets):
  - AI_PROVIDER=openai
  - OPENAI_BASE_URL=https://api.openai.com/v1
  - OPENAI_API_KEY=${OPENAI_API_KEY}

- Behind a reverse proxy (recommended):
  - PUBLIC_BASE_URL=https://api.example.com


Related endpoints and assets

- GET /settings
  - Protected with Bearer auth (API_TOKEN)
  - Returns grouped, redacted configuration with readOnly flags when values are overridden via environment
- UI: [public/settings.html](public/settings.html)
- OpenAPI: [public/openapi.json](public/openapi.json), [public/openapi.yaml](public/openapi.yaml)
- Swagger UI: GET /docs
- Plugin manifest: GET /.well-known/ai-plugin.json


Notes on determinism

- OpenAPI artifacts are generated deterministically at build/start via scripts and served statically when present.
- The server will dynamically rebuild the spec only when static artifacts are missing or invalid.
- Startup logs print absolute URLs to assist with deployment verification.