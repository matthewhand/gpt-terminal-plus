#!/bin/bash

# Get the directory of the current script
SCRIPT_DIR=$(dirname "$0")

# Navigate to the root of the project
cd "$SCRIPT_DIR/../.."

# Configuration file path
CONFIG_FILE="./scripts/vercel/vercel.json"

# Default environment is production
ENVIRONMENT="production"

# Check if an argument is provided and set it as the environment
if [ $# -gt 0 ]; then
  ENVIRONMENT="$1"
fi

# Check if the Vercel CLI is installed
if command -v vercel > /dev/null; then
    # Deploy using the local vercel.json configuration
    vercel --yes --local-config "$CONFIG_FILE"
else
    echo "Vercel CLI is not installed. Please install it and try again."
    exit 1
fi

