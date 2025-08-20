#!/bin/bash

# ----------------------------------------------------------------------------
# Script: deploy_fly_app.sh
#
# Purpose: This script launches a Fly.io application based on a provided TOML 
#          file and configures secrets for the application based on environment
#          variables provided in a .env file and specified through command-line
#          options. It sets both predefined secrets and any additional secrets
#          found in the .env file.
#
# Design:
# 1. Initialization and Command-Line Argument Parsing
#    - Initialize default variables for script options.
#    - Parse command-line arguments to set flags and variables.
#    - Display usage information if incorrect arguments are provided.
#
# 2. Service Management Functions
#    - Define functions to source environment variables from a file, load app
#      name from the specified TOML file, check if the app exists, create the app,
#      set secrets in Fly.io, and deploy the app.
#
# 3. Deployment Flow
#    - Parse arguments.
#    - Determine app name.
#    - Ensure the app exists or create it.
#    - Set secrets.
#    - Deploy the app.
#
# ----------------------------------------------------------------------------

# Function to print help information
print_help() {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  -h, --help                   Show this help message and exit"
  echo "  -a, --api-token TOKEN        Set the API token"
  echo "  -n, --node-env ENV           Set the Node environment (default: development)"
  echo "  -d, --debug                  Enable debug logging"
  echo "  -c, --node-config-dir DIR    Set the Node configuration directory"
  echo "  -e, --env-file FILE          Source environment variables from a file"
  echo "  -p, --fly-app-name NAME      Specify the Fly.io app name"
  echo "  -t, --toml-file FILE         Specify the TOML file to load the app name from"
  echo ""
  echo "Example:"
  echo "  $0 -a your_api_token -n production -d -c /path/to/config -e /path/to/.env.fly -p your-app-name -t fly.toml"
  echo "  $0 -e /path/to/.env.fly -p your-app-name -t fly.toml"
  echo "  $0 -p your-app-name"
}

# Default values
NODE_ENV="development"
DEBUG="false"
API_TOKEN=""
NODE_CONFIG_DIR=""
FLY_APP_NAME=""
TOML_FILE=""
ENV_FILE=""

# Function to source .env file
source_env_file() {
  if [ -f "$1" ]; then
    echo "Sourcing environment variables from $1"
    # Export variables, handling spaces and quotes correctly
    export $(grep -v '^#' "$1" | xargs -d '\n')
  else
    echo "Error: File $1 does not exist."
    exit 1
  fi
}

# Function to load app name from a specified TOML file
load_app_name_from_toml() {
  if [ -f "$1" ]; then
    FLY_APP_NAME=$(grep 'app\s*=' "$1" | sed -E 's/app\s*=\s*"(.*)"/\1/')
    if [ -z "$FLY_APP_NAME" ]; then
      echo "Error: Could not extract app name from $1."
      exit 1
    fi
    echo "Loaded Fly.io app name from $1: $FLY_APP_NAME"
  else
    echo "Error: TOML file $1 does not exist."
    exit 1
  fi
}

# Function to check if Fly.io app exists
check_app_exists() {
  flyctl apps list --json | jq -e ".[] | select(.Name == \"$FLY_APP_NAME\")" >/dev/null 2>&1
  return $?
}

# Function to create Fly.io app
create_fly_app() {
  echo "Creating Fly.io app '$FLY_APP_NAME'..."
  flyctl apps create "$FLY_APP_NAME"
  if [ $? -ne 0 ]; then
    echo "Error: Failed to create Fly.io app '$FLY_APP_NAME'."
    exit 1
  fi
}

