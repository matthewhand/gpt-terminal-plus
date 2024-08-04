#!/bin/bash

# deploy_codesandbox_app.sh
# A script to deploy the CodeSandbox application

# Enable debugging
set -ex

# Define variables
PROJECT_ROOT=$(pwd)

# Check if CodeSandbox CLI is installed
if ! command -v sandbox &> /dev/null; then
  echo "CodeSandbox CLI not found, installing..."
  npm install -g codesandbox
fi

# Navigate to the project root directory
cd "$PROJECT_ROOT"

# Login to CodeSandbox (requires user interaction)
sandbox login

# Initialize a new CodeSandbox project or link to an existing project
if [ ! -f ".codesandbox/config.json" ]; then
  sandbox init --name gpt-terminal-plus
else
  sandbox link
fi

# Deploy the application to CodeSandbox
sandbox deploy

# Output the status of the deployment
sandbox status

# Navigate back to the original directory
cd -

# Deployment complete
echo "CodeSandbox app deployment complete."
