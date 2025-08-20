#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:5005}"
API_TOKEN="${API_TOKEN:-}" # required
OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"

if [[ -z "$API_TOKEN" ]]; then
  echo "ERROR: API_TOKEN env var is required" >&2
  exit 1
fi

AUTH=( -H "Authorization: Bearer $API_TOKEN" )
JSON_H=( -H "Content-Type: application/json" )
FORM_H=( -H "Content-Type: application/x-www-form-urlencoded" )
JQ=${JQ:-jq}
HAS_JQ=1
command -v jq >/dev/null 2>&1 || HAS_JQ=0

outfile="docs/SHOWCASE.generated.md"
mkdir -p docs
{
  echo "# Showcase (Auto-Generated)"
  echo
  echo "Generated on: $(date -Is)"
} > "$outfile"

heading(){ echo -e "\n## $1\n" >> "$outfile"; }
add_code(){ local lang="$1"; echo -e "\n\n\`\`\`$lang" >> "$outfile"; cat; echo -e "\`\`\`\n" >> "$outfile"; }

# 0) Minimal setup to ensure endpoints respond
# Configure local LLM and global provider (idempotent)
curl -sS -X POST "${BASE_URL}/setup/local" "${AUTH[@]}" "${FORM_H[@]}" \
  --data-urlencode "hostname=localhost" \
  --data-urlencode "code=true" \
  --data-urlencode "llm.provider=ollama" \
  --data-urlencode "llm.baseUrl=${OLLAMA_URL}" >/dev/null || true

curl -sS -X POST "${BASE_URL}/setup/ai" "${AUTH[@]}" "${FORM_H[@]}" \
  --data-urlencode "provider=ollama" \
  --data-urlencode "ollama.baseUrl=${OLLAMA_URL}" >/dev/null || true

# 1) Health Check
heading "1) Setup Health Check (Ollama)"
{
  echo "Request: GET /setup/health?provider=ollama&baseUrl=${OLLAMA_URL}"
  echo
  curl -sS "${BASE_URL}/setup/health?provider=ollama&baseUrl=${OLLAMA_URL}" "${AUTH[@]}" | head -n 40
} | add_code ""

# 2) Model APIs
heading "2) Model APIs"
{
  echo "GET /model"; echo
  curl -sS "${BASE_URL}/model" "${AUTH[@]}" | ( [[ $HAS_JQ -eq 1 ]] && $JQ . || cat )
  echo
  echo "GET /model/selected"; echo
  curl -sS "${BASE_URL}/model/selected" "${AUTH[@]}" | ( [[ $HAS_JQ -eq 1 ]] && $JQ . || cat )
} | add_code json

# 3) Chat non-stream
heading "3) Chat Completions (non-stream)"
{
  curl -sS -X POST "${BASE_URL}/chat/completions" "${AUTH[@]}" "${JSON_H[@]}" \
    -d '{"messages":[{"role":"user","content":"Say hello"}]}' | ( [[ $HAS_JQ -eq 1 ]] && $JQ . || cat )
} | add_code json

# 4) Chat stream (first lines)
heading "4) Chat Completions (stream)"
{
  curl -sS -N -X POST "${BASE_URL}/chat/completions" "${AUTH[@]}" -H 'Accept: text/event-stream' "${JSON_H[@]}" \
    -d '{"messages":[{"role":"user","content":"Stream hello"}],"stream":true}' | sed -n '1,12p'
} | add_code ""

# 5) AI Error Analysis (shell error)
heading "5) AI Error Analysis (shell error)"
{
  curl -sS -X POST "${BASE_URL}/command/execute" "${AUTH[@]}" "${JSON_H[@]}" \
    -d '{"command":"ls /nope"}' | ( [[ $HAS_JQ -eq 1 ]] && $JQ . || cat )
} | add_code json

# 6) NL Execution (dry-run with safety)
heading "6) NL Execution (dry-run with safety)"
{
  curl -sS -X POST "${BASE_URL}/command/execute-llm" "${AUTH[@]}" "${JSON_H[@]}" \
    -d '{"instructions":"Create a temp dir and list files there","dryRun":true}' | ( [[ $HAS_JQ -eq 1 ]] && $JQ . || cat )
} | add_code json

# 7) NL Execution (stream, local)
heading "7) NL Execution (stream, local)"
{
  curl -sS -N -X POST "${BASE_URL}/command/execute-llm" "${AUTH[@]}" -H 'Accept: text/event-stream' "${JSON_H[@]}" \
    -d '{"instructions":"echo hi","stream":true}' | sed -n '1,30p'
} | add_code ""

# 8) NL Execution (SSH, stream) optional
heading "8) NL Execution (SSH, stream)"
{
  echo "(Optional) Requires configured SSH host with per-server Ollama. Showing attempt:"
  curl -sS -N -X POST "${BASE_URL}/command/execute-llm" "${AUTH[@]}" -H 'Accept: text/event-stream' "${JSON_H[@]}" \
    -d '{"instructions":"echo remote","stream":true}' | sed -n '1,30p' || true
} | add_code ""

# 9) NL Execution (SSM, non-stream) optional
heading "9) NL Execution (SSM, non-stream)"
{
  echo "(Optional) Requires AWS SSM configuration. Showing attempt:"
  curl -sS -X POST "${BASE_URL}/command/execute-llm" "${AUTH[@]}" "${JSON_H[@]}" \
    -d '{"instructions":"echo ssm hello"}' | ( [[ $HAS_JQ -eq 1 ]] && $JQ . || cat ) || true
} | add_code json

echo "Wrote $outfile"
