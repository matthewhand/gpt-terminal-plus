#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-${PUBLIC_BASE_URL:-http://localhost:3100}}"
TOKEN="${2:-${API_TOKEN:-}}"

pass() { printf "\033[32m✔ %s\033[0m\n" "$*"; }
fail() { printf "\033[31m✘ %s\033[0m\n" "$*"; exit 1; }

req() {  # method path [json]
  local m="$1"; shift
  local p="$1"; shift
  local data="${1:-}"
  local url="${BASE}${p}"
  local hdr=(-H "Accept: application/json")
  [ -n "${TOKEN}" ] && hdr+=(-H "Authorization: Bearer ${TOKEN}")
  if [ -n "${data}" ]; then
    hdr+=(-H "Content-Type: application/json")
    curl -sS -w "\n%{http_code}" -X "$m" "${hdr[@]}" -d "$data" "$url"
  else
    curl -sS -w "\n%{http_code}" -X "$m" "${hdr[@]}" "$url"
  fi
}

echo "==> OpenAPI JSON available"
body_status="$(curl -sS -w '\n%{http_code}' "${BASE}/openapi.json")"
status="${body_status##*$'\n'}"; body="${body_status%$'\n'*}"
[ "$status" = "200" ] || fail "openapi.json returned $status"
echo "$body" | grep -q '"openapi"' || fail "openapi.json missing 'openapi' key"
pass "/openapi.json OK"

echo "==> OpenAPI YAML available"
yaml_status="$(curl -sS -w '\n%{http_code}' "${BASE}/openapi.yaml")"
ystatus="${yaml_status##*$'\n'}"
[ "$ystatus" = "200" ] || fail "openapi.yaml returned $ystatus"
pass "/openapi.yaml OK"

echo "==> /server/list unauthorized without token"
noauth_status="$( (unset TOKEN; curl -sS -w '\n%{http_code}' -X GET -H 'Accept: application/json' "${BASE}/server/list") )"
nost="${noauth_status##*$'\n'}"
[ "$nost" = "401" ] || [ "$nost" = "403" ] || fail "/server/list expected 401/403, got $nost"
pass "auth required"

if [ -z "${TOKEN}" ]; then
  echo "NOTE: No token provided; skipping authorized checks."
  exit 0
fi

echo "==> /server/list authorized"
list_body_status="$(req GET /server/list)"
lst_status="${list_body_status##*$'\n'}"; lst_body="${list_body_status%$'\n'*}"
[ "$lst_status" = "200" ] || fail "/server/list with token returned $lst_status"
echo "$lst_body" | grep -q '"servers"' || fail "/server/list body missing 'servers'"
pass "/server/list authorized OK"

echo "==> /command/execute-code (bash echo)"
code_body_status="$(req POST /command/execute-code '{"language":"bash","code":"echo smoke-code"}')"
cstat="${code_body_status##*$'\n'}"; cbody="${code_body_status%$'\n'*}"
[ "$cstat" = "200" ] || fail "execute-code returned $cstat"
echo "$cbody" | grep -q '"exitCode":0' || fail "execute-code exitCode != 0"
echo "$cbody" | grep -q 'smoke-code' || fail "execute-code stdout missing 'smoke-code'"
pass "execute-code OK"

echo "==> /command/execute (shell echo)"
exec_body_status="$(req POST /command/execute '{"command":"echo smoke-cmd"}')"
estat="${exec_body_status##*$'\n'}"; ebody="${exec_body_status%$'\n'*}"
[ "$estat" = "200" ] || fail "execute returned $estat"
echo "$ebody" | grep -q '"exitCode":0' || fail "execute exitCode != 0"
echo "$ebody" | grep -q 'smoke-cmd' || fail "execute stdout missing 'smoke-cmd'"
pass "execute OK"

echo "==> /command/execute-llm (dryRun)"
llm_body_status="$(req POST /command/execute-llm '{"instructions":"say hi","dryRun":true}')"
lstat="${llm_body_status##*$'\n'}"
[ "$lstat" = "200" ] || fail "execute-llm (dryRun) returned $lstat"
pass "execute-llm (dryRun) OK"

echo
pass "Smoke tests passed against ${BASE}"
