#!/bin/bash

# deploy_vercel_app.sh
# A script to deploy the Vercel application

# Enable debugging
set -ex

# Define variables
PROJECT_ROOT=$(pwd)
CONFIG_DIR="${PROJECT_ROOT}/scripts/vercel"
CONFIG_FILE="${CONFIG_DIR}/vercel.json"

# Check if Vercel configuration file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Vercel configuration file not found: $CONFIG_FILE"
  exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI not found, installing..."
  npm install -g vercel
fi

# Navigate to the project root directory
cd "$PROJECT_ROOT"

# Deploy the application using Vercel
vercel --confirm

# Output the status of the deployment
vercel status

# Navigate back to the original directory
cd -

# Deployment complete
echo "Vercel app deployment complete."
