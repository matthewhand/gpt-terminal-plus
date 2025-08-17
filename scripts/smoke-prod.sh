#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-https://terminal.teamstinky.duckdns.org}"
: "${API_TOKEN:?API_TOKEN not set}"

auth="Authorization: Bearer ${API_TOKEN}"
json="Content-Type: application/json"

post() {
  local path="$1" data="$2"
  local resp code body
  resp="$(curl -sS --show-error --fail-with-body \
           -H "$auth" -H "$json" \
           -w $'\n%{http_code}' \
           -d "$data" "$BASE$path")" || return 1
  code="${resp##*$'\n'}"
  body="${resp%$'\n'$code}"
  [[ "$code" == "200" ]] || { printf 'HTTP %s\n%s\n' "$code" "$body" >&2; return 1; }
  printf '%s' "$body"
}

show() {
  if command -v jq >/dev/null 2>&1; then
    jq -r '
      if .result and .result.exitCode==0 and (.result.stdout|length>0)
      then .result.stdout
      else
        ("exitCode: " + (.result.exitCode|tostring) + "\n" +
         "stderr:  " + (.result.stderr//""))
      end
    ' 2>/dev/null || cat
  else
    cat
  fi
}

probe="$(post /command/execute '{"command":"uname -s"}' || true)"
if printf '%s' "$probe" | grep -qiE 'mock|unsupported command in test harness'; then
  echo "⚠ Server seems to be running in TEST HARNESS (NODE_ENV=test). Start prod:"
  echo "   NODE_ENV=production npm start"
  exit 1
fi

echo "UTC via /command/execute:"
post /command/execute '{"command":"date -u +%Y-%m-%dT%H:%M:%SZ"}' | show
echo

echo "Local via /command/execute:"
post /command/execute '{"command":"date +%Y-%m-%d %H:%M:%S %Z"}' | show
echo

echo "UTC via /command/execute-code (python):"
post /command/execute-code '{"language":"python","code":"from datetime import datetime, timezone; print(datetime.now(timezone.utc).isoformat())"}' | show
echo
