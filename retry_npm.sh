#!/bin/bash

max_retries=5
delay=5
retry_count=0

run_command() {
  local command=""
  local retries=0
  until [ $retries -ge $max_retries ]
  do
    $command && break
    retries=$((retries+1))
    echo "Retry $retries/$max_retries: Retrying in $delay seconds..."
    sleep $delay
  done

  if [ $retries -eq $max_retries ]; then
    echo "Command failed after $max_retries attempts."
  else
    echo "Command succeeded."
  fi
}

run_command "npm install --save-dev @typescript-eslint/parser --legacy-peer-deps"
run_command "npm run build"
run_command "npm test"
run_command "npm run lint"

