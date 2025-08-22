#!/usr/bin/env bash
set -euo pipefail

# Usage: BASE=http://localhost:5005 ./scripts/openapi_preview.sh [local:true|false] [files:true|false]
BASE=${BASE:-http://localhost:5005}
LOCAL=${1:-true}
FILES=${2:-true}

curl -sS -H 'Accept: application/yaml' \
  "$BASE/config/openapi?withOverrides=true&LOCALHOST_ENABLED=$LOCAL&FILE_OPS_ENABLED=$FILES"

