# Using gpt-terminal-plus as an mcp-gateway server (OAuth)

gpt-terminal-plus exposes a clean OpenAPI 3.0.3 spec that can be consumed by
[`mcp-openapi-proxy`](https://github.com/matthewhand/mcp-openapi-proxy) and
fronted by [`mcp-gateway`](https://github.com/matthewhand/mcp-gateway) so an
LLM client can call it over MCP with **OAuth2** auth.

## The OpenAPI spec

| What | Where |
|---|---|
| **Canonical runtime spec (use this)** | `GET /openapi.json` — dynamic, complete, served by the running app |
| YAML form | `GET /openapi.yaml` |
| Swagger UI | `GET /docs` |
| Static artifact (sparse, JSDoc-derived) | `public/openapi.json` / `public/openapi.yaml` — **incomplete; do not use for the gateway** |

The runtime `/openapi.json` is the source of truth: it is built in
`src/openapi.ts` (`buildSpec()`), is OpenAPI **3.0.3**, validates clean under
`redocly lint` (0 errors), and carries `tags`, `operationId`s, request/response
schemas, and `bearerAuth` security on every operation.

> Note: the static `public/openapi.*` artifacts are generated from JSDoc by
> `scripts/generate-openapi.cjs` and are **not** a full mirror of the runtime
> surface. Point the gateway at the live `/openapi.json`.

### Base URL & auth

- Base URL (local): `http://localhost:3100`
- Auth: HTTP Bearer — `Authorization: Bearer <API_TOKEN>` (the 64-char token in `.env`).
- Behind a public proxy, set `PUBLIC_BASE_URL` so `servers[0].url` is correct
  (the gateway also sets `SERVER_URL_OVERRIDE`, which wins regardless).

## Architecture once registered

```
LLM client ──OAuth2──▶ nginx (mcp.teamstinky.duckdns.org)
                         │  /oauth/ex/gpt-terminal-plus/mcp  (auth_request → oauth-server :8780)
                         ▼
                       supergateway + mcp-openapi-proxy   (mcp-server@gpt-terminal-plus, :8815)
                         │  fetches /openapi.json, injects Bearer API_KEY
                         ▼
                       gpt-terminal-plus app  (:3100)
```

Two auth layers:
1. **Gateway (OAuth2)** — client → nginx validates the OAuth JWT (`client_id=grok`,
   PKCE S256, scope `mcp`). Identical to the other 14 gateway servers.
2. **Upstream (Bearer)** — the proxy calls the app with `Authorization: Bearer <API_TOKEN>`
   (`API_KEY` in the manifest entry).

## Manifest entry (already added to `~/mcp-gateway/servers.json`)

```jsonc
"gpt-terminal-plus": {
  "port": 8815,
  "spec_url": "http://localhost:3100/openapi.json",
  "env": {
    "TOOL_WHITELIST": "/command/execute-shell,/command/execute-llm,/command/executors,/server/list,/file/create,/file/read,/file/list,/file/update,/file/patch,/file/diff",
    "API_KEY": "<the app's 64-char API_TOKEN>",
    "API_AUTH_TYPE": "Bearer",
    "SERVER_URL_OVERRIDE": "http://localhost:3100"
  }
}
```

The whitelist yields **15 MCP tools** (prefix match expands `/command/executors`
and the GET shims):

`get_server_list`, `post_command_execute_shell`, `get_command_executors`,
`post_command_executors_by_name_{toggle,test,update}`, `post_command_execute_llm`,
`post_file_create`, `post_file_list`, `get_file_list`, `post_file_read`,
`get_file_read`, `post_file_update`, `post_file_diff`, `post_file_patch`.

### Recommended tools to expose

The terminal-control essentials — keep the surface small and high-signal:

| Tool | Why |
|---|---|
| `post_command_execute_shell` | Run shell commands on the active server (the core capability) |
| `post_command_execute_llm` | Run an LLM plan / natural-language instruction |
| `get_command_executors` | Discover available executors (bash, python, …) |
| `get_server_list` | See which targets are registered |
| `post_file_read` / `post_file_list` | Inspect files & directories |
| `post_file_create` / `post_file_update` | Write & edit files |
| `post_file_diff` / `post_file_patch` | Apply diffs/patches |

> ⚠️ `post_command_execute_shell` is arbitrary remote command execution. It is
> protected by OAuth at the edge and a Bearer token upstream, and the app runs
> as the unprivileged `chatgpt` user — but treat access as you would shell access.

## Activation (requires sudo — one command)

The manifest entry and the spec changes are in place, but the privileged steps
(systemd units + nginx edge route + reload) must be applied once:

```bash
sudo bash /mnt/models/projects/dormant/gpt-terminal-plus/deploy/register-mcp-gateway.sh
```

That script (idempotent) does exactly three things:
1. installs & starts `gpt-terminal-plus.service` (the app upstream on :3100);
2. adds the `location /oauth/ex/gpt-terminal-plus/mcp` block to nginx and reloads;
3. enables & starts `mcp-server@gpt-terminal-plus` (the :8815 backend).

### Public endpoints after activation

- MCP (OAuth): `https://mcp.teamstinky.duckdns.org/oauth/ex/gpt-terminal-plus/mcp`
- OAuth discovery: `https://mcp.teamstinky.duckdns.org/.well-known/oauth-authorization-server`

## Verifying

```bash
# app spec is valid + complete
curl -s localhost:3100/openapi.json | npx -y @redocly/cli@latest lint /dev/stdin

# backend lists tools over MCP (StreamableHTTP)
python3 /tmp/mcp_http.py        # helper used during setup; lists 15 tools + calls get_server_list
```
