#!/bin/bash

# deploy_netlify_app.sh
# A script to deploy the Netlify application

# Enable debugging
set -ex

# Define variables
PROJECT_ROOT=$(pwd)
CONFIG_DIR="${PROJECT_ROOT}/scripts/netlify"
CONFIG_FILE="${CONFIG_DIR}/netlify.toml"

# Check if Netlify configuration file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Netlify configuration file not found: $CONFIG_FILE"
  exit 1
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
  echo "Netlify CLI not found, installing..."
  npm install -g netlify-cli
fi

# Navigate to the project root directory
cd "$PROJECT_ROOT"

# Login to Netlify (requires user interaction)
netlify login

# Initialize a new Netlify site or link to an existing site
if [ ! -f ".netlify/state.json" ]; then
  netlify init
else
  netlify link
fi

# Deploy the application to Netlify
netlify deploy --prod --dir=build

# Output the status of the deployment
netlify status

# Navigate back to the original directory
cd -

# Deployment complete
echo "Netlify app deployment complete."
