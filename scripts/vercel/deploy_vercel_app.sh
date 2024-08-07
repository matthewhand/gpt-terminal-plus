#!/bin/bash

# Enable debugging
set -ex

# Navigate to the project root directory
cd "$(dirname "$0")/../.."

# Define variables
CONFIG_FILE="./scripts/vercel/vercel.json"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI not found, installing..."
  npm install -g vercel
fi

# Deploy the application using Vercel with the specified configuration file
vercel --yes --local-config "$CONFIG_FILE"

# Deployment complete
echo "Vercel app deployment complete."
