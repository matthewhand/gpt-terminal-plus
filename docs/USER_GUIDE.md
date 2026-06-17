# User Guide

A walkthrough of gpt-terminal-plus from first start to auditing what your
agent did, with screenshots captured from a live instance running mock data.

> Screenshots are regenerated with `npm run docs:screenshots`
> (Playwright boots the server on a scratch port with a demo token and
> seeded activity data, then captures every page). If you change the WebUI,
> re-run it and commit the updated images in `docs/screenshots/`.

## 1. Start the server

```bash
npm install
npm run build
API_TOKEN=your-secret npm start        # default port 5005
```

Open `http://localhost:5005/` — the landing page links every surface of the
product: the dashboard, settings, and the interactive API docs.

![Landing page](screenshots/01-landing.png)

## 2. Explore the API

`/docs` serves Swagger UI from the generated OpenAPI spec. This same spec
(`/openapi.json`) is what you paste into a ChatGPT Custom GPT action or any
OpenAPI-aware agent framework, and the `/.well-known/ai-plugin.json` manifest
makes it discoverable.

![API docs](screenshots/02-api-docs.png)

Try it from the command line (all non-public endpoints take a Bearer token):

```bash
curl -X POST http://localhost:5005/command/execute-shell \
  -H "Authorization: Bearer your-secret" \
  -H "Content-Type: application/json" \
  -d '{"command": "df -h /"}'
```

## 3. The dashboard

The dashboard reads `/settings` and shows a card per capability — shell
execution, code execution, and LLM features. Cards for disabled features grey
out automatically, so it doubles as a health view.

![Dashboard](screenshots/03-dashboard.png)

## 4. Settings

`settings.html` shows the live, **redacted** configuration: secrets are
masked, and any value pinned by an environment variable is marked read-only.
Paste your `API_TOKEN` to load it.

![Settings](screenshots/04-settings.png)

## 5. Audit what your agent did

Every execution — shell, code, or LLM-planned — is logged as a session under
`data/activity/`. The console page lists sessions in the sidebar and replays
each step: the command, exit code, output, and (when enabled) the LLM's
analysis of any failure.

![Activity console](screenshots/05-llm-console.png)

## 6. Going further

- **Remote targets:** point execution at SSH or SSM hosts — see
  [CONFIGURATION.md](CONFIGURATION.md).
- **LLM features:** enable a provider (Ollama, LM Studio, or any
  OpenAI-compatible endpoint) to use `/command/execute-llm` (natural language →
  planned command, with `dryRun`) and automatic error analysis.
- **MCP:** start with `USE_MCP=true` to expose every capability as MCP tools
  for agent frameworks.
- **Roadmap:** see [ROADMAP.md](ROADMAP.md) for what's done and what's next.
