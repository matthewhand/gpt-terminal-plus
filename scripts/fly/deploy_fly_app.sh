#!/bin/bash

# ----------------------------------------------------------------------------
# Script: deploy_fly_app.sh
#
# Purpose: This script launches a Fly.io application based on a provided TOML 
#          file and configures secrets for the application based on environment
#          variables provided in a .env file and specified through command-line
#          options. It supports setting four key environment variables as Fly.io
#          secrets: API_TOKEN, NODE_ENV, DEBUG, and NODE_CONFIG_DIR.
#
# Design:
# 1. Initialization and Command-Line Argument Parsing
#    - Initialize default variables for script options.
#    - Parse command-line arguments to set flags and variables.
#    - Display usage information if incorrect arguments are provided.
#
# 2. Service Management Functions
#    - Define functions to source environment variables from a file, load app
#      name from the specified TOML file, launch the app, and set secrets in Fly.io.
#
# 3. Load Environment Variables
#    - Source environment variables from the specified .env file.
#
# 4. Parse Command-Line Arguments
#    - Set the API token, Node environment, debug flag, Node configuration 
#      directory, Fly.io app name, and the path to the TOML file based on user inputs.
#
# 5. Load App Name from the Specified TOML File
#    - If the Fly.io app name is not provided via command-line arguments, load
#      it from the specified TOML file.
#
# 6. Launch Fly.io Application
#    - Launch the Fly.io application based on the provided TOML file.
#
# 7. Validate Required Arguments
#    - Ensure that the Fly.io app name is provided either through the command
#      line or the specified TOML file.
#
# 8. Print Configuration
#    - Display the current configuration, redacting the API token for security.
#
# 9. Set Secrets in Fly.io
#    - Set the provided values as secrets in the Fly.io app using the flyctl
#      command.
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
  echo "  $0 -a your_api_token -n production -d -c /path/to/config -p your-app-name"
  echo "  $0 -e /path/to/.env -p your-app-name"
  echo "  $0 -e /path/to/.env -t /path/to/fly.toml"
}

# Default values
NODE_ENV="development"
DEBUG="false"
API_TOKEN=""
NODE_CONFIG_DIR=""
FLY_APP_NAME=""
TOML_FILE=""

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

# Function to load app name from a specified TOML file
load_app_name_from_toml() {
  if [ -f "$1" ]; then
    FLY_APP_NAME=$(grep 'app = "' "$1" | sed 's/app = "\(.*\)"/\1/')
    echo "Loaded Fly.io app name from $1: $FLY_APP_NAME"
  else
    echo "Error: TOML file $1 does not exist."
    exit 1
  fi
}

# Function to launch Fly.io application
launch_fly_app() {
  if [ -f "$1" ]; then
    echo "Launching Fly.io app using $1"
    flyctl launch --config "$1" --now
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
    -e|--env-file) source_env_file "$2"; shift ;;
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

# Launch the Fly.io application
if [[ -n "$TOML_FILE" ]]; then
  launch_fly_app "$TOML_FILE"
fi

# Redact API token for display
REDACTED_API_TOKEN="${API_TOKEN:0:4}********"

# Print configuration
echo "Setting Fly.io secrets for app '$FLY_APP_NAME' with the following configuration:"
echo "API Token: $REDACTED_API_TOKEN"
echo "Node Environment: $NODE_ENV"
echo "Debug: $DEBUG"
echo "Node Configuration Directory: $NODE_CONFIG_DIR"

# Debug output of environment variables
echo "Environment variables sourced:"
echo "API_TOKEN: $API_TOKEN"
echo "NODE_ENV: $NODE_ENV"
echo "DEBUG: $DEBUG"
echo "NODE_CONFIG_DIR: $NODE_CONFIG_DIR"

# Set secrets in Fly.io only if values are defined
if [[ -n "$API_TOKEN" ]]; then
  flyctl secrets set API_TOKEN="$API_TOKEN" -a "$FLY_APP_NAME"
fi
if [[ -n "$NODE_ENV" ]]; then
  flyctl secrets set NODE_ENV="$NODE_ENV" -a "$FLY_APP_NAME"
fi
if [[ -n "$DEBUG" ]]; then
  flyctl secrets set DEBUG="$DEBUG" -a "$FLY_APP_NAME"
fi
if [[ -n "$NODE_CONFIG_DIR" ]]; then
  flyctl secrets set NODE_CONFIG_DIR="$NODE_CONFIG_DIR" -a "$FLY_APP_NAME"
fi
