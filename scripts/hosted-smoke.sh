#!/usr/bin/env bash
set -u

# Reusable hosting smoke test for multiple bases (Fly/Vercel/etc.)
# Usage examples:
#  - bash scripts/hosted-smoke.sh --base https://gpt-terminal-plus.fly.dev --token "$API_TOKEN"
#  - bash scripts/hosted-smoke.sh --base https://gpt-terminal-plus.fly.dev --base https://gpt-terminal-plus.vercel.app --token "$API_TOKEN"
#  - bash scripts/hosted-smoke.sh --base "$PUBLIC_BASE_URL" --skip-protected

BASES=()
TOKEN=""
SKIP_PROTECTED=false
ECHO_MSG="SMOKE_OK"
TIMEOUT=15

print_usage() {
  cat <<USAGE
Usage: $0 --base <url> [--base <url> ...] [--token <api_token>] [--skip-protected] [--echo-msg <msg>] [--timeout <seconds>]

Options:
  --base <url>         Base URL to test (can be provided multiple times)
  --token <token>      API bearer token for protected endpoints
  --skip-protected     Skip protected endpoint checks if no token provided
  --echo-msg <msg>     Message to echo in shell sanity check (default: SMOKE_OK)
  --timeout <seconds>  Per-request curl max time (default: 15)
  -h, --help           Show this help and exit
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base)
      BASES+=("$2"); shift 2 ;;
    --token)
      TOKEN="$2"; shift 2 ;;
    --skip-protected)
      SKIP_PROTECTED=true; shift ;;
    --echo-msg)
      ECHO_MSG="$2"; shift 2 ;;
    --timeout)
      TIMEOUT="$2"; shift 2 ;;
    -h|--help)
      print_usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2; print_usage; exit 2 ;;
  esac
done

# Fallback: if no --base supplied, use HOST_BASES env or individual domain env vars
if [[ ${#BASES[@]} -eq 0 && -n "${HOST_BASES:-}" ]]; then
  # shellcheck disable=SC2206
  BASES=(${HOST_BASES})
fi
if [[ ${#BASES[@]} -eq 0 ]]; then
  [[ -n "${FLY_DOMAIN:-}" ]] && BASES+=("https://${FLY_DOMAIN}")
  [[ -n "${VERCEL_DOMAIN:-}" ]] && BASES+=("https://${VERCEL_DOMAIN}")
fi

if [[ ${#BASES[@]} -eq 0 ]]; then
  echo "Error: at least one --base is required" >&2
  print_usage
  exit 2
fi

need_cmd() { command -v "$1" >/dev/null 2>&1; }
if ! need_cmd curl; then echo "curl is required" >&2; exit 2; fi

passcnt=0; failcnt=0; skipcnt=0

hr() { printf '%*s\n' "${COLUMNS:-80}" '' | tr ' ' -; }

check_health() {
  local base="$1"
  local code body
  code=$(curl -sS -m "$TIMEOUT" -o /dev/null -w '%{http_code}' "$base/health" || true)
  body=$(curl -sS -m "$TIMEOUT" "$base/health" 2>/dev/null || true)
  if [[ "$code" == "200" ]] && [[ "$body" == *"\"status\":\"ok\""* || "$body" == *"{status:ok}"* ]]; then
    echo "[PASS] $base /health -> $code $body"; passcnt=$((passcnt+1))
    return 0
  else
    echo "[FAIL] $base /health -> code=$code body=$body"; failcnt=$((failcnt+1))
    return 1
  fi
}

check_openapi() {
  local base="$1"
  local info
  info=$(curl -sS -m "$TIMEOUT" "$base/openapi.json" 2>/dev/null || true)
  if [[ "$info" == *"\"openapi\""* && "$info" == *"\"info\""* ]]; then
    # Try to extract title/version without jq
    local title version
    title=$(printf '%s' "$info" | sed -n 's/.*"title"\s*:\s*"\([^"]*\)".*/\1/p' | head -n1)
    version=$(printf '%s' "$info" | sed -n 's/.*"version"\s*:\s*"\([^"]*\)".*/\1/p' | head -n1)
    echo "[PASS] $base /openapi.json -> title=${title:-unknown} version=${version:-unknown}"; passcnt=$((passcnt+1))
    return 0
  else
    echo "[FAIL] $base /openapi.json -> missing openapi/info"; failcnt=$((failcnt+1))
    return 1
  fi
}

check_server_list() {
  local base="$1"
  if [[ -z "$TOKEN" ]]; then
    if [[ "$SKIP_PROTECTED" == true ]]; then
      echo "[SKIP] $base /server/list (no token)"; skipcnt=$((skipcnt+1)); return 0
    else
      echo "[FAIL] $base /server/list requires --token"; failcnt=$((failcnt+1)); return 1
    fi
  fi
  local body code
  body=$(curl -sS -m "$TIMEOUT" -H "Authorization: Bearer $TOKEN" "$base/server/list" 2>/dev/null || true)
  code=$(curl -sS -m "$TIMEOUT" -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $TOKEN" "$base/server/list" || true)
  if [[ "$code" == "200" && "$body" == *"\"servers\""* ]]; then
    echo "[PASS] $base /server/list -> 200 (servers present)"; passcnt=$((passcnt+1))
  else
    echo "[FAIL] $base /server/list -> code=$code body=$body"; failcnt=$((failcnt+1))
  fi
}

check_echo() {
  local base="$1"
  if [[ -z "$TOKEN" ]]; then
    if [[ "$SKIP_PROTECTED" == true ]]; then
      echo "[SKIP] $base /command/execute-shell (no token)"; skipcnt=$((skipcnt+1)); return 0
    else
      echo "[FAIL] $base /command/execute-shell requires --token"; failcnt=$((failcnt+1)); return 1
    fi
  fi
  local payload code body
  payload=$(printf '{"command":"echo %s"}' "$ECHO_MSG")
  body=$(curl -sS -m "$TIMEOUT" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "$payload" "$base/command/execute-shell" 2>/dev/null || true)
  code=$(curl -sS -m "$TIMEOUT" -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "$payload" "$base/command/execute-shell" || true)
  if [[ "$code" == "200" && "$body" == *"\"stdout\""* && "$body" == *"$ECHO_MSG"* && "$body" == *"\"exitCode\":0"* ]]; then
    echo "[PASS] $base /command/execute-shell -> 200 (stdout contains $ECHO_MSG)"; passcnt=$((passcnt+1))
  else
    echo "[FAIL] $base /command/execute-shell -> code=$code body=$(echo "$body" | tr '\n' ' ' | cut -c1-200)"; failcnt=$((failcnt+1))
  fi
}

overall_start=$(date +%s)
for base in "${BASES[@]}"; do
  hr
  echo "Testing base: $base"
  check_health "$base"
  check_openapi "$base"
  check_server_list "$base"
  check_echo "$base"
done
hr
overall_end=$(date +%s)
echo "Summary: PASS=$passcnt FAIL=$failcnt SKIP=$skipcnt in $((overall_end-overall_start))s"

exit $([[ $failcnt -gt 0 ]] && echo 1 || echo 0)
