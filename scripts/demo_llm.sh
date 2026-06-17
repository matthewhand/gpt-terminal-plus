#!/usr/bin/env bash
set -euo pipefail

# Demo script for LLM engines
# Usage: TOKEN=... BASE=http://localhost:5005 ./scripts/demo_llm.sh

: "${TOKEN:?Set TOKEN env var}"
: "${BASE:?Set BASE env var (e.g., http://localhost:5005)}"

hdr=( -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' )

echo "1) Codex — echo hello"
curl -sS "${hdr[@]}" -d '{"engine":"codex","instructions":"echo hello"}' "$BASE/command/execute-llm" | sed 's/.\{200\}$/.../'
echo

echo "2) Codex — rm -rf /tmp/test (expect confirm/409)"
set +e
curl -sS -w "\nHTTP %{http_code}\n" "${hdr[@]}" -d '{"engine":"codex","instructions":"rm -rf /tmp/test"}' "$BASE/command/execute-llm"
set -e
echo

echo "3) Interpreter — print('hi')"
curl -sS "${hdr[@]}" -d '{"engine":"interpreter","instructions":"print(\"hi\")"}' "$BASE/command/execute-llm" | sed 's/.\{200\}$/.../'
echo

echo "4) Ollama — write a haiku"
curl -sS "${hdr[@]}" -d '{"engine":"ollama","instructions":"write me a haiku"}' "$BASE/command/execute-llm" | sed 's/.\{200\}$/.../'
echo

echo "Done. Inspect the server logs for details."

