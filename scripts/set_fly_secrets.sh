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
  echo "  -p, --app-name NAME          Specify the Fly.io app name"
  echo ""
  echo "Example:"
  echo "  $0 -a your_api_token -n production -d -c /path/to/config -p your-app-name"
  echo "  $0 -e /path/to/.env -p your-app-name"
}

# Default values
NODE_ENV="development"
DEBUG="false"
API_TOKEN=""
CONFIG_DIR=""
APP_NAME=""

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

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -h|--help) print_help; exit 0 ;;
    -a|--api-token) API_TOKEN="$2"; shift ;;
    -n|--node-env) NODE_ENV="$2"; shift ;;
    -d|--debug) DEBUG="true" ;;
    -c|--config-dir) CONFIG_DIR="$2"; shift ;;
    -e|--env-file) source_env_file "$2"; shift ;;
    -p|--app-name) APP_NAME="$2"; shift ;;
    *) echo "Unknown parameter passed: $1"; print_help; exit 1 ;;
  esac
  shift
done

# Validate required arguments
if [[ -z "$API_TOKEN" ]]; then
  echo "Error: API token is required."
  print_help
  exit 1
fi

if [[ -z "$APP_NAME" ]]; then
  echo "Error: App name is required."
  print_help
  exit 1
fi

# Redact API token for display
REDACTED_API_TOKEN="${API_TOKEN:0:4}********"

# Print configuration
echo "Setting Fly.io secrets for app '$APP_NAME' with the following configuration:"
echo "API Token: $REDACTED_API_TOKEN"
echo "Node Environment: $NODE_ENV"
echo "Debug: $DEBUG"
echo "Config Directory: $CONFIG_DIR"

# Set secrets in Fly.io
flyctl secrets set API_TOKEN="$API_TOKEN" -a "$APP_NAME"
flyctl secrets set NODE_ENV="$NODE_ENV" -a "$APP_NAME"
flyctl secrets set DEBUG="$DEBUG" -a "$APP_NAME"
flyctl secrets set NODE_CONFIG_DIR="$CONFIG_DIR" -a "$APP_NAME"
