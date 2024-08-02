#!/bin/bash

# Function to print help information
print_help() {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  -h, --help                   Show this help message and exit"
  echo "  -a, --api-token TOKEN        Set the API token"
  echo "  -n, --node-env ENV           Set the Node environment (default: development)"
  echo "  -d, --debug                  Enable debug logging"
  echo "  -c, --config-dir DIR         Set the Node configuration directory"
  echo "  -e, --env-file FILE          Source environment variables from a file"
  echo ""
  echo "Example:"
  echo "  $0 -a your_api_token -n production -d -c /path/to/config"
  echo "  $0 -e /path/to/.env"
}

# Default values
NODE_ENV="development"
DEBUG="false"
API_TOKEN=""
CONFIG_DIR=""

# Function to source .env file
source_env_file() {
  if [ -f "$1" ]; then
    echo "Sourcing environment variables from $1"
    export $(grep -v '^#' "$1" | xargs)
  else
    echo "Error: File $1 does not exist."
    exit 1
  fi
}

# Redact API token for display
REDACTED_API_TOKEN="${API_TOKEN:0:4}********"

# Print configuration
echo "Setting Fly.io secrets with the following configuration:"
echo "API Token: $REDACTED_API_TOKEN"
echo "Node Environment: $NODE_ENV"
echo "Debug: $DEBUG"
echo "Config Directory: $CONFIG_DIR"

# Set secrets in Fly.io
flyctl secrets set API_TOKEN="$API_TOKEN"
flyctl secrets set NODE_ENV="$NODE_ENV"
flyctl secrets set DEBUG="$DEBUG"
flyctl secrets set NODE_CONFIG_DIR="$CONFIG_DIR"

