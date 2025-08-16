# API Guide

This document describes the HTTP API for models and chat.

## Authentication

- All endpoints require `Authorization: Bearer <API_TOKEN>` except `/health`.
- Set `API_TOKEN` in your environment or `.env`.

## Model Endpoints

- `GET /model`
  - Returns `{ supported: string[], selected: string }`.

- `GET /model/selected`
  - Returns `{ selected: string }`.

- `POST /model/select`
  - Body: `{ "model": "gpt-oss:20b" }`
  - Sets the selected model if supported.

## Chat Completions

- `POST /chat/completions`
  - Body:
    ```json
    {
      "messages": [
        { "role": "user", "content": "Say hello" }
      ],
      "model": "gpt-oss:20b",
      "stream": false
    }
    ```
  - If `model` is omitted, the server uses the currently selected model.
  - If `stream` is `true`, the endpoint streams Server-Sent Events (SSE).

### Non-streaming example

```bash
curl -s -X POST http://localhost:5005/chat/completions \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role":"user","content":"Say hello"}],
    "model": "gpt-oss:20b",
    "stream": false
  }'
```

### Streaming (SSE) example

```bash
curl -N -X POST http://localhost:5005/chat/completions \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Accept: text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role":"user","content":"Stream a reply"}],
    "model": "gpt-oss:20b",
    "stream": true
  }'
```

- Event format per chunk:
  - `data: {"choices":[{"index":0,"delta":{"content":"..."}}]}`
  - End of stream: `data: [DONE]`

- Heartbeats: the stream sends `: keep-alive` comments periodically and an initial `: connected` comment to keep connections healthy.

## MCP (optional)

- `GET /mcp/messages` (SSE) is available if `USE_MCP=true`.
- The server registers tools that mirror selected Express routes, including model list/select.
