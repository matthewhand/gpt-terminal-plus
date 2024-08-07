#!/bin/bash

# Enable debugging
set -ex

# Default environment is production
ENVIRONMENT="production"

# Check if an argument is provided and set it as the environment
if [ $# -gt 0 ]; then
  ENVIRONMENT="$1"
fi

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Set each environment variable in Vercel for the specified environment
while IFS='=' read -r key value; do
    if [[ ! -z $key && $key != \#* ]]; then
        echo "$value" | vercel env add "$key" "$ENVIRONMENT"
    fi
done < .env
