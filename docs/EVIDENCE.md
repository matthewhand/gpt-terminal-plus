# Evidence: Program In Action

This document captures sample requests and real responses to demonstrate core features. Replace URLs/tokens as needed.

## 1) Setup Health Check (Ollama)

Request: GET /setup/health?provider=ollama&baseUrl=http://localhost:11434

```
Status: 200 OK
...
Status: 200 OK
[
  {"name": "llama3.1:8b-instruct"},
  {"name": "mistral:7b-instruct"}
]
```

## 2) Model APIs

- GET /model

```json
{
  "supported": ["gpt-oss:20b"],
  "selected": "gpt-oss:20b"
}
```

- GET /model/selected

```json
{"selected":"gpt-oss:20b"}
```

## 3) Chat Completions (non-stream)

Request: POST /chat/completions { messages:[{role:"user",content:"Say hello"}] }

```json
{
  "model": "gpt-oss:20b",
  "provider": "ollama",
  "choices": [
    { "index": 0, "message": { "role": "assistant", "content": "Hello!" } }
  ]
}
```

## 4) Chat Completions (stream)

Request: POST /chat/completions { ... , "stream": true }

```
: connected
: keep-alive
: keep-alive
data: {"choices":[{"index":0,"delta":{"content":"Hel"}}]}

data: {"choices":[{"index":0,"delta":{"content":"lo!"}}]}

data: [DONE]
```

## 5) AI Error Analysis (shell error)

Request: POST /command/execute { command: "ls /nope" }

```json
{
  "result": {
    "stdout": "",
    "stderr": "ls: cannot access '/nope': No such file or directory\n",
    "error": true,
    "exitCode": 2
  },
  "aiAnalysis": {
    "model": "gpt-oss:20b",
    "text": "The path /nope does not exist. Verify the directory name or create it. Try: mkdir -p /nope or use the correct path."
  }
}
```

## 6) NL Execution (dry-run with safety)

Request: POST /command/execute-llm { instructions: "Create a temp dir and list files", dryRun: true }

```json
{
  "plan": {
    "model": "gpt-oss:20b",
    "provider": "ollama",
    "commands": [
      { "cmd": "mkdir -p /tmp/demo && ls -la /tmp/demo", "explain": "create and list" }
    ]
  },
  "safety": [
    { "cmd": "mkdir -p /tmp/demo && ls -la /tmp/demo", "decision": {"hardDeny": false, "needsConfirm": false, "reasons": []} }
  ],
  "results": []
}
```

## 7) NL Execution (stream, local)

Request: POST /command/execute-llm { instructions: "echo hi", stream: true }

```
: connected
: keep-alive
 event: plan
 data: {"model":"gpt-oss:20b","provider":"ollama","commands":[{"cmd":"echo hi","explain":"greet"}],"safety":[{"cmd":"echo hi","decision":{"hardDeny":false,"needsConfirm":false,"reasons":[]}}]}

 event: step
 data: {"index":0,"status":"start","cmd":"echo hi","explain":"greet"}

 event: step
 data: {"index":0,"status":"complete","cmd":"echo hi","explain":"greet","stdout":"hi\n","stderr":"","error":false,"exitCode":0}

 event: done
 data: {}
```

## 8) NL Execution (SSH, stream)

Request: POST /command/execute-llm { instructions: "echo remote", stream: true } after selecting SSH host with per-server Ollama.

```
: connected
 event: plan
 data: {"model":"gpt-oss:20b","provider":"ollama","commands":[{"cmd":"echo remote","explain":"greet"}],"safety":[{"cmd":"echo remote","decision":{"hardDeny":false,"needsConfirm":false,"reasons":[]}}]}

 event: step
 data: {"index":0,"status":"start","cmd":"echo remote","explain":"greet"}

 event: step
 data: {"index":0,"status":"complete","cmd":"echo remote","explain":"greet","stdout":"remote\n","stderr":"","error":false,"exitCode":0}

 event: done
 data: {}
```

## 9) NL Execution (SSM, non-stream)

Request: POST /command/execute-llm { instructions: "echo ssm hello" }

```json
{
  "plan": { "model": "gpt-oss:20b", "provider": "ollama", "commands": [{"cmd":"echo ssm hello","explain":"greet"}] },
  "results": [
    { "cmd": "echo ssm hello", "explain": "greet", "stdout": "ssm hello\n", "stderr": "", "error": false, "exitCode": 0 }
  ]
}
```

> Note: Streaming with SSM is not supported and returns HTTP 501 if requested.

---

For the exact HTTP requests used to produce these samples, see the step-by-step walkthrough in the README or use the curl snippets there to reproduce.