# Function to set predefined secrets in Fly.io
set_predefined_secrets() {
  echo "Setting predefined Fly.io secrets..."

  # Redact API token for display
  REDACTED_API_TOKEN="${API_TOKEN:0:4}********"

  echo "Setting secrets for app '$FLY_APP_NAME' with the following configuration:"
  echo "API Token: $REDACTED_API_TOKEN"
  echo "Node Environment: $NODE_ENV"
  echo "Debug: $DEBUG"
  echo "Node Configuration Directory: $NODE_CONFIG_DIR"

  # Debug output of environment variables (redacted)
  echo "Environment variables sourced:"
  echo "API_TOKEN: ${API_TOKEN:0:4}********"
  echo "NODE_ENV: $NODE_ENV"
  echo "DEBUG: $DEBUG"
  echo "NODE_CONFIG_DIR: $NODE_CONFIG_DIR"

  # Set predefined secrets in Fly.io only if values are defined
  if [[ -n "$API_TOKEN" ]]; then
    flyctl secrets set API_TOKEN="$API_TOKEN" -a "$FLY_APP_NAME"
    if [ $? -ne 0 ]; then
      echo "Error: Failed to set API_TOKEN."
      exit 1
    fi
  fi
  if [[ -n "$NODE_ENV" ]]; then
    flyctl secrets set NODE_ENV="$NODE_ENV" -a "$FLY_APP_NAME"
    if [ $? -ne 0 ]; then
      echo "Error: Failed to set NODE_ENV."
      exit 1
    fi
  fi
  if [[ -n "$DEBUG" ]]; then
    flyctl secrets set DEBUG="$DEBUG" -a "$FLY_APP_NAME"
    if [ $? -ne 0 ]; then
      echo "Error: Failed to set DEBUG."
      exit 1
    fi
  fi
  if [[ -n "$NODE_CONFIG_DIR" ]]; then
    flyctl secrets set NODE_CONFIG_DIR="$NODE_CONFIG_DIR" -a "$FLY_APP_NAME"
    if [ $? -ne 0 ]; then
      echo "Error: Failed to set NODE_CONFIG_DIR."
      exit 1
    fi
  fi
}

# Function to set all environment variables from the .env file as Fly.io secrets
set_env_secrets() {
  if [ -f "$1" ]; then
    echo "Setting additional Fly.io secrets from $1"
    while IFS='=' read -r key value; do
      # Skip comments and empty lines
      if [[ -z "$key" || "$key" =~ ^# ]]; then
        continue
      fi
      # Trim possible quotes around the value
      value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//')
      echo "Setting secret $key"
      flyctl secrets set "$key=$value" -a "$FLY_APP_NAME"
      if [ $? -ne 0 ]; then
        echo "Error: Failed to set secret '$key'."
        exit 1
      fi
    done < "$1"
  else
    echo "Error: Environment file $1 does not exist."
    exit 1
  fi
}

# Function to deploy Fly.io application
deploy_fly_app() {
  if [ -f "$1" ]; then
    echo "Deploying Fly.io app using $1"
    flyctl deploy --config "$1" --remote-only
    if [ $? -ne 0 ]; then
      echo "Error: Deployment failed."
      exit 1
    fi
  else
    echo "Error: TOML file $1 does not exist."
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
    -c|--node-config-dir) NODE_CONFIG_DIR="$2"; shift ;;
    -e|--env-file) ENV_FILE="$2"; shift ;;
    -p|--fly-app-name) FLY_APP_NAME="$2"; shift ;;
    -t|--toml-file) TOML_FILE="$2"; shift ;;
    *) echo "Unknown parameter passed: $1"; print_help; exit 1 ;;
  esac
  shift
done

# Load app name from the specified TOML file if not provided
if [[ -z "$FLY_APP_NAME" && -n "$TOML_FILE" ]]; then
  load_app_name_from_toml "$TOML_FILE"
fi

# Validate required arguments
if [[ -z "$FLY_APP_NAME" ]]; then
  echo "Error: Fly.io app name is required."
  print_help
  exit 1
fi

# Source environment variables if env file is provided
if [[ -n "$ENV_FILE" ]]; then
  source_env_file "$ENV_FILE"
fi

# Check if Fly.io app exists
echo "Checking if Fly.io app '$FLY_APP_NAME' exists..."
check_app_exists
if [ $? -ne 0 ]; then
  echo "Fly.io app '$FLY_APP_NAME' does not exist. Creating..."
  create_fly_app
else
  echo "Fly.io app '$FLY_APP_NAME' already exists."
fi

# Set predefined secrets
set_predefined_secrets

# Set additional secrets from the .env file
if [[ -n "$ENV_FILE" ]]; then
  set_env_secrets "$ENV_FILE"
fi

# Deploy the Fly.io application
deploy_fly_app "$TOML_FILE"

# Redact API token for display
REDACTED_API_TOKEN="${API_TOKEN:0:4}********"

# Print configuration summary
echo "Fly.io secrets set for app '$FLY_APP_NAME' with the following configuration:"
echo "API Token: $REDACTED_API_TOKEN"
echo "Node Environment: $NODE_ENV"
echo "Debug: $DEBUG"
echo "Node Configuration Directory: $NODE_CONFIG_DIR"

# Debug output of environment variables (redacted)
echo "Environment variables sourced:"
echo "API_TOKEN: ${API_TOKEN:0:4}********"
echo "NODE_ENV: $NODE_ENV"
echo "DEBUG: $DEBUG"
echo "NODE_CONFIG_DIR: $NODE_CONFIG_DIR"

echo "Deployment and secret configuration completed successfully."
