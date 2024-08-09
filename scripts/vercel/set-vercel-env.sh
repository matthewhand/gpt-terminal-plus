#!/bin/bash

# Enable debugging
#set -ex

# Default environment is production
ENVIRONMENT="production"

# Check if an argument is provided and set it as the environment
if [ $# -gt 0 ]; then
  ENVIRONMENT="$1"
fi

# Change to the directory where the script is located (scripts/vercel/)
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR"

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Set each environment variable in Vercel for the specified environment
while IFS='=' read -r key value; do
    if [[ ! -z $key && $key != \#* ]]; then
        echo "Adding $key"
        # Attempt to add the environment variable, capturing errors
        if echo "$value" | vercel env add "$key" "$ENVIRONMENT" 2>&1 | grep -q "already exists"; then
            echo "Skipping $key: already exists in Vercel"
        fi
    fi
done < .env

