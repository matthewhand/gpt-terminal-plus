#!/bin/bash

# Usage: ./remote_execute_command.sh "<command>"

set -euo pipefail

COMMAND="$1"

# Execute the command and capture stdout and stderr
OUTPUT=$(bash -c "$COMMAND" 2>&1)
EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 0 ]; then
  echo "$OUTPUT"
else
  echo "$OUTPUT" >&2
  exit "$EXIT_CODE"
fi
